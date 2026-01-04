"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Calendar, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { useState, useMemo } from "react"

interface AttendanceRecord {
  id: string
  memberId: string
  memberName: string
  memberAvatar: string
  memberUsername: string
  time: string
  date: string
  type: "in" | "out"
}

// Mock attendance data
const attendanceRecords: AttendanceRecord[] = [
  { id: "A001", memberId: "M001", memberName: "John Smith", memberAvatar: "JS", memberUsername: "@johnsmith", time: "06:30 AM", date: "2024-01-03", type: "in" },
  { id: "A002", memberId: "M001", memberName: "John Smith", memberAvatar: "JS", memberUsername: "@johnsmith", time: "08:15 AM", date: "2024-01-03", type: "out" },
  { id: "A003", memberId: "M002", memberName: "Sarah Johnson", memberAvatar: "SJ", memberUsername: "@sarahj", time: "07:00 AM", date: "2024-01-03", type: "in" },
  { id: "A004", memberId: "M003", memberName: "Mike Wilson", memberAvatar: "MW", memberUsername: "@mikewilson", time: "05:45 AM", date: "2024-01-03", type: "in" },
  { id: "A005", memberId: "M003", memberName: "Mike Wilson", memberAvatar: "MW", memberUsername: "@mikewilson", time: "07:30 AM", date: "2024-01-03", type: "out" },
  { id: "A006", memberId: "M004", memberName: "Emily Davis", memberAvatar: "ED", memberUsername: "@emilyd", time: "08:00 AM", date: "2024-01-03", type: "in" },
  { id: "A007", memberId: "M002", memberName: "Sarah Johnson", memberAvatar: "SJ", memberUsername: "@sarahj", time: "09:00 AM", date: "2024-01-03", type: "out" },
  { id: "A008", memberId: "M005", memberName: "Chris Brown", memberAvatar: "CB", memberUsername: "@chrisbrown", time: "06:15 AM", date: "2024-01-02", type: "in" },
  { id: "A009", memberId: "M005", memberName: "Chris Brown", memberAvatar: "CB", memberUsername: "@chrisbrown", time: "08:00 AM", date: "2024-01-02", type: "out" },
  { id: "A010", memberId: "M006", memberName: "Jessica Martinez", memberAvatar: "JM", memberUsername: "@jessicam", time: "07:30 AM", date: "2024-01-02", type: "in" },
  { id: "A011", memberId: "M006", memberName: "Jessica Martinez", memberAvatar: "JM", memberUsername: "@jessicam", time: "09:45 AM", date: "2024-01-02", type: "out" },
  { id: "A012", memberId: "M001", memberName: "John Smith", memberAvatar: "JS", memberUsername: "@johnsmith", time: "06:00 AM", date: "2024-01-01", type: "in" },
  { id: "A013", memberId: "M001", memberName: "John Smith", memberAvatar: "JS", memberUsername: "@johnsmith", time: "08:30 AM", date: "2024-01-01", type: "out" },
  { id: "A014", memberId: "M007", memberName: "David Lee", memberAvatar: "DL", memberUsername: "@davidlee", time: "05:30 AM", date: "2024-01-01", type: "in" },
  { id: "A015", memberId: "M007", memberName: "David Lee", memberAvatar: "DL", memberUsername: "@davidlee", time: "07:15 AM", date: "2024-01-01", type: "out" },
]

export default function AttendanceLogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Filter records based on search and date range
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        record.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.memberUsername.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Date range filter
      let matchesDateRange = true
      if (startDate) {
        matchesDateRange = matchesDateRange && record.date >= startDate
      }
      if (endDate) {
        matchesDateRange = matchesDateRange && record.date <= endDate
      }
      
      return matchesSearch && matchesDateRange
    })
  }, [searchTerm, startDate, endDate])

  // Export PDF function
  const handleExportPDF = () => {
    // Create a printable content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Attendance Log Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; margin-bottom: 10px; }
            .date-range { color: #666; margin-bottom: 20px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f4f4f4; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .in { color: #22c55e; font-weight: bold; }
            .out { color: #ef4444; font-weight: bold; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Attendance Log Report</h1>
          <div class="date-range">
            ${startDate || endDate ? `Date Range: ${startDate || 'Start'} to ${endDate || 'End'}` : 'All Records'}
            <br/>Generated on: ${new Date().toLocaleString()}
          </div>
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Date</th>
                <th>Time</th>
                <th>In/Out</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecords.map(record => `
                <tr>
                  <td>${record.memberName}</td>
                  <td>${new Date(record.date).toLocaleDateString()}</td>
                  <td>${record.time}</td>
                  <td class="${record.type}">${record.type.toUpperCase()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Total Records: ${filteredRecords.length}</p>
            <p>GymFlow - Attendance Management System</p>
          </div>
        </body>
      </html>
    `
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Attendance Log</h1>
            <p className="text-sm text-muted-foreground">Track member check-ins and check-outs</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-wrap items-end gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search" className="mb-2 block text-sm">Search Member</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-secondary border-[#3a3a3a]"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="flex items-end gap-3">
              <div>
                <Label htmlFor="startDate" className="mb-2 block text-sm">From Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-9 bg-secondary border-[#3a3a3a] w-[180px]"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="endDate" className="mb-2 block text-sm">To Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-9 bg-secondary border-[#3a3a3a] w-[180px]"
                  />
                </div>
              </div>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExportPDF}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>

          {/* Active Filters Summary */}
          {(searchTerm || startDate || endDate) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#2a2a2a]">
              <span className="text-sm text-muted-foreground">Showing {filteredRecords.length} records</span>
              {(searchTerm || startDate || endDate) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setStartDate("")
                    setEndDate("")
                  }}
                  className="text-xs text-muted-foreground"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Attendance Table */}
        <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Member</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Time</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">In/Out</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className={`border-b border-[#2a2a2a] transition-colors ${
                      index % 2 === 0 ? "bg-[#151515]" : "bg-background"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/placeholder.svg?height=36&width=36" />
                          <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
                            {record.memberAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{record.memberName}</div>
                          <div className="text-sm text-muted-foreground">{record.memberUsername}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      {record.time}
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className={
                          record.type === "in"
                            ? "border-green-500/50 bg-green-500/10 text-green-400 gap-1"
                            : "border-red-500/50 bg-red-500/10 text-red-400 gap-1"
                        }
                      >
                        {record.type === "in" ? (
                          <ArrowDownLeft className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        {record.type.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
