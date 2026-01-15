"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Download, Calendar, Loader2 } from "lucide-react"
import { useState, useMemo } from "react"
import { useGetAttendanceQuery, Attendance } from "@/store/api/attendanceApi"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function AttendanceLogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const { data, isLoading, isError } = useGetAttendanceQuery(
    startDate || endDate ? { from: startDate || undefined, to: endDate || undefined } : undefined
  )

  const attendanceRecords = data?.attendance || []

  // Filter records based on search
  const filteredRecords = useMemo(() => {
    if (!searchTerm) return attendanceRecords
    return attendanceRecords.filter((record) => {
      const name = record.member?.name || ""
      const email = record.member?.email || ""
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }, [attendanceRecords, searchTerm])

  // Export PDF function
  const handleExportPDF = () => {
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
                <th>Check-in Time</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecords.map(record => `
                <tr>
                  <td>${record.member?.name || 'Unknown'}</td>
                  <td>${new Date(record.timestamp).toLocaleDateString()}</td>
                  <td>${new Date(record.timestamp).toLocaleTimeString()}</td>
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

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
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
                  placeholder="Search by name or email..."
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
              <span className="text-sm text-muted-foreground">
                Showing {filteredRecords.length} records
              </span>
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
            </div>
          )}
        </Card>

        {/* Records Count */}
        <p className="text-sm text-muted-foreground">
          {filteredRecords.length} {filteredRecords.length === 1 ? "record" : "records"}
        </p>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading attendance...</span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12 text-destructive">
            Failed to load attendance records
          </div>
        )}

        {/* Attendance Table */}
        {!isLoading && !isError && (
          <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Member</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Check-in Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record: Attendance, index: number) => (
                    <tr
                      key={record.attendanceId}
                      className={`border-b border-[#2a2a2a] transition-colors ${
                        index % 2 === 0 ? "bg-[#151515]" : "bg-background"
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={record.member?.imageUrl || "/placeholder.svg"} />
                            <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
                              {getInitials(record.member?.name || "?")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{record.member?.name || "Unknown"}</div>
                            <div className="text-sm text-muted-foreground">{record.member?.email || ""}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatDate(record.timestamp)}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">
                        {formatTime(record.timestamp)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
