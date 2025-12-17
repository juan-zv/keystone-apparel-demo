"use client"

import type { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
export type WeeklyTotals = {
  id: string
  weekPeriod: string
  tshirts: number
  hoodies: number
  revenue: string
}

export const columns: ColumnDef<WeeklyTotals>[] = [
  {
    accessorKey: "weekPeriod",
    header: "Week Period",
  },
  {
    accessorKey: "tshirts",
    header: "T-Shirts Sold",
  },
  {
    accessorKey: "hoodies",
    header: "Hoodies Sold",
  },
  {
    accessorKey: "revenue",
    header: "Total Revenue",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("revenue"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return formatted
    },
  },
]
