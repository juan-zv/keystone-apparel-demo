import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

export interface StatSummaryItem {
  label: string
  value: string | number
  sublabel?: string
  icon?: LucideIcon
}

interface StatSummaryCardsProps {
  items: StatSummaryItem[]
}

export function StatSummaryCards({ items }: StatSummaryCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.label} className="group relative overflow-hidden border-border/60 bg-card/80 shadow-xs backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md">
            <div className="pointer-events-none absolute right-0 top-0 h-16 w-16 bg-gradient-to-bl from-primary/5 to-transparent blur-xl transition-opacity group-hover:opacity-100" />

            <CardContent className="flex items-start gap-3.5 p-4">
              {Icon && (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-2xs group-hover:scale-105 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-1 truncate text-2xl font-extrabold tabular-nums text-foreground tracking-tight">{item.value}</p>
                {item.sublabel && (
                  <p className="mt-0.5 text-xs text-muted-foreground font-medium">{item.sublabel}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}