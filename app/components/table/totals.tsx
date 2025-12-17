"use client"

import type { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TotalSales = {
  id: string
  tshirts: string
  hoodies: string
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
    accessorKey: "cogs",
    header: "Total COGS",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("cogs"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      
      return formatted
    },
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
  {
    accessorKey: "card",
    header: "Total Card Transactions",
  },
  {
    accessorKey: "cash",
    header: "Total Cash Transactions",
  },
]