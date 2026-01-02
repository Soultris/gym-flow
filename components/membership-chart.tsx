"use client"

import { Card } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { month: "Jan", members: 245, revenue: 32000 },
  { month: "Feb", members: 268, revenue: 35000 },
  { month: "Mar", members: 289, revenue: 38000 },
  { month: "Apr", members: 305, revenue: 41000 },
  { month: "May", members: 318, revenue: 43000 },
  { month: "Jun", members: 342, revenue: 45000 },
]

export function MembershipChart() {
  return (
    <Card className="p-6">
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-semibold">Membership Growth</h3>
        <p className="text-sm text-muted-foreground">Track your gym's growth over time</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2E" />
          <XAxis dataKey="month" stroke="#A0A0A0" style={{ fontSize: "12px" }} />
          <YAxis stroke="#A0A0A0" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1A1A",
              border: "1px solid #2C2C2E",
              borderRadius: "8px",
              color: "#FFFFFF",
            }}
          />
          <Line type="monotone" dataKey="members" stroke="#F4F933" strokeWidth={2} dot={{ fill: "#F4F933", r: 4 }} />
          <Line type="monotone" dataKey="revenue" stroke="#00FF9D" strokeWidth={2} dot={{ fill: "#00FF9D", r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Members</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-accent" />
          <span className="text-sm text-muted-foreground">Revenue</span>
        </div>
      </div>
    </Card>
  )
}
