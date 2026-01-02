"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const attendanceData = [
  { day: "Mon", checkins: 145 },
  { day: "Tue", checkins: 132 },
  { day: "Wed", checkins: 158 },
  { day: "Thu", checkins: 141 },
  { day: "Fri", checkins: 167 },
  { day: "Sat", checkins: 189 },
  { day: "Sun", checkins: 95 },
]

export function AttendanceReport() {
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

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={attendanceData}>
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

      <div className="grid gap-4 sm:grid-cols-3 mt-6">
        <div className="p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">Total Check-ins</p>
          <p className="text-2xl font-bold mt-1">1,027</p>
        </div>
        <div className="p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">Daily Average</p>
          <p className="text-2xl font-bold mt-1">147</p>
        </div>
        <div className="p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">Peak Day</p>
          <p className="text-2xl font-bold mt-1 text-accent">Saturday</p>
        </div>
      </div>
    </Card>
  )
}
