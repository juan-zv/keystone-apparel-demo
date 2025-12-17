"use client"

import type { ColumnDef } from "@tanstack/react-table"

const productTypes = [
  { label: "T-Shirt", value: "tshirt" },
  { label: "Hoodie", value: "hoodie" },
] as const

const colors = [
  { label: "Black", value: "black" },
  { label: "Grey", value: "grey" },
  { label: "Green", value: "green" },
  { label: "Brown", value: "brown" },
  { label: "Blue", value: "blue" },
] as const

const designs = [
  { label: "Child of God", value: "child-of-god" },
  { label: "Doubt Not", value: "doubt-not" },
  { label: "Line Upon Line", value: "line-upon-line" },
  { label: "Death has No Sting", value: "death-has-no-sting" },
  { label: "Endure to the End", value: "endure-to-the-end" },
  { label: "Look to God", value: "look-to-god" },
  { label: "Hands of God", value: "hands-of-god" },
] as const

const sizes = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
  { label: "XL", value: "xl" },
  { label: "2XL", value: "xxl" },
] as const

const transactionTypes = [
  { label: "Card", value: "card" },
  { label: "Cash", value: "cash" },
] as const

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Sale = {
  id: string
  date: string
  product_type: string
  color: string
  design: string
  size: string
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
      const dateString = row.getValue("date") as string
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        // month: 'short',
        // day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    },
  },
  {
    accessorKey: "product_type",
    header: "Type",
    cell: ({ row }) => {
      const value = row.getValue("product_type") as string
      const product = productTypes.find(p => p.value === value)
      return product?.label || value
    },
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      const value = row.getValue("color") as string
      const color = colors.find(c => c.value === value)
      return color?.label || value
    },
  },
  {
    accessorKey: "design",
    header: "Design",
    cell: ({ row }) => {
      const value = row.getValue("design") as string
      const design = designs.find(d => d.value === value)
      return design?.label || value
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const value = row.getValue("size") as string
      const size = sizes.find(s => s.value === value)
      return size?.label || value
    },
  },
  {
    accessorKey: "cogs",
    header: "COGS",
    cell: ({ row }) => {
      const amount = row.getValue("cogs") as number
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const amount = row.getValue("price") as number
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return formatted
    },
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
    cell: ({ row }) => {
      const value = row.getValue("payment_method") as string
      const transaction = transactionTypes.find(t => t.value === value)
      return transaction?.label || value
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
]