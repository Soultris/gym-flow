"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calendar, Loader2 } from "lucide-react"
import { useGetRevenueChartDataQuery } from "@/store/api/dashboardApi"

type ViewType = "week" | "month" | "year"

// Helper to format date as YYYY-MM-DD
const formatDateForInput = (date: Date) => {
  return date.toISOString().split('T')[0]
}

// Get preset date ranges based on view
const getPresetDates = (view: ViewType) => {
  const now = new Date()
  
  switch (view) {
    case "week": {
      // Last 7 days from today
      const start = new Date(now)
      start.setDate(start.getDate() - 6)
      return { from: formatDateForInput(start), to: formatDateForInput(now) }
    }
    case "month": {
      // Current month
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return { from: formatDateForInput(start), to: formatDateForInput(end) }
    }
    case "year":
    default: {
      // Current year
      const start = new Date(now.getFullYear(), 0, 1)
      const end = new Date(now.getFullYear(), 11, 31)
      return { from: formatDateForInput(start), to: formatDateForInput(end) }
    }
  }
}

export function RevenueChart() {
  // Initialize with year view and its preset dates
  const initialDates = getPresetDates("year")
  const [view, setView] = useState<ViewType>("year")
  const [isCustomRange, setIsCustomRange] = useState(false)
  const [customFrom, setCustomFrom] = useState(initialDates.from)
  const [customTo, setCustomTo] = useState(initialDates.to)

  // Query params - when custom range, don't send view so backend auto-determines grouping
  const queryParams = useMemo(() => {
    if (isCustomRange && customFrom && customTo) {
      return { from: customFrom, to: customTo }
    }
    return { view }
  }, [view, isCustomRange, customFrom, customTo])

  const { data: revenueData, isLoading, isFetching } = useGetRevenueChartDataQuery(queryParams)

  const handleViewChange = (newView: ViewType) => {
    setView(newView)
    setIsCustomRange(false)
    // Update dates to match new view
    const { from, to } = getPresetDates(newView)
    setCustomFrom(from)
    setCustomTo(to)
  }

  const handleDateChange = (type: 'from' | 'to', value: string) => {
    if (type === 'from') {
      setCustomFrom(value)
    } else {
      setCustomTo(value)
    }
    setIsCustomRange(true)
  }

  const getData = () => {
    if (!revenueData?.data || revenueData.data.length === 0) {
      return []
    }
    return revenueData.data.map((item) => ({
      label: item.label || item.date || String(item.month || item.year),
      revenue: item.revenue,
    }))
  }

  const getViewLabel = () => {
    if (isCustomRange && revenueData?.groupBy) {
      const groupLabels: Record<string, string> = {
        day: "Daily View",
        month: "Monthly View",
        year: "Yearly View"
      }
      return `${groupLabels[revenueData.groupBy] || "View"} (Custom Range)`
    }
    switch (view) {
      case "week":
        return "Weekly View (Last 7 Days)"
      case "month":
        return "Monthly View (Current Month)"
      case "year":
      default:
        return "Yearly View (Current Year)"
    }
  }

  const showLoading = isLoading || isFetching

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
              variant={view === "week" && !isCustomRange ? "default" : "ghost"}
              className={`h-8 px-4 ${view === "week" && !isCustomRange ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => handleViewChange("week")}
            >
              Week
            </Button>
            <Button
              size="sm"
              variant={view === "month" && !isCustomRange ? "default" : "ghost"}
              className={`h-8 px-4 ${view === "month" && !isCustomRange ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => handleViewChange("month")}
            >
              Month
            </Button>
            <Button
              size="sm"
              variant={view === "year" && !isCustomRange ? "default" : "ghost"}
              className={`h-8 px-4 ${view === "year" && !isCustomRange ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => handleViewChange("year")}
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
                value={customFrom}
                onChange={(e) => handleDateChange('from', e.target.value)}
                className="h-8 w-36 bg-secondary border-border text-sm"
              />
            </div>
            <span className="text-muted-foreground">to</span>
            <Input
              type="date"
              value={customTo}
              onChange={(e) => handleDateChange('to', e.target.value)}
              className="h-8 w-36 bg-secondary border-border text-sm"
            />
          </div>
        </div>
      </div>

      {showLoading ? (
        <div className="flex items-center justify-center h-[350px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={getData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="label" 
              stroke="#9CA3AF" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#00FF9D" }}
              formatter={(value: number | undefined) => value !== undefined ? [`LKR ${value.toLocaleString()}`, "Revenue"] : ""}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#F4F933"
              strokeWidth={2}
              dot={{ fill: "#F4F933", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
