"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { formatCurrency } from "@/lib/labels"

export type TotalSales = {
  id: string
  tshirts: string
  hoodies: string
  stickers: string
  cogs: string
  revenue: string
  card: number
  cash: number
}

export const columns: ColumnDef<TotalSales>[] = [
  {
    accessorKey: "tshirts",
    header: "T-Shirts Sold",
  },
  {
    accessorKey: "hoodies",
    header: "Hoodies Sold",
  },
  {
    accessorKey: "stickers",
    header: "Stickers Sold",
  },
  {
    accessorKey: "cogs",
    header: "Total COGS",
    cell: ({ row }) => formatCurrency(parseFloat(row.getValue("cogs"))),
  },
  {
    accessorKey: "revenue",
    header: "Total Revenue",
    cell: ({ row }) => formatCurrency(parseFloat(row.getValue("revenue"))),
  },
  {
    accessorKey: "card",
    header: "Card Transactions",
  },
  {
    accessorKey: "cash",
    header: "Cash Transactions",
  },
]
