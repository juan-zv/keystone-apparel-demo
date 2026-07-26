import * as React from "react"
import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Route } from "./+types/presales"

import { PageShell } from "@/components/page-shell"
import { StatSummaryCards } from "@/components/stat-summary-cards"

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
import { ChevronDown, ChartNoAxesCombined, DollarSign, Shirt, CheckCircle2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
} from "@tanstack/react-table"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
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

import { presaleColumns, completedPresaleColumns, type Presale } from '@/components/table/presale-columns'
import { formatCurrency } from "@/lib/labels"
import db from '@/lib/database'

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

    // Table for completed presales (simplified, no checkboxes)
    const completedTable = useReactTable({
        data: completedPresales,
        columns: completedPresaleColumns,
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

    const financialSummaryItems = [
        {
            label: "Unearned revenue",
            value: formatCurrency(unearnedRevenue),
            sublabel: `${pendingPresales.length} pending orders`,
            icon: DollarSign,
        },
        {
            label: "Unused COGS",
            value: formatCurrency(totalCOGS),
            sublabel: "Cost of pending inventory",
            icon: Shirt,
        },
    ]

    return (
        <PageShell
            title="Presales Management"
            badge="Demo · local storage"
            description="Fulfill advance orders by marking them sold — they are copied into Sales automatically."
        >
            {pendingPresales.length > 0 && (
                <div className="mb-6">
                    <StatSummaryCards items={financialSummaryItems} />
                </div>
            )}

            <Card className="border-border/60 bg-card/80 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Pending Presales Orders
                    </CardTitle>
                    <CardDescription>
                        View and manage pending presale orders. Select rows to mark them as sold.
                        <br />
                        Select one or more rows, then mark them sold to move them into Sales.
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
        </PageShell>
    )
}
