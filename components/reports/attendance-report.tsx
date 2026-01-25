"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { useGetAttendanceReportQuery } from "@/store/api/dashboardApi"
import { useMemo } from "react"

export function AttendanceReport() {
  const { data, isLoading, error } = useGetAttendanceReportQuery()
  
  // Transform daily data to chart format with day names
  const chartData = useMemo(() => {
    if (!data?.dailyData) return []
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    return data.dailyData.map((item: { date: string; checkIns: number }) => {
      const date = new Date(item.date)
      return {
        day: dayNames[date.getDay()],
        checkins: item.checkIns
      }
    })
  }, [data])
  
  // Calculate stats
  const totalCheckIns = data?.summary?.totalCheckIns || 0
  const dailyAverage = chartData.length > 0 
    ? Math.round(totalCheckIns / chartData.length) 
    : 0
  const peakDay = useMemo(() => {
    if (chartData.length === 0) return 'N/A'
    const peak = chartData.reduce((max: { checkins: number; day: string }, item: { checkins: number; day: string }) => 
      item.checkins > max.checkins ? item : max, 
      chartData[0]
    )
    return peak?.day || 'N/A'
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
          Failed to load attendance data
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold">Weekly Attendance Report</h3>
          <p className="text-sm text-muted-foreground">Member check-ins for the past 7 days</p>
        </div>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2E" />
            <XAxis dataKey="day" stroke="#A0A0A0" style={{ fontSize: "12px" }} />
            <YAxis stroke="#A0A0A0" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2C2C2E",
                borderRadius: "8px",
                color: "#FFFFFF",
              }}
            />
            <Bar dataKey="checkins" fill="#00FF9D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No attendance data available
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3 mt-6">
        <div className="p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">Total Check-ins</p>
          <p className="text-2xl font-bold mt-1">{totalCheckIns.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">Daily Average</p>
          <p className="text-2xl font-bold mt-1">{dailyAverage}</p>
        </div>
        <div className="p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">Peak Day</p>
          <p className="text-2xl font-bold mt-1 text-accent">{peakDay}</p>
        </div>
      </div>
    </Card>
  )
}
