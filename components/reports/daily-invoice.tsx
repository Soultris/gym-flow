"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Printer, Loader2 } from "lucide-react"
import { useState } from "react"
import { useGetDailyInvoiceReportQuery } from "@/store/api/dashboardApi"

export function DailyInvoice() {
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  
  const { data, isLoading, error } = useGetDailyInvoiceReportQuery({ date: selectedDate })
  
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true
    })
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold">Daily Invoice Report</h3>
          <p className="text-sm text-muted-foreground">View and export daily transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="report-date" className="sr-only">
              Select Date
            </Label>
            <Input 
              id="report-date" 
              type="date" 
              className="w-40" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-muted-foreground">
          Failed to load invoice data
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-4 text-sm font-medium">Invoice ID</th>
                <th className="text-left p-4 text-sm font-medium">Member</th>
                <th className="text-left p-4 text-sm font-medium">Package</th>
                <th className="text-left p-4 text-sm font-medium">Amount</th>
                <th className="text-left p-4 text-sm font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {data?.transactions && data.transactions.length > 0 ? (
                data.transactions.map((invoice: { transactionId: number; member?: { name: string }; memberPackage?: { package?: { name: string } }; price: number; paidAt: string }, index: number) => (
                  <tr key={invoice.transactionId} className={index % 2 === 0 ? "bg-secondary/30" : ""}>
                    <td className="p-4 text-sm">INV-{String(invoice.transactionId).padStart(3, '0')}</td>
                    <td className="p-4 text-sm">{invoice.member?.name || "N/A"}</td>
                    <td className="p-4 text-sm">{invoice.memberPackage?.package?.name || "N/A"}</td>
                    <td className="p-4 text-sm font-semibold text-accent">LKR {invoice.price}</td>
                    <td className="p-4 text-sm text-muted-foreground">{formatTime(invoice.paidAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No transactions for this date
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-secondary border-t border-border">
              <tr>
                <td colSpan={3} className="p-4 text-sm font-semibold">
                  Total Revenue
                </td>
                <td className="p-4 text-lg font-bold text-accent">
                  LKR {data?.summary?.totalRevenue?.toFixed(2) || "0.00"}
                </td>
                <td></td>
              </tr>
            </tfoot>
            </table>
          </div>
        </div>
      )}
    </Card>
  )
}
