import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Trophy, UserCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SellerStat {
  name: string
  count: number
}

interface SellerStatsProps {
  sellerStats: SellerStat[]
}

export function SellerStats({ sellerStats }: SellerStatsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showOnlyActive, setShowOnlyActive] = useState(false)

  const sortedStats = [...sellerStats].sort((a, b) => b.count - a.count)
  const totalSales = sortedStats.reduce((sum, s) => sum + s.count, 0)
  const withSales = sortedStats.filter((s) => s.count > 0)
  const maxCount = sortedStats[0]?.count || 1

  const filteredStats = sortedStats.filter((seller) => {
    const matchesSearch = seller.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesActive = showOnlyActive ? seller.count > 0 : true
    return matchesSearch && matchesActive
  })

  return (
    <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Trophy className="h-5 w-5 text-amber-500" />
              Seller Leaderboard & Performance
            </CardTitle>
            <CardDescription className="mt-1">
              {totalSales} total items sold · <span className="font-semibold text-foreground">{withSales.length}</span> active sellers
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Find seller..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-9"
              />
            </div>
            <button
              onClick={() => setShowOnlyActive(!showOnlyActive)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium border transition-colors cursor-pointer",
                showOnlyActive
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border bg-muted/40 text-muted-foreground hover:bg-muted"
              )}
            >
              <UserCheck className="h-3.5 w-3.5" />
              Active
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredStats.map((seller) => {
            const rankIndex = sortedStats.findIndex((s) => s.name === seller.name)
            const isTop3 = seller.count > 0 && rankIndex < 3
            const percentage = totalSales > 0 ? Math.round((seller.count / totalSales) * 100) : 0
            const progressWidth = maxCount > 0 ? `${(seller.count / maxCount) * 100}%` : "0%"

            let rankBadge = null
            if (seller.count > 0) {
              if (rankIndex === 0) rankBadge = "🥇"
              else if (rankIndex === 1) rankBadge = "🥈"
              else if (rankIndex === 2) rankBadge = "🥉"
            }

            return (
              <Card
                key={seller.name}
                className={cn(
                  "relative flex flex-col justify-between overflow-hidden border p-3.5 transition-all duration-200",
                  seller.count > 0
                    ? isTop3
                      ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60 shadow-xs"
                      : "border-border/60 bg-background/50 hover:border-primary/40 hover:shadow-xs"
                    : "border-border/30 bg-muted/20 opacity-50"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <p className="font-semibold text-sm truncate text-foreground">{seller.name}</p>
                    {rankBadge && <span className="text-base leading-none">{rankBadge}</span>}
                  </div>

                  <div className="flex items-baseline gap-1.5 my-1">
                    <span
                      className={cn(
                        "text-2xl font-black tabular-nums tracking-tight",
                        seller.count > 0 ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {seller.count}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {seller.count === 1 ? "sale" : "sales"}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1 font-medium">
                    <span>Share</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        rankIndex === 0
                          ? "bg-amber-500"
                          : rankIndex === 1
                          ? "bg-slate-400"
                          : rankIndex === 2
                          ? "bg-amber-700"
                          : "bg-primary"
                      )}
                      style={{ width: progressWidth }}
                    />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredStats.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No sellers found matching "{searchQuery}".
          </div>
        )}
      </CardContent>
    </Card>
  )
}
