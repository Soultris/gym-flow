"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Users, TrendingUp, Loader2 } from "lucide-react"
import { useGetDashboardStatsQuery } from "@/store/api/dashboardApi"

export function ReportCards() {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-muted-foreground text-center">Failed to load stats</p>
        </Card>
      </div>
    )
  }

  const reports = [
    {
      title: "Daily Income",
      description: "Today's revenue summary",
      value: `LKR ${(stats?.monthlyRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
    },
    {
      title: "Total Attendance",
      description: "Members checked in today",
      value: String(stats?.checkInsToday || 0),
      icon: Users,
    },
    {
      title: "Active Members",
      description: "Current active memberships",
      value: String(stats?.activeMembers || 0),
      icon: FileText,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {reports.map((report) => (
        <Card key={report.title} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary p-2">
                <report.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{report.description}</p>
                <p className="text-2xl font-bold mt-1">{report.value}</p>
              </div>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full mt-4 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </Card>
      ))}
    </div>
  )
}
