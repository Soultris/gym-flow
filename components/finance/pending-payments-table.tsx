"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { useGetPendingPaymentsQuery, type PendingPayment } from "@/store/api/transactionsApi"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const getPackageBadgeClass = (pkg: string) => {
  switch (pkg) {
    case "Premium":
      return "bg-primary/20 text-primary border-primary/30"
    case "Staff":
      return "bg-primary/20 text-primary border-primary/30"
    case "Standard":
      return "bg-secondary/50 text-muted-foreground border-[#2a2a2a]"
    case "Basic":
      return "bg-secondary/50 text-muted-foreground border-[#2a2a2a]"
    default:
      return "bg-secondary/50 text-muted-foreground border-[#2a2a2a]"
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function PendingPaymentsTable() {
  const { data: pendingPayments = [], isLoading, isError } = useGetPendingPaymentsQuery()

  if (isLoading) {
    return (
      <div className="border border-[#2a2a2a] rounded-lg p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading pending payments...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="border border-[#2a2a2a] rounded-lg p-8 text-center text-destructive">
        Failed to load pending payments
      </div>
    )
  }

  if (pendingPayments.length === 0) {
    return (
      <div className="border border-[#2a2a2a] rounded-lg p-8 text-center text-muted-foreground">
        No pending payments found
      </div>
    )
  }

  return (
    <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
            <th className="w-12 px-4 py-3">
              <Checkbox className="border-[#3a3a3a]" />
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Package</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Membership Expiry</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Amount Payable</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Days Overdue</th>
          </tr>
        </thead>
        <tbody>
          {pendingPayments.map((payment: PendingPayment, index: number) => (
            <tr
              key={payment.memberId || index}
              className={`border-b border-[#2a2a2a] transition-colors ${
                index % 2 === 0 ? "bg-[#151515]" : "bg-background"
              }`}
            >
              <td className="px-4 py-4">
                <Checkbox className="border-[#3a3a3a]" />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder.svg?height=36&width=36" />
                    <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
                      {getInitials(payment.name || payment.memberName || "?")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{payment.name || payment.memberName || "Unknown"}</div>
                    <div className="text-sm text-muted-foreground">{payment.email || ""}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge variant="secondary" className={getPackageBadgeClass(payment.package?.name || payment.packageName || "")}>
                  {payment.package?.name || payment.packageName || "N/A"}
                </Badge>
              </td>
              <td className="px-4 py-4 text-sm text-muted-foreground">
                {payment.expiryDate ? formatDate(payment.expiryDate) : "-"}
              </td>
              <td className="px-4 py-4 text-sm font-semibold text-destructive">
                LKR {(payment.amountDue || payment.package?.price || 0).toLocaleString()}
              </td>
              <td className="px-4 py-4 text-sm text-muted-foreground">
                {payment.daysOverdue || 0} Days
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  )
}
