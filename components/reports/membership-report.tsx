"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Loader2, X } from "lucide-react"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useGetMembershipReportQuery } from "@/store/api/dashboardApi"
import { useMemo, useState } from "react"
import { useAppSelector } from "@/store/hooks"

const COLORS = ["#F4F933", "#22c55e", "#FFFFFF", "#A0A0A0", "#FF6B6B", "#4ECDC4"]

export function MembershipReport() {
  const [dateRange, setDateRange] = useState<{ from: string; to: string } | null>(null)
  const [localFromDate, setLocalFromDate] = useState("")
  const [localToDate, setLocalToDate] = useState("")
  
  // Build query parameters based on dateRange
  const queryParams = dateRange ? { from: dateRange.from, to: dateRange.to } : {}
  const { data, isLoading, error } = useGetMembershipReportQuery(
    Object.keys(queryParams).length > 0 ? queryParams : undefined
  )
  const logoUrl = useAppSelector(state => state.auth.user?.gymLogoUrl)
  
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

  const handleApplyDateRange = () => {
    if (!localFromDate && !localToDate) {
      alert("Please select at least one date")
      return
    }
    
    if (localFromDate && localToDate) {
      if (new Date(localFromDate) > new Date(localToDate)) {
        alert("From date must be before To date")
        return
      }
      setDateRange({ from: localFromDate, to: localToDate })
    } else if (localFromDate) {
      setDateRange({ from: localFromDate, to: new Date().toISOString().split('T')[0] })
    } else if (localToDate) {
      setDateRange({ from: "2020-01-01", to: localToDate })
    }
  }

  const handleClearDateRange = () => {
    setDateRange(null)
    setLocalFromDate("")
    setLocalToDate("")
  }

  const formatDateDisplay = (dateString: string | null) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Show loading state when loading and have a date range selected
  const showLoading = isLoading && dateRange

  if (showLoading && !data) {
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

  const handleExportPDF = () => {
    const dateRangeText = dateRange 
      ? ` (${formatDateDisplay(dateRange.from)} to ${formatDateDisplay(dateRange.to)})`
      : ""
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Membership Distribution Report</title>
          <style>
            .logo-header { display: flex; align-items: center; margin-bottom: 20px; }
            .logo-header img { width: 60px; height: 60px; object-fit: contain; margin-right: 15px; }
            h1 { color: #333; margin-bottom: 5px; }
            .date { color: #666; margin-bottom: 20px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f4f4f4; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; }
            .total-box { margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9; }
            .total-label { font-size: 12px; color: #666; }
            .total-value { font-size: 24px; font-weight: bold; margin-top: 5px; }
            .title-section { display: flex; align-items: center; gap: 15px; }
          </style>
        </head>
        <body>
          <div class="logo-header">
            ${logoUrl ? `<img src="${logoUrl}" alt="Gym Logo">` : ""}
            <div>
              <h1>Membership Distribution Report</h1>
              <div class="date">
                Data Analysis by Package Type${dateRangeText}<br/>
                Generated on: ${new Date().toLocaleString()}
              </div>
            </div>
          </div>

          <div class="total-box">
            <div class="total-label">Total Members in Period</div>
            <div class="total-value">${totalMembers.toLocaleString()}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Package Name</th>
                <th>Member Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${chartData.map((item: { name: string; value: number }) => `
                <tr>
                  <td>${item.name} Package</td>
                  <td>${item.value}</td>
                  <td>${totalMembers > 0 ? ((item.value / totalMembers) * 100).toFixed(1) : 0}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
             GymFlow Analytics
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

  return (
    <div className="space-y-6">
      {/* Date Range Filter Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Filter by Purchase Date</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">From Date</label>
              <input
                type="date"
                value={localFromDate}
                onChange={(e) => setLocalFromDate(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-secondary rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">To Date</label>
              <input
                type="date"
                value={localToDate}
                onChange={(e) => setLocalToDate(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-secondary rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">&nbsp;</label>
              <div className="flex gap-2">
                <Button
                  onClick={handleApplyDateRange}
                  disabled={showLoading ? true : undefined}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {showLoading ? "Loading..." : "Apply"}
                </Button>
                {dateRange && (
                  <Button
                    onClick={handleClearDateRange}
                    variant="outline"
                    className="px-3"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {dateRange && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary">
                Showing memberships purchased between <strong>{formatDateDisplay(dateRange.from)}</strong> and <strong>{formatDateDisplay(dateRange.to)}</strong>
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Membership Report Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold">Membership Distribution</h3>
            <p className="text-sm text-muted-foreground">
              {dateRange 
                ? `Memberships purchased from ${formatDateDisplay(dateRange.from)} to ${formatDateDisplay(dateRange.to)}`
                : "Active members by package type"
              }
            </p>
          </div>
          {data && (
            <Button 
              size="sm" 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleExportPDF}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          )}
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
          <div className="flex items-center justify-center text-muted-foreground" style={{ height: '300px' }}>
            {dateRange 
              ? "No membership data available for the selected date range"
              : "Select a date range to view membership data"
            }
          </div>
        )}
      </Card>
    </div>
  )
}
