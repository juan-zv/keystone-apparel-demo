import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface SellerStat {
  name: string
  count: number
}

interface SellerStatsProps {
  sellerStats: SellerStat[]
}

export function SellerStats({ sellerStats }: SellerStatsProps) {
  // Sort by count (descending) for better visualization
  const sortedStats = [...sellerStats].sort((a, b) => b.count - a.count)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {sortedStats.map((seller) => (
            <Card key={seller.name} className="flex flex-col items-center justify-center p-4 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <p className="font-semibold text-lg mb-1">{seller.name}</p>
                <p className="text-3xl font-bold text-primary">{seller.count}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {seller.count === 1 ? 'sale' : 'sales'}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
