import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export type Presale = {
    id: string
    created_at: string
    product_type: string
    color: string
    design: string
    size: string
    price: number
    cogs?: number
    payment_method: string
    seller?: string
    notes?: string
    sold: boolean
    fulfilled_date?: string
}

const productTypeMap: Record<string, string> = {
    tshirt: "T-Shirt",
    hoodie: "Hoodie",
    sticker: "Sticker",
}

const colorMap: Record<string, string> = {
    black: "Black",
    grey: "Grey",
    green: "Green",
    brown: "Brown",
    blue: "Blue",
}

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

const sizeMap: Record<string, string> = {
    small: "S",
    medium: "M",
    large: "L",
    xl: "XL",
    xxl: "2XL",
    xxxl: "3XL",
    "one-size": "One Size",
}

const paymentMethodMap: Record<string, string> = {
    card: "Card",
    cash: "Cash",
}

export const presaleColumns: ColumnDef<Presale>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    disabled={row.original.sold}
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date & Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"))
            return (
                <div className="whitespace-nowrap">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    <br />
                    <span className="text-xs text-muted-foreground">
                        {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "product_type",
        header: () => <div className="text-center">Product</div>,
        cell: ({ row }) => {
            const productType = row.getValue("product_type") as string
            return <div className="text-center">{productTypeMap[productType] || productType}</div>
        },
    },
    {
        accessorKey: "color",
        header: () => <div className="text-center">Color</div>,
        cell: ({ row }) => {
            const color = row.getValue("color") as string
            return <div className="text-center">{color ? (colorMap[color] || color) : "N/A"}</div>
        },
    },
    {
        accessorKey: "design",
        header: () => <div className="text-center">Design</div>,
        cell: ({ row }) => {
            const design = row.getValue("design") as string
            return <div className="text-center">{designMap[design] || design}</div>
        },
    },
    {
        accessorKey: "size",
        header: () => <div className="text-center">Size</div>,
        cell: ({ row }) => {
            const size = row.getValue("size") as string
            return <div className="text-center">{size ? (sizeMap[size] || size) : "N/A"}</div>
        },
    },
    {
        accessorKey: "price",
        header: () => <div className="text-center">Price</div>,
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(price)
            return <div className="text-center font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "payment_method",
        header: () => <div className="text-center">Payment</div>,
        cell: ({ row }) => {
            const paymentMethod = row.getValue("payment_method") as string
            return <div className="text-center">{paymentMethodMap[paymentMethod] || paymentMethod}</div>
        },
    },
    {
        accessorKey: "seller",
        header: () => <div className="text-center">Seller</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("seller") || "-"}</div>,
    },
    {
        accessorKey: "notes",
        header: () => <div className="text-center">Notes</div>,
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
        accessorKey: "sold",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            const sold = row.getValue("sold")
            return (
                <div className={`text-center ${sold ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}`}>
                    {sold ? "Sold" : "Pending"}
                </div>
            )
        },
    },
]
