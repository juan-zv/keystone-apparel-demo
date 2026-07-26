import { useState, useEffect, useMemo, useCallback } from "react"
import { CalendarIcon, ChartNoAxesCombined, DollarSign, Shirt, Sticker } from "lucide-react"

import { PageShell } from "@/components/page-shell"
import { StatSummaryCards } from "@/components/stat-summary-cards"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { DataTable } from "~/components/table/data-table"
import { columns, type Sale } from "@/components/table/columns"
import { columns as totalColumns, type TotalSales } from "@/components/table/totals"
import { columns as weeklyColumns, type WeeklyTotals } from "@/components/table/weekly-totals"
import { SellerStats } from "@/components/seller-stats"
import { DesignStats } from "@/components/design-stats"
import { designs, SELLERS } from "@/lib/product-data"
import { formatCurrency } from "@/lib/labels"
import db from "@/lib/database"
import type { Route } from "./+types/sales-report"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sales Report - Keystone Apparel" },
    { name: "description", content: "View sales analytics, reports, and performance metrics" },
  ]
}

async function getData(targetDate: Date): Promise<Sale[]> {
  const startOfDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  ).toISOString()
  const endOfDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate() + 1
  ).toISOString()

  const { data, error } = await db
    .from("Sales")
    .select("*")
    .gte("date", startOfDay)
    .lt("date", endOfDay)

  if (error) {
    console.error("Error fetching sales data:", error)
    return []
  }
  return data as Sale[]
}

async function getAllWeeklyData(): Promise<Sale[]> {
  const { data, error } = await db.from("Sales").select("*").order("date", { ascending: true })

  if (error) {
    console.error("Error fetching all sales data:", error)
    return []
  }
  return data as Sale[]
}

export default function SalesReport() {
  const [data, setData] = useState<Sale[]>([])
  const [totals, setTotals] = useState<TotalSales | null>(null)
  const [weeklyTotals, setWeeklyTotals] = useState<WeeklyTotals[]>([])
  const [allTimeData, setAllTimeData] = useState<Sale[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const sellerStats = useMemo(() => {
    const sellerCounts = new Map<string, number>()
    SELLERS.forEach((seller) => sellerCounts.set(seller, 0))

    allTimeData.forEach((sale) => {
      if (sale.seller && SELLERS.includes(sale.seller as (typeof SELLERS)[number])) {
        sellerCounts.set(sale.seller, (sellerCounts.get(sale.seller) || 0) + 1)
      }
    })

    return Array.from(sellerCounts.entries()).map(([name, count]) => ({ name, count }))
  }, [allTimeData])

  const designStats = useMemo(() => {
    const designCounts = new Map<string, number>(
      designs.map((d) => [d.value, 0])
    )

    allTimeData.forEach((sale) => {
      if (sale.design) {
        designCounts.set(sale.design, (designCounts.get(sale.design) ?? 0) + 1)
      }
    })

    return designs.map((d) => ({
      name: d.label,
      count: designCounts.get(d.value) ?? 0,
    }))
  }, [allTimeData])

  const loadWeeklyTotals = useCallback(async () => {
    const allData = await getAllWeeklyData()
    setAllTimeData(allData)

    if (allData.length === 0) {
      setWeeklyTotals([])
      return
    }

    const firstWeekStart = new Date("2025-10-10T00:00:00")
    const weekLengthMs = 7 * 24 * 60 * 60 * 1000
    const financialWeekGroups = new Map<number, Sale[]>()

    allData.forEach((sale) => {
      const saleDate = new Date(sale.date)
      const timeDiff = saleDate.getTime() - firstWeekStart.getTime()
      const weekNumber = Math.floor(timeDiff / weekLengthMs)

      if (weekNumber >= 0) {
        if (!financialWeekGroups.has(weekNumber)) {
          financialWeekGroups.set(weekNumber, [])
        }
        financialWeekGroups.get(weekNumber)!.push(sale)
      }
    })

    const financialWeeks: WeeklyTotals[] = Array.from(financialWeekGroups.entries())
      .sort(([a], [b]) => a - b)
      .map(([weekNumber, sales]) => {
        const weekStart = new Date(firstWeekStart.getTime() + weekNumber * weekLengthMs)
        const weekEnd = new Date(weekStart.getTime() + weekLengthMs - 1)
        const formatShort = (d: Date) =>
          d.toLocaleDateString("en-US", { month: "short", day: "numeric" })

        return {
          id: `ibc-week-${weekNumber}`,
          weekPeriod: `${formatShort(weekStart)} - ${formatShort(weekEnd)}`,
          tshirts: sales.filter((sale) => sale.product_type === "tshirt").length,
          hoodies: sales.filter((sale) => sale.product_type === "hoodie").length,
          stickers: sales.filter((sale) => sale.product_type === "sticker").length,
          revenue: sales.reduce((sum, sale) => sum + sale.price, 0).toFixed(2),
        }
      })

    setWeeklyTotals(financialWeeks)
  }, [])

  const handleGenerateReport = useCallback(async () => {
    setLoading(true)
    const apiData = await getData(selectedDate)
    setData(apiData)

    const totalTshirts = apiData.filter((sale) => sale.product_type === "tshirt").length
    const totalHoodies = apiData.filter((sale) => sale.product_type === "hoodie").length
    const totalStickers = apiData.filter((sale) => sale.product_type === "sticker").length
    const totalCogs = apiData.reduce((sum, sale) => sum + (sale.cogs || 0), 0)
    const totalRevenue = apiData.reduce((sum, sale) => sum + sale.price, 0)

    setTotals({
      id: "totals",
      tshirts: totalTshirts.toString(),
      hoodies: totalHoodies.toString(),
      stickers: totalStickers.toString(),
      cogs: totalCogs.toFixed(2),
      revenue: totalRevenue.toFixed(2),
      card: apiData.filter((sale) => sale.payment_method === "card").length,
      cash: apiData.filter((sale) => sale.payment_method === "cash").length,
    })

    setLoading(false)
  }, [selectedDate])

  useEffect(() => {
    loadWeeklyTotals()
    handleGenerateReport()
  }, [selectedDate])

  const dailySummaryItems = totals
    ? [
        {
          label: "Revenue",
          value: formatCurrency(parseFloat(totals.revenue)),
          icon: DollarSign,
        },
        {
          label: "T-Shirts",
          value: totals.tshirts,
          icon: Shirt,
        },
        {
          label: "Hoodies",
          value: totals.hoodies,
          icon: Shirt,
        },
        {
          label: "Stickers",
          value: totals.stickers,
          icon: Sticker,
        },
      ]
    : []

  return (
    <PageShell
      title="Sales Report"
      badge="Demo · local storage"
      description="Daily breakdowns, weekly IBC totals, and all-time seller and design performance."
    >
      <Card className="border-border/60 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            Sales Report Generator
            <DropdownMenu open={calendarOpen} onOpenChange={setCalendarOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date)
                      setCalendarOpen(false)
                    }
                  }}
                  initialFocus
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
          <CardDescription>
            Select a date to view line items and totals. Weekly buckets use the IBC financial calendar.
          </CardDescription>
        </CardHeader>
        <CardContent className={`space-y-6 ${loading ? "pointer-events-none opacity-50" : ""}`}>
          {dailySummaryItems.length > 0 && (
            <StatSummaryCards items={dailySummaryItems} />
          )}

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">For {formatDate(selectedDate)}</h2>
            <DataTable
              columns={columns}
              data={data}
              emptyMessage="No sales recorded for this date."
            />
            <DataTable columns={totalColumns} data={totals ? [totals] : []} emptyMessage="No totals yet." />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Weekly Totals</h2>
            <DataTable
              columns={weeklyColumns}
              data={weeklyTotals}
              emptyMessage="No weekly data yet. Record sales to see IBC week totals."
            />
          </section>
        </CardContent>
        <CardFooter>
          <CardDescription className="flex items-center">
            <ChartNoAxesCombined className="mr-2 h-4 w-4" />
            v0.2.1 · Made by Juansito with a LOT of love ❤️ ©2025
          </CardDescription>
        </CardFooter>
      </Card>

      <div className="mt-6 space-y-6">
        <SellerStats sellerStats={sellerStats} />
        <DesignStats designStats={designStats} />
      </div>
    </PageShell>
  )
}
