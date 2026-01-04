"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Printer } from "lucide-react"

const invoiceData = [
  { id: "INV-001", member: "John Smith", package: "Premium", amount: "LKR 80", time: "09:30 AM" },
  { id: "INV-002", member: "Sarah Johnson", package: "Standard", amount: "LKR 50", time: "10:15 AM" },
  { id: "INV-003", member: "Mike Wilson", package: "Premium", amount: "LKR 80", time: "11:00 AM" },
  { id: "INV-004", member: "Emily Davis", package: "Basic", amount: "LKR 30", time: "02:30 PM" },
  { id: "INV-005", member: "Chris Brown", package: "Standard", amount: "LKR 50", time: "04:45 PM" },
]

export function DailyInvoice() {
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
            <Input id="report-date" type="date" className="w-40" />
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

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
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
            {invoiceData.map((invoice, index) => (
              <tr key={invoice.id} className={index % 2 === 0 ? "bg-secondary/30" : ""}>
                <td className="p-4 text-sm">{invoice.id}</td>
                <td className="p-4 text-sm">{invoice.member}</td>
                <td className="p-4 text-sm">{invoice.package}</td>
                <td className="p-4 text-sm font-semibold text-accent">{invoice.amount}</td>
                <td className="p-4 text-sm text-muted-foreground">{invoice.time}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-secondary border-t border-border">
            <tr>
              <td colSpan={3} className="p-4 text-sm font-semibold">
                Total Revenue
              </td>
              <td className="p-4 text-lg font-bold text-accent">LKR 290.00</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  )
}
