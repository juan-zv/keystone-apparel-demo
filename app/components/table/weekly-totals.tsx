"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { formatCurrency } from "@/lib/labels"

export type WeeklyTotals = {
  id: string
  weekPeriod: string
  tshirts: number
  hoodies: number
  stickers: number
  revenue: string
}

export const columns: ColumnDef<WeeklyTotals>[] = [
  {
    accessorKey: "weekPeriod",
    header: "Week Period",
  },
  {
    accessorKey: "tshirts",
    header: "T-Shirts",
  },
  {
    accessorKey: "hoodies",
    header: "Hoodies",
  },
  {
    accessorKey: "stickers",
    header: "Stickers",
  },
  {
    accessorKey: "revenue",
    header: "Total Revenue",
    cell: ({ row }) => formatCurrency(parseFloat(row.getValue("revenue"))),
  },
]
