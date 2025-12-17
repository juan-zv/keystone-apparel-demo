import * as React from "react"
import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Route } from "./+types/presales"

import { ThemeProvider } from "@/components/theme-provider"
import { NavHeader } from "@/components/nav-header"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Input } from "@/components/ui/input"
import { ChevronDown, ChartNoAxesCombined } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
} from "@tanstack/react-table"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { presaleColumns, type Presale } from '@/components/table/presale-columns'
import { DataTable } from '~/components/table/data-table'
import db from '@/lib/database'

type PresaleFinancials = {
    id: string
    totalCOGS: string
    totalUnearnedRevenue: string
}

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Presales - Keystone Apparel" },
        { name: "description", content: "Manage presale orders and mark them as sold" },
    ]
}

async function getPresalesData(): Promise<Presale[]> {
    const { data, error } = await db
        .from('presales')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching presales data:', error)
        return []
    }
    return data as Presale[]
}

async function markAsSold(ids: string[], presales: Presale[]): Promise<boolean> {
    // Get presales that will be marked as sold
    const presalesToSell = presales.filter(presale => ids.includes(presale.id))
    
    // Insert into Sales table first with the current timestamp
    const currentDate = new Date().toISOString()
    const salesData = presalesToSell.map(presale => ({
        date: currentDate,
        product_type: presale.product_type,
        color: presale.color,
        design: presale.design,
        size: presale.size,
        price: presale.price,
        cogs: presale.cogs || 0,
        payment_method: presale.payment_method,
        seller: presale.seller,
        notes: presale.notes,
    }))

    const { data: insertedSales, error: insertError } = await db
        .from('Sales')
        .insert(salesData)
        .select()

    if (insertError) {
        console.error('Error inserting into Sales:', insertError)
        return false
    }

    // Update presales to mark as sold and set fulfilled_date
    // Since all sales were inserted with the same timestamp, we can use that for all presales
    const { error: updateError } = await db
        .from('presales')
        .update({ 
            sold: true,
            fulfilled_date: currentDate
        })
        .in('id', ids)

    if (updateError) {
        console.error('Error updating presales:', updateError)
        return false
    }

    return true
}

export default function Presales({ params }: Route.ComponentProps) {
    const [data, setData] = useState<Presale[]>([])
    const [loading, setLoading] = useState(true)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
    const [selectedIdsForSale, setSelectedIdsForSale] = useState<string[]>([])

    // Separate pending and completed presales
    const pendingPresales = useMemo(() => data.filter(presale => !presale.sold), [data])
    const completedPresales = useMemo(() => data.filter(presale => presale.sold), [data])

    // Calculate financial metrics for pending (unsold) presales only
    const totalCOGS = useMemo(() => 
        pendingPresales.reduce((sum, presale) => sum + (presale.cogs || 0), 0),
        [pendingPresales]
    )
    const unearnedRevenue = useMemo(() => 
        pendingPresales.reduce((sum, presale) => sum + presale.price, 0),
        [pendingPresales]
    )

    const financials: PresaleFinancials = useMemo(() => ({
        id: 'financials',
        totalCOGS: `$${totalCOGS.toFixed(2)}`,
        totalUnearnedRevenue: `$${unearnedRevenue.toFixed(2)}`,
    }), [totalCOGS, unearnedRevenue])

    const financialColumns = useMemo(() => [
        {
            accessorKey: "totalCOGS",
            header: "Total Unused COGS",
        },
        {
            accessorKey: "totalUnearnedRevenue",
            header: "Total Unearned Revenue",
        },
    ], [])

    const loadData = useCallback(async () => {
        setLoading(true)
        const presalesData = await getPresalesData()
        setData(presalesData)
        setLoading(false)
    }, [])

    useEffect(() => {
        loadData()
    }, [loadData])

    // Table for pending presales (with checkboxes)
    const table = useReactTable({
        data: pendingPresales,
        columns: presaleColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    // Simplified columns for completed presales (no checkboxes)
    const completedColumns: ColumnDef<Presale>[] = useMemo(() => [
        {
            accessorKey: "created_at",
            header: "Ordered Date",
            cell: ({ row }) => {
                const date = new Date(row.getValue("created_at"))
                return date.toLocaleDateString()
            },
        },
        {
            accessorKey: "product_type",
            header: "Type",
            cell: ({ row }) => {
                const typeMap: Record<string, string> = {
                    tshirt: "T-Shirt",
                    hoodie: "Hoodie",
                    sticker: "Sticker",
                }
                const value = row.getValue("product_type") as string
                return typeMap[value] || value
            },
        },
        {
            accessorKey: "design",
            header: "Design",
            cell: ({ row }) => {
                const designMap: Record<string, string> = {
                    "child-of-god": "Child of God",
                    "doubt-not": "Doubt Not",
                    "line-upon-line": "Line Upon Line",
                    "death-has-no-sting": "Death has No Sting",
                    "endure-to-the-end": "Endure to the End",
                    "look-to-god": "Look to God",
                    "hands-of-god": "Hands of God",
                    "king-of-kings": "King of Kings",
                    "walk-with-me": "Walk With Me",
                    "feared-man-more-than-god": "Feared Man More than God",
                    "love-like-he-did": "Love Like He Did",
                }
                const value = row.getValue("design") as string
                return designMap[value] || value
            },
        },
        {
            accessorKey: "size",
            header: "Size",
            cell: ({ row }) => {
                const sizeMap: Record<string, string> = {
                    small: "S",
                    medium: "M",
                    large: "L",
                    xl: "XL",
                    xxl: "2XL",
                    xxxl: "3XL",
                    "one-size": "One Size",
                }
                const value = row.getValue("size") as string
                return sizeMap[value] || value || "N/A"
            },
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => `$${row.getValue<number>("price").toFixed(2)}`,
        },
        {
            accessorKey: "seller",
            header: "Seller",
            cell: ({ row }) => row.getValue("seller") || "N/A",
        },
        {
            accessorKey: "notes",
            header: "Notes",
            cell: ({ row }) => {
                const notes = row.getValue("notes") as string
                return (
                    <div className="max-w-full max-h-20 overflow-y-auto text-left">
                        {notes || "-"}
                    </div>
                )
            },
        },
        {
            id: "completed_date",
            header: "Completed Date",
            cell: ({ row }) => {
                // Use fulfilled_date (when presale was marked as sold)
                const presale = row.original
                const date = presale.fulfilled_date ? new Date(presale.fulfilled_date) : null
                return date ? date.toLocaleDateString() : "N/A"
            },
        },
    ], [])

    // Table for completed presales (simplified, no checkboxes)
    const completedTable = useReactTable({
        data: completedPresales,
        columns: completedColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    const handleMarkAsSold = useCallback(async () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        const selectedIds = selectedRows.map(row => row.original.id)

        if (selectedIds.length === 0) {
            alert("Please select at least one presale to mark as sold.")
            return
        }

        // Open confirmation dialog instead of window.confirm
        setSelectedIdsForSale(selectedIds)
        setIsConfirmDialogOpen(true)
    }, [table])

    const confirmMarkAsSold = useCallback(async () => {
        setIsConfirmDialogOpen(false)
        
        const success = await markAsSold(selectedIdsForSale, data)
        if (success) {
            // open success dialog instead of using alert
            setRowSelection({})
            loadData()
            setIsSuccessDialogOpen(true)
        } else {
            alert("Failed to update presales. Please try again.")
        }
        
        setSelectedIdsForSale([])
    }, [selectedIdsForSale, data, loadData])

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <NavHeader />
            <h1 className="text-2xl font-bold text-center my-4">Presales Management - DEMO version</h1>
            
            <Card className="my-1.5 p-4 w-[90%] mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Pending Presales Orders
                    </CardTitle>
                    <CardDescription>
                        View and manage pending presale orders. Select rows to mark them as sold.
                        <br />
                        NOTE: This feature is under development, so please be patient with any bugs or issues.
                    </CardDescription>
                </CardHeader>
                <CardContent className={`space-y-3 ${loading ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between py-4">
                        <Input
                            placeholder="Filter by seller..."
                            value={(table.getColumn("seller")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("seller")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="ml-auto">
                                        Columns <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => {
                                            return (
                                                <DropdownMenuCheckboxItem
                                                    key={column.id}
                                                    className="capitalize"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) =>
                                                        column.toggleVisibility(!!value)
                                                    }
                                                >
                                                    {column.id}
                                                </DropdownMenuCheckboxItem>
                                            )
                                        })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={presaleColumns.length}
                                            className="h-24 text-center"
                                        >
                                            No presales found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between py-4">
                        <div className="text-muted-foreground text-sm">
                            {table.getFilteredSelectedRowModel().rows.length} of{" "}
                            {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
                        <Button
                            onClick={handleMarkAsSold}
                            disabled={table.getFilteredSelectedRowModel().rows.length === 0}
                            variant="destructive"
                        >
                            Mark as Sold ({table.getFilteredSelectedRowModel().rows.length})
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <CardDescription className="flex items-center">
                        <ChartNoAxesCombined className="mr-2 h-4 w-4" />
                        v0.2.0 | Made by Juansito with a LOT of love ❤️ ©2025
                    </CardDescription>
                </CardFooter>
            </Card>

            {/* Completed Presales Table */}
            <Card className="my-4 p-4 w-[90%] mx-auto">
                <CardHeader>
                    <CardTitle>Completed Presales</CardTitle>
                    <CardDescription>
                        View presales that have been marked as sold ({completedPresales.length} items)
                    </CardDescription>
                </CardHeader>
                <CardContent className={`space-y-3 ${loading ? 'opacity-50' : ''}`}>
                    <div className="overflow-hidden rounded-md border">
                        <Table>
                            <TableHeader>
                                {completedTable.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {completedTable.getRowModel().rows?.length ? (
                                    completedTable.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={completedColumns.length}
                                            className="h-24 text-center"
                                        >
                                            No completed presales found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardFooter>
                    <CardDescription className="flex items-center">
                        <ChartNoAxesCombined className="mr-2 h-4 w-4" />
                        v0.2.0 | Made by Juansito with a LOT of love ❤️ ©2025
                    </CardDescription>
                </CardFooter>
            </Card>

            <Card className="my-4 p-4 w-[90%] mx-auto">
                <CardHeader>
                    <CardTitle>Financial Summary (Pending Presales Only)</CardTitle>
                    <CardDescription>
                        Total COGS and unearned revenue for items with status "Pending" ({pendingPresales.length} items)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={financialColumns} data={[financials]} />
                </CardContent>
                <CardFooter>
                    <CardDescription className="flex items-center">
                        <ChartNoAxesCombined className="mr-2 h-4 w-4" />
                        v0.2.0 | Made by Juansito with a LOT of love ❤️ ©2025
                    </CardDescription>
                </CardFooter>
            </Card>

            <footer className="flex flex-col my-4 w-full items-center ">
                <a rel="noopener" target="_blank" href="https://www.juanzurita.dev">Juansito</a>
            </footer>
            
            {/* Confirmation dialog for marking presales as sold */}
            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Mark as Sold</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to mark {selectedIdsForSale.length} presale(s) as sold? 
                            This will also add them to the Sales table.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsConfirmDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmMarkAsSold}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Success dialog shown after marking selected presales as sold */}
            <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Success!</DialogTitle>
                        <DialogDescription>
                            The sale has been saved successfully.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsSuccessDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    )
}
