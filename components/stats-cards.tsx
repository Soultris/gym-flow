import { Card } from "@/components/ui/card"
import { Users, UserCheck, TrendingUp, DollarSign } from "lucide-react"

const stats = [
  {
    title: "Total Members",
    value: "342",
    change: "+12%",
    icon: Users,
    color: "text-primary",
  },
  {
    title: "Active Today",
    value: "127",
    change: "+8%",
    icon: UserCheck,
    color: "text-accent",
  },
  {
    title: "Revenue (Monthly)",
    value: "$45,231",
    change: "+15%",
    icon: DollarSign,
    color: "text-primary",
  },
  {
    title: "Growth Rate",
    value: "23.5%",
    change: "+4.2%",
    icon: TrendingUp,
    color: "text-accent",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("rounded-lg bg-secondary p-2", stat.color)}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <span className="text-xs font-medium text-accent">{stat.change}</span>
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

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
