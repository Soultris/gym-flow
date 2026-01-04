import { Card } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "LKR 45,231",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "This Month",
    value: "LKR 8,452",
    change: "+8.2%",
    trend: "up",
    icon: CreditCard,
  },
  {
    title: "Pending Payments",
    value: "LKR 2,340",
    change: "15 members",
    trend: "neutral",
    icon: TrendingDown,
  },
  {
    title: "Growth Rate",
    value: "23.5%",
    change: "+4.2%",
    trend: "up",
    icon: TrendingUp,
  },
]

export function FinanceOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
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
