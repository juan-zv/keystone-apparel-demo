import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sparkles, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DesignStat {
  name: string
  count: number
}

interface DesignStatsProps {
  designStats: DesignStat[]
}

export function DesignStats({ designStats }: DesignStatsProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const sortedStats = [...designStats].sort((a, b) => b.count - a.count)
  const totalUnits = sortedStats.reduce((sum, d) => sum + d.count, 0)
  const withSales = sortedStats.filter((d) => d.count > 0)
  const maxCount = sortedStats[0]?.count || 1

  const filteredStats = sortedStats.filter((design) =>
    design.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              Design Popularity & Sales
            </CardTitle>
            <CardDescription className="mt-1">
              {totalUnits} total units sold · <span className="font-semibold text-foreground">{withSales.length}</span> of {sortedStats.length} designs active
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Filter design..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredStats.map((design) => {
            const rankIndex = sortedStats.findIndex((d) => d.name === design.name)
            const isTopRank = design.count > 0 && rankIndex < 3
            const percentage = totalUnits > 0 ? Math.round((design.count / totalUnits) * 100) : 0
            const progressWidth = maxCount > 0 ? `${(design.count / maxCount) * 100}%` : "0%"

            return (
              <Card
                key={design.name}
                className={cn(
                  "relative flex flex-col justify-between border p-3.5 transition-all duration-200",
                  design.count > 0
                    ? isTopRank
                      ? "border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-500/60 shadow-xs"
                      : "border-border/60 bg-background/50 hover:border-primary/40 hover:shadow-xs"
                    : "border-border/30 bg-muted/20 opacity-50"
                )}
              >
                <div>
                  <p className="font-semibold text-xs text-foreground line-clamp-2 min-h-[2.5rem] flex items-center leading-tight mb-2">
                    {design.name}
                  </p>

                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span
                      className={cn(
                        "text-2xl font-black tabular-nums tracking-tight",
                        design.count > 0 ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {design.count}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">sold</span>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1 font-medium">
                    <span>Share</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isTopRank ? "bg-indigo-500" : "bg-primary/80"
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
            No designs found matching "{searchQuery}".
          </div>
        )}
      </CardContent>
    </Card>
  )
}
