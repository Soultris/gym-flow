"use client"

import { Card } from "@/components/ui/card"
import { Users, Clock, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Active Members",
    value: "342",
    change: "+12%",
    icon: Users,
    color: "text-[#E8FF00]",
    href: "/members/active",
  },
  {
    title: "Expiring Soon (3 Days)",
    value: "28",
    change: "+5%",
    icon: Clock,
    color: "text-[#E8FF00]",
    href: "/members/expired",
  },
  {
    title: "Check-ins Today",
    value: "127",
    change: "+8%",
    icon: UserCheck,
    color: "text-[#E8FF00]",
    href: "/attendance",
  },
]

export function StatsCards() {
  const router = useRouter()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card 
          key={stat.title} 
          className="p-6 cursor-pointer transition-all hover:shadow-lg hover:border-[#E8FF00]/50"
          onClick={() => router.push(stat.href)}
        >
          <div className="flex items-center justify-between">
            <div className={cn("rounded-lg bg-secondary p-2", stat.color)}>
              <stat.icon className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-[#E8FF00]">{stat.change}</span>
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
