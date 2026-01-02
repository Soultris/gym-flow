"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const membershipData = [
  { name: "Premium", value: 89, color: "#F4F933" },
  { name: "Standard", value: 134, color: "#00FF9D" },
  { name: "Basic", value: 89, color: "#FFFFFF" },
  { name: "Annual", value: 30, color: "#A0A0A0" },
]

export function MembershipReport() {
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

      <div className="grid gap-6 lg:grid-cols-2">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={membershipData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
              {membershipData.map((entry, index) => (
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
          {membershipData.map((item) => (
            <div key={item.name} className="p-4 rounded-lg bg-secondary/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded" style={{ backgroundColor: item.color }} />
                <span className="font-medium">{item.name} Package</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{item.value}</p>
                <p className="text-xs text-muted-foreground">{((item.value / 342) * 100).toFixed(1)}% of total</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
