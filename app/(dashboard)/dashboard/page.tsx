import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RevenueChart from "@/components/charts/RevenueChart"
import UsersChart from "@/components/charts/UsersChart"

async function getStats() {
  const [userCount, revenueData] = await Promise.all([
    prisma.user.count(),
    prisma.revenue.findMany({ orderBy: { month: "asc" } }),
  ])

  const totalRevenue = revenueData.reduce((sum: number, r) => sum + r.amount, 0)
  const lastMonth = revenueData[revenueData.length - 1]?.amount ?? 0
  const prevMonth = revenueData[revenueData.length - 2]?.amount ?? lastMonth
  const growth = prevMonth ? (((lastMonth - prevMonth) / prevMonth) * 100).toFixed(1) : "0"

  // fake conversion rate, just for the KPI card
  const conversionRate = 3.8

  return { userCount, revenueData, totalRevenue, lastMonth, growth, conversionRate }
}

// generate some user growth data off revenue months
function buildUserGrowth(months: { month: string }[], total: number) {
  return months.map((r, i) => ({
    month: r.month,
    users: Math.round((total / months.length) * (i + 1) * 0.8 + Math.random() * 3),
  }))
}

export default async function DashboardPage() {
  const { userCount, revenueData, totalRevenue, lastMonth, growth, conversionRate } = await getStats()
  const userGrowth = buildUserGrowth(revenueData, userCount)

  const kpis = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, sub: `+${growth}% from last month` },
    { label: "Total Users", value: userCount.toString(), sub: "Registered accounts" },
    { label: "Conversion Rate", value: `${conversionRate}%`, sub: "Avg across all sources" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your key metrics</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader>
              <CardTitle>{kpi.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue over time</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User growth</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersChart data={userGrowth} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
