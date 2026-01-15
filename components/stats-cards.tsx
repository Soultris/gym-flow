"use client"

import { Card } from "@/components/ui/card"
import { Users, Clock, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useGetDashboardStatsQuery } from "@/store/api/dashboardApi"

export function StatsCards() {
  const router = useRouter()
  const { data: stats, isLoading } = useGetDashboardStatsQuery()

  const statsConfig = [
    {
      title: "Active Members",
      value: stats?.activeMembers ?? 0,
      icon: Users,
      color: "text-[#E8FF00]",
      href: "/members/active",
    },
    {
      title: "Expiring Soon (3 Days)",
      value: stats?.expiringSoon ?? 0,
      icon: Clock,
      color: "text-[#E8FF00]",
      href: "/members/expired",
    },
    {
      title: "Check-ins Today",
      value: stats?.checkInsToday ?? 0,
      icon: UserCheck,
      color: "text-[#E8FF00]",
      href: "/attendance",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 bg-secondary rounded-lg" />
              <div className="h-4 w-12 bg-secondary rounded" />
            </div>
            <div className="mt-4">
              <div className="h-4 w-24 bg-secondary rounded mb-2" />
              <div className="h-8 w-16 bg-secondary rounded" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statsConfig.map((stat) => (
        <Card 
          key={stat.title} 
          className="p-6 cursor-pointer transition-all hover:shadow-lg hover:border-[#E8FF00]/50"
          onClick={() => router.push(stat.href)}
        >
          <div className="flex items-center justify-between">
            <div className={cn("rounded-lg bg-secondary p-2", stat.color)}>
              <stat.icon className="h-4 w-4" />
            </div>
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
