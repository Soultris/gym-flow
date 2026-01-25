"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useGetMembershipReportQuery } from "@/store/api/dashboardApi"
import { useMemo } from "react"

const COLORS = ["#F4F933", "#00FF9D", "#FFFFFF", "#A0A0A0", "#FF6B6B", "#4ECDC4"]

export function MembershipReport() {
  const { data, isLoading, error } = useGetMembershipReportQuery()
  
  // Transform API data to chart format
  const chartData = useMemo(() => {
    if (!data?.packageBreakdown) return []
    
    return data.packageBreakdown.map((item: { package?: { name: string }; count: number }, index: number) => ({
      name: item.package?.name || "Unknown",
      value: item.count,
      color: COLORS[index % COLORS.length]
    }))
  }, [data])
  
  const totalMembers = useMemo(() => {
    return chartData.reduce((sum: number, item: { value: number }) => sum + item.value, 0)
  }, [chartData])

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-12 text-muted-foreground">
          Failed to load membership data
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold">Membership Distribution</h3>
          <p className="text-sm text-muted-foreground">Active members by package type</p>
        </div>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {chartData.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                {chartData.map((entry: { color: string }, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2C2C2E",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {chartData.map((item: { name: string; value: number; color: string }) => (
              <div key={item.name} className="p-4 rounded-lg bg-secondary/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded" style={{ backgroundColor: item.color }} />
                  <span className="font-medium">{item.name} Package</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{item.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {totalMembers > 0 ? ((item.value / totalMembers) * 100).toFixed(1) : 0}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No membership data available
        </div>
      )}
    </Card>
  )
}
