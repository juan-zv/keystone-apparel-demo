import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface DesignStat {
  name: string
  count: number
}

interface DesignStatsProps {
  designStats: DesignStat[]
}

export function DesignStats({ designStats }: DesignStatsProps) {
  // Sort by count (descending) for better visualization
  const sortedStats = [...designStats].sort((a, b) => b.count - a.count)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Design Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {sortedStats.map((design) => (
            <Card key={design.name} className="flex flex-col items-center justify-center p-4 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <p className="font-semibold text-sm mb-1">{design.name}</p>
                <p className="text-3xl font-bold text-primary">{design.count}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {design.count === 1 ? 'sold' : 'sold'}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
