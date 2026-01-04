"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/buttons"
import { Checkbox } from "@/components/ui/checkbox"

const transactions = [
  {
    id: "M001",
    name: "John Smith",
    username: "@johnsmith",
    avatar: "JS",
    package: "Premium",
    paymentFrom: "May 12, 2024",
    paymentTo: "May 12, 2024",
    expiryDate: "May 12, 2024",
    paidDate: "May 12, 2024",
  },
  {
    id: "M002",
    name: "Sarah Johnson",
    username: "@sarahj",
    avatar: "SJ",
    package: "Staff",
    paymentFrom: "January 7, 2024",
    paymentTo: "January 7, 2024",
    expiryDate: "January 7, 2024",
    paidDate: "January 7, 2024",
  },
  {
    id: "M003",
    name: "Mike Wilson",
    username: "@mikewilson",
    avatar: "MW",
    package: "Standard",
    paymentFrom: "March 9, 2024",
    paymentTo: "March 9, 2024",
    expiryDate: "March 9, 2024",
    paidDate: "March 9, 2024",
  },
  {
    id: "M004",
    name: "Emily Davis",
    username: "@emilyd",
    avatar: "ED",
    package: "Basic",
    paymentFrom: "November 15, 2023",
    paymentTo: "November 15, 2023",
    expiryDate: "November 15, 2023",
    paidDate: "November 15, 2023",
  },
  {
    id: "M005",
    name: "Chris Brown",
    username: "@chrisbrown",
    avatar: "CB",
    package: "Staff",
    paymentFrom: "February 20, 2024",
    paymentTo: "February 20, 2024",
    expiryDate: "February 20, 2024",
    paidDate: "February 20, 2024",
  },
  {
    id: "M006",
    name: "Jessica Martinez",
    username: "@jessicam",
    avatar: "JM",
    package: "Premium",
    paymentFrom: "April 3, 2024",
    paymentTo: "April 3, 2024",
    expiryDate: "April 3, 2024",
    paidDate: "April 3, 2024",
  },
  {
    id: "M007",
    name: "David Lee",
    username: "@davidlee",
    avatar: "DL",
    package: "Standard",
    paymentFrom: "June 18, 2024",
    paymentTo: "June 18, 2024",
    expiryDate: "June 18, 2024",
    paidDate: "June 18, 2024",
  },
]

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
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Package</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Payment From</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Payment To</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Expiry Date</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Paid Date</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr
              key={transaction.id}
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
                      {transaction.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{transaction.name}</div>
                    <div className="text-sm text-muted-foreground">{transaction.username}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge variant="secondary" className={getPackageBadgeClass(transaction.package)}>
                  {transaction.package}
                </Badge>
              </td>
              <td className="px-4 py-4 text-sm text-muted-foreground">{transaction.paymentFrom}</td>
              <td className="px-4 py-4 text-sm text-muted-foreground">{transaction.paymentTo}</td>
              <td className="px-4 py-4 text-sm text-muted-foreground">{transaction.expiryDate}</td>
              <td className="px-4 py-4 text-sm text-muted-foreground">{transaction.paidDate}</td>
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
