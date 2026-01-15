"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calendar, Loader2 } from "lucide-react"
import { useGetRevenueChartDataQuery } from "@/store/api/dashboardApi"

type ViewType = "day" | "month" | "year"

// Fallback data when API returns no data
const fallbackMonthlyData = [
  { label: "Jan", revenue: 0 },
  { label: "Feb", revenue: 0 },
  { label: "Mar", revenue: 0 },
  { label: "Apr", revenue: 0 },
  { label: "May", revenue: 0 },
  { label: "Jun", revenue: 0 },
  { label: "Jul", revenue: 0 },
  { label: "Aug", revenue: 0 },
  { label: "Sep", revenue: 0 },
  { label: "Oct", revenue: 0 },
  { label: "Nov", revenue: 0 },
  { label: "Dec", revenue: 0 },
]

export function RevenueChart() {
  const [view, setView] = useState<ViewType>("month")
  const [startDate, setStartDate] = useState("2025-01-01")
  const [endDate, setEndDate] = useState("2025-12-31")

  const { data: revenueData, isLoading } = useGetRevenueChartDataQuery({
    period: view,
    year: new Date().getFullYear(),
  })

  const getData = () => {
    if (!revenueData?.data || revenueData.data.length === 0) {
      return fallbackMonthlyData
    }
    return revenueData.data.map((item) => ({
      label: item.monthName || item.date || String(item.month),
      revenue: item.revenue,
    }))
  }

  const getViewLabel = () => {
    switch (view) {
      case "day":
        return "Daily View"
      case "year":
        return "Yearly View"
      default:
        return "Monthly View"
    }
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 mb-6">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Revenue Trend</h3>
          <span className="text-sm text-muted-foreground">{getViewLabel()}</span>
        </div>

        {/* Controls row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* View toggles */}
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            <Button
              size="sm"
              variant={view === "day" ? "default" : "ghost"}
              className={`h-8 px-4 ${view === "day" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setView("day")}
            >
              Day
            </Button>
            <Button
              size="sm"
              variant={view === "month" ? "default" : "ghost"}
              className={`h-8 px-4 ${view === "month" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setView("month")}
            >
              Month
            </Button>
            <Button
              size="sm"
              variant={view === "year" ? "default" : "ghost"}
              className={`h-8 px-4 ${view === "year" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setView("year")}
            >
              Year
            </Button>
          </div>

          {/* Date range selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 w-36 bg-secondary border-border text-sm"
              />
            </div>
            <span className="text-muted-foreground">to</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 w-36 bg-secondary border-border text-sm"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[350px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={getData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="label" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#00FF9D" }}
              formatter={(value: number | undefined) => value ? [`LKR ${value.toLocaleString()}`, "Revenue"] : ""}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#F4F933"
              strokeWidth={2}
              dot={{ fill: "#F4F933", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
