"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  formatCurrency,
  getColorLabel,
  getDesignLabel,
  getPaymentMethodLabel,
  getProductTypeLabel,
  getSizeLabel,
} from "@/lib/labels"

export type Sale = {
  id: string
  date: string
  product_type: string
  color: string | null
  design: string
  size: string | null
  cogs: number
  price: number
  payment_method: string
  seller?: string
  notes: string
}

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "date",
    header: "Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date") as string)
      return date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    },
  },
  {
    accessorKey: "product_type",
    header: "Type",
    cell: ({ row }) => getProductTypeLabel(row.getValue("product_type") as string),
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => getColorLabel(row.getValue("color") as string | null),
  },
  {
    accessorKey: "design",
    header: "Design",
    cell: ({ row }) => getDesignLabel(row.getValue("design") as string),
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => getSizeLabel(row.getValue("size") as string | null),
  },
  {
    accessorKey: "seller",
    header: "Seller",
    cell: ({ row }) => row.getValue("seller") || "—",
  },
  {
    accessorKey: "cogs",
    header: "COGS",
    cell: ({ row }) => formatCurrency(row.getValue("cogs") as number),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatCurrency(row.getValue("price") as number),
  },
  {
    accessorKey: "payment_method",
    header: "Payment",
    cell: ({ row }) => getPaymentMethodLabel(row.getValue("payment_method") as string),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string
      return notes ? (
        <span className="line-clamp-2 max-w-[12rem] text-left text-sm">{notes}</span>
      ) : (
        "—"
      )
    },
  },
]
