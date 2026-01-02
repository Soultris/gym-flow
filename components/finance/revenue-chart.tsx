"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const revenueData = [
  { month: "Jan", revenue: 32000 },
  { month: "Feb", revenue: 28000 },
  { month: "Mar", revenue: 35000 },
  { month: "Apr", revenue: 42000 },
  { month: "May", revenue: 48000 },
  { month: "Jun", revenue: 52000 },
]

export function RevenueChart() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Revenue Trend</h3>
        <span className="text-sm text-muted-foreground">Last 6 months</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#00FF9D" }}
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
    </Card>
  )
}
