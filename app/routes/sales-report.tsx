import * as React from "react"
import { useState, useEffect, useMemo, useCallback } from 'react'

import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { ChartNoAxesCombined, CalendarIcon } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { DataTable } from '~/components/table/data-table'

import { columns, type Sale } from '@/components/table/columns'
import { columns as totalColumns, type TotalSales } from '@/components/table/totals'
import { columns as weeklyColumns, type WeeklyTotals } from '@/components/table/weekly-totals'
import { SellerStats, type SellerStat } from '@/components/seller-stats'
import { DesignStats, type DesignStat } from '@/components/design-stats'

import db from '@/lib/database'
import type { Route } from "./+types/sales-report"
import { NavHeader } from "@/components/nav-header"

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Sales Report - Keystone Apparel" },
        { name: "description", content: "View sales analytics, reports, and performance metrics" },
    ]
}

async function getData(targetDate: Date): Promise<Sale[]> {
    // Fetch data from your API here.
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).toISOString()
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1).toISOString()

    const { data, error } = await db
        .from('Sales')
        .select('*')
        .gte('date', startOfDay)
        .lt('date', endOfDay)

    if (error) {
        console.error('Error fetching sales data:', error)
        return []
    }
    return data as Sale[]
}

async function getAllWeeklyData(): Promise<Sale[]> {
    // Get all sales data from the database
    const { data, error } = await db
        .from('Sales')
        .select('*')
        .order('date', { ascending: true })

    if (error) {
        console.error('Error fetching all sales data:', error)
        return []
    }
    return data as Sale[]
}

const SELLERS = [
    "Juan", "Lydia", "Corbyn", "Hailee", "Joseph", "Jason", "Anabella",
    "Cortland", "Diego", "Ally", "Kayla", "Makall", "Michael", "Price",
    "Katie", "Carter", "Jessica"
] as const

export default function SalesReport({ params }: Route.ComponentProps) {
    const [data, setData] = useState<Sale[]>([])
    const [totals, setTotals] = useState<TotalSales | null>(null)
    const [weeklyTotals, setWeeklyTotals] = useState<WeeklyTotals[]>([])
    const [allTimeData, setAllTimeData] = useState<Sale[]>([]) // Cache all-time data
    const [loading, setLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [calendarOpen, setCalendarOpen] = useState(false)

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }

    // Memoize seller statistics calculation
    const sellerStats: SellerStat[] = useMemo(() => {
        const sellerCounts = new Map<string, number>()
        SELLERS.forEach(seller => sellerCounts.set(seller, 0))

        allTimeData.forEach(sale => {
            if (sale.seller && SELLERS.includes(sale.seller as any)) {
                sellerCounts.set(sale.seller, (sellerCounts.get(sale.seller) || 0) + 1)
            }
        })

        return Array.from(sellerCounts.entries()).map(([name, count]) => ({
            name,
            count
        }))
    }, [allTimeData])

    // Memoize design statistics calculation
    const designStats: DesignStat[] = useMemo(() => {
        const designMap: Record<string, string> = {
            "child-of-god": "Child of God",
            "doubt-not": "Doubt Not",
            "line-upon-line": "Line Upon Line",
            "death-has-no-sting": "Death has No Sting",
            "endure-to-the-end": "Endure to the End",
            "look-to-god": "Look to God",
            "hands-of-god": "Hands of God",
        }

        const designCounts = new Map<string, number>()
        Object.keys(designMap).forEach(design => designCounts.set(design, 0))

        allTimeData.forEach(sale => {
            if (sale.design) {
                designCounts.set(sale.design, (designCounts.get(sale.design) || 0) + 1)
            }
        })

        return Array.from(designCounts.entries()).map(([design, count]) => ({
            name: designMap[design] || design,
            count
        }))
    }, [allTimeData])

    const loadWeeklyTotals = useCallback(async () => {
        const allData = await getAllWeeklyData()
        setAllTimeData(allData) // Cache all-time data

        if (allData.length === 0) {
            setWeeklyTotals([])
            return
        }

        // IBC Financial Week starts on Oct 12, 2025 (Sunday) and runs for 7 days
        const firstWeekStart = new Date('2025-10-10T00:00:00')
        const weekLengthMs = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

        // Group sales by IBC Financial Week
        const financialWeekGroups = new Map<number, Sale[]>()

        allData.forEach(sale => {
            const saleDate = new Date(sale.date)

            // Calculate which week this sale belongs to
            const timeDiff = saleDate.getTime() - firstWeekStart.getTime()
            const weekNumber = Math.floor(timeDiff / weekLengthMs)

            // Only include sales that are on or after the first week start
            if (weekNumber >= 0) {
                if (!financialWeekGroups.has(weekNumber)) {
                    financialWeekGroups.set(weekNumber, [])
                }
                financialWeekGroups.get(weekNumber)!.push(sale)
            }
        })

        // Convert to array and calculate totals for each IBC Financial Week
        const financialWeeks: WeeklyTotals[] = Array.from(financialWeekGroups.entries())
            .sort(([a], [b]) => a - b) // Sort by week number
            .map(([weekNumber, sales]) => {
                const weekStart = new Date(firstWeekStart.getTime() + (weekNumber * weekLengthMs))
                const weekEnd = new Date(weekStart.getTime() + weekLengthMs - 1) // End is 6 days 23:59:59 later

                const formatShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                const weekPeriod = `${formatShort(weekStart)} - ${formatShort(weekEnd)}`

                const tshirts = sales.filter(sale => sale.product_type === 'tshirt').length
                const hoodies = sales.filter(sale => sale.product_type === 'hoodie').length
                const revenue = sales.reduce((sum, sale) => sum + sale.price, 0)

                return {
                    id: `ibc-week-${weekNumber}`,
                    weekPeriod,
                    tshirts,
                    hoodies,
                    revenue: revenue.toFixed(2),
                }
            })

        setWeeklyTotals(financialWeeks)
    }, [])

    const handleGenerateReport = useCallback(async () => {
        setLoading(true)
        const apiData = await getData(selectedDate)
        setData(apiData)

        // Calculate daily totals
        const totalTshirts = apiData.filter(sale => sale.product_type === 'tshirt').length
        const totalHoodies = apiData.filter(sale => sale.product_type === 'hoodie').length
        const totalCogs = apiData.reduce((sum, sale) => sum + (sale.cogs || 0), 0)
        const totalRevenue = apiData.reduce((sum, sale) => sum + sale.price, 0)
        const totalCard = apiData.filter(sale => sale.payment_method === 'card').length
        const totalCash = apiData.filter(sale => sale.payment_method === 'cash').length

        // Set daily totals state
        setTotals({
            id: 'totals',
            tshirts: totalTshirts.toString(),
            hoodies: totalHoodies.toString(),
            cogs: totalCogs.toFixed(2),
            revenue: totalRevenue.toFixed(2),
            card: totalCard,
            cash: totalCash,
        })

        setLoading(false)
    }, [selectedDate])

    useEffect(() => {
        loadWeeklyTotals()
        handleGenerateReport()
    }, [selectedDate])

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <NavHeader />
            <h1 className="text-2xl font-bold text-center my-4">Sales Report - DEMO version</h1>
            <Card className="my-1.5 p-4 w-[90%] mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Sales Report Generator
                        <DropdownMenu open={calendarOpen} onOpenChange={setCalendarOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="ml-2">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                        Generate sales reports from Keystone database with a single click!
                        <br />
                        NOTE: It is under development, so please be patient with any bugs or issues.
                        <br />
                        Thank you for your understanding and support!
                    </CardDescription>
                </CardHeader>
                <CardContent className={`space-y-3 ${loading ? 'opacity-50' : ''}`}>
                    <CardTitle className="text-justify">For {formatDate(selectedDate)}:</CardTitle>
                    <DataTable columns={columns} data={data} />
                    <DataTable columns={totalColumns} data={totals ? [totals] : []} />

                    <CardTitle className="text-justify mt-6">Weekly Totals:</CardTitle>
                    <DataTable columns={weeklyColumns} data={weeklyTotals} />

                </CardContent>
                <CardFooter>
                    <CardDescription className="flex items-center">
                        <ChartNoAxesCombined className="mr-2 h-4 w-4" />
                        v0.2.0 | Made by Juansito with a LOT of love ❤️ ©2025
                    </CardDescription>
                </CardFooter>
            </Card>
            <div className="w-[90%] mt-6 mx-auto">
                <SellerStats sellerStats={sellerStats} />
            </div>

            <div className="w-[90%] mt-6 mx-auto">
                <DesignStats designStats={designStats} />
            </div>
            <footer className="flex flex-col my-4 w-full items-center ">
                <a rel="noopener" target="_blank" href="https://www.juanzurita.dev">Juansito</a>
            </footer>
        </ThemeProvider>
    )
}
