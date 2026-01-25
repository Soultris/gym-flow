"use client"

import { Card } from "@/components/ui/card"
import { DollarSign, TrendingDown, CreditCard, Loader2 } from "lucide-react"
import { useGetDashboardStatsQuery } from "@/store/api/dashboardApi"

export function FinanceOverview() {
  const { data: stats, isLoading, isError } = useGetDashboardStatsQuery()

  const formatCurrency = (amount: number) => {
    return `LKR ${amount.toLocaleString()}`
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (isError || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 col-span-full">
          <p className="text-muted-foreground text-center">Failed to load finance data</p>
        </Card>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: "All time",
      trend: "up" as const,
      icon: DollarSign,
    },
    {
      title: "This Month",
      value: formatCurrency(stats.monthlyRevenue),
      change: "Current month",
      trend: "up" as const,
      icon: CreditCard,
    },
    {
      title: "Pending Payments",
      value: formatCurrency(stats.pendingPaymentAmount),
      change: `${stats.pendingPayments} members`,
      trend: "neutral" as const,
      icon: TrendingDown,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center justify-between">
            <div className={`rounded-lg p-2 ${stat.trend === "up" ? "bg-accent/10" : "bg-secondary"}`}>
              <stat.icon className={`h-4 w-4 ${stat.trend === "up" ? "text-accent" : "text-primary"}`} />
            </div>
            <span className={`text-xs font-medium ${stat.trend === "up" ? "text-accent" : "text-muted-foreground"}`}>
              {stat.change}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
