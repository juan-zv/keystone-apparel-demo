import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import {
  formatCurrency,
  getColorLabel,
  getDesignLabel,
  getPaymentMethodLabel,
  getProductTypeLabel,
  getSizeLabel,
} from "@/lib/labels"
import { cn } from "@/lib/utils"

export type Presale = {
  id: string
  created_at: string
  product_type: string
  color: string | null
  design: string
  size: string | null
  price: number
  cogs?: number
  payment_method: string
  seller?: string
  notes?: string
  sold: boolean
  fulfilled_date?: string
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date & Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return (
        <div className="whitespace-nowrap">
          {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          <br />
          <span className="text-xs text-muted-foreground">
            {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "product_type",
    header: () => <div className="text-center">Product</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {getProductTypeLabel(row.getValue("product_type") as string)}
      </div>
    ),
  },
  {
    accessorKey: "color",
    header: () => <div className="text-center">Color</div>,
    cell: ({ row }) => (
      <div className="text-center">{getColorLabel(row.getValue("color") as string | null)}</div>
    ),
  },
  {
    accessorKey: "design",
    header: () => <div className="text-center">Design</div>,
    cell: ({ row }) => (
      <div className="text-center">{getDesignLabel(row.getValue("design") as string)}</div>
    ),
  },
  {
    accessorKey: "size",
    header: () => <div className="text-center">Size</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {getSizeLabel(row.getValue("size") as string | null, true)}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center">Price</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {formatCurrency(row.getValue<number>("price"))}
      </div>
    ),
  },
  {
    accessorKey: "payment_method",
    header: () => <div className="text-center">Payment</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {getPaymentMethodLabel(row.getValue("payment_method") as string)}
      </div>
    ),
  },
  {
    accessorKey: "seller",
    header: () => <div className="text-center">Seller</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("seller") || "—"}</div>,
  },
  {
    accessorKey: "notes",
    header: () => <div className="text-center">Notes</div>,
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string
      return (
        <div className="max-h-20 max-w-[10rem] overflow-y-auto text-left text-sm">
          {notes || "—"}
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
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
            sold
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
              : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
          )}
        >
          {sold ? "Sold" : "Pending"}
        </span>
      )
    },
  },
]

export const completedPresaleColumns: ColumnDef<Presale>[] = [
  {
    accessorKey: "created_at",
    header: "Ordered Date",
    cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString(),
  },
  {
    accessorKey: "product_type",
    header: "Type",
    cell: ({ row }) => getProductTypeLabel(row.getValue("product_type") as string),
  },
  {
    accessorKey: "design",
    header: "Design",
    cell: ({ row }) => getDesignLabel(row.getValue("design") as string),
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => getSizeLabel(row.getValue("size") as string | null, true),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatCurrency(row.getValue<number>("price")),
  },
  {
    accessorKey: "seller",
    header: "Seller",
    cell: ({ row }) => row.getValue("seller") || "—",
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string
      return (
        <div className="max-h-20 max-w-[12rem] overflow-y-auto text-left text-sm">
          {notes || "—"}
        </div>
      )
    },
  },
  {
    id: "completed_date",
    header: "Completed",
    cell: ({ row }) => {
      const date = row.original.fulfilled_date
        ? new Date(row.original.fulfilled_date)
        : null
      return date ? date.toLocaleDateString() : "—"
    },
  },
]
