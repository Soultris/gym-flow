"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { useGetTransactionsQuery, Transaction } from "@/store/api/transactionsApi"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
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

export function TransactionHistoryTable() {
  const { data, isLoading, isError } = useGetTransactionsQuery()
  const transactions = data?.transactions || []

  if (isLoading) {
    return (
      <div className="border border-[#2a2a2a] rounded-lg p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading transactions...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="border border-[#2a2a2a] rounded-lg p-8 text-center text-destructive">
        Failed to load transactions
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="border border-[#2a2a2a] rounded-lg p-8 text-center text-muted-foreground">
        No transactions found
      </div>
    )
  }

  return (
    <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
            <th className="w-12 px-4 py-3">
              <Checkbox className="border-[#3a3a3a]" />
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Type</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Package</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Amount</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Payment Method</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Paid Date</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction: Transaction, index: number) => (
            <tr
              key={transaction.transactionId}
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
                      {transaction.member ? getInitials(transaction.member.name) : transaction.guestName ? getInitials(transaction.guestName) : "G"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{transaction.member?.name || transaction.guestName || "Guest"}</div>
                    <div className="text-sm text-muted-foreground">{transaction.member?.email || transaction.guestEmail || ""}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge variant="outline" className="capitalize">
                  {transaction.transactionType.replace("_", " ")}
                </Badge>
              </td>
              <td className="px-4 py-4">
                {transaction.package ? (
                  <Badge variant="secondary" className={getPackageBadgeClass(transaction.package.name)}>
                    {transaction.package.name}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </td>
              <td className="px-4 py-4 text-sm font-medium">LKR {transaction.price.toLocaleString()}</td>
              <td className="px-4 py-4 text-sm text-muted-foreground capitalize">{transaction.paymentMethod}</td>
              <td className="px-4 py-4 text-sm text-muted-foreground">{formatDate(transaction.paidAt)}</td>
              <td className="px-4 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-3 text-xs border-primary text-primary hover:bg-primary/10"
                >
                  Print
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  )
}
