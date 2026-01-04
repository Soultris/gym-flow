"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

const pendingPayments = [
  {
    id: "M001",
    name: "John Smith",
    username: "@johnsmith",
    avatar: "JS",
    package: "Premium",
    lastPayment: "May 12, 2024",
    membershipExpiry: "May 12, 2024",
    amountPayable: "LKR 150",
    overdue: "5 Days",
  },
  {
    id: "M002",
    name: "Sarah Johnson",
    username: "@sarahj",
    avatar: "SJ",
    package: "Staff",
    lastPayment: "January 7, 2024",
    membershipExpiry: "January 7, 2024",
    amountPayable: "LKR 150",
    overdue: "6 Days",
  },
  {
    id: "M003",
    name: "Mike Wilson",
    username: "@mikewilson",
    avatar: "MW",
    package: "Standard",
    lastPayment: "March 9, 2024",
    membershipExpiry: "March 9, 2024",
    amountPayable: "LKR 150",
    overdue: "5 Days",
  },
  {
    id: "M004",
    name: "Emily Davis",
    username: "@emilyd",
    avatar: "ED",
    package: "Basic",
    lastPayment: "November 15, 2023",
    membershipExpiry: "November 15, 2023",
    amountPayable: "LKR 150",
    overdue: "5 Days",
  },
  {
    id: "M005",
    name: "Chris Brown",
    username: "@chrisbrown",
    avatar: "CB",
    package: "Staff",
    lastPayment: "February 20, 2024",
    membershipExpiry: "February 20, 2024",
    amountPayable: "LKR 150",
    overdue: "6 Days",
  },
  {
    id: "M006",
    name: "Jessica Martinez",
    username: "@jessicam",
    avatar: "JM",
    package: "Premium",
    lastPayment: "April 3, 2024",
    membershipExpiry: "April 3, 2024",
    amountPayable: "LKR 150",
    overdue: "5 Days",
  },
  {
    id: "M007",
    name: "David Lee",
    username: "@davidlee",
    avatar: "DL",
    package: "Standard",
    lastPayment: "June 18, 2024",
    membershipExpiry: "June 18, 2024",
    amountPayable: "LKR 150",
    overdue: "5 Days",
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

export function PendingPaymentsTable() {
  return (
    <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
            <th className="w-12 px-4 py-3">
              <Checkbox className="border-[#3a3a3a]" />
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Package</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Last Payment</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Membership Expiry</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Amount Payable</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Overdue</th>
          </tr>
        </thead>
        <tbody>
          {pendingPayments.map((payment, index) => (
            <tr
              key={payment.id}
              className={`border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors ${
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
                      {payment.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{payment.name}</div>
                    <div className="text-sm text-muted-foreground">{payment.username}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge variant="secondary" className={getPackageBadgeClass(payment.package)}>
                  {payment.package}
                </Badge>
              </td>
              <td className="px-4 py-4 text-sm text-muted-foreground">{payment.lastPayment}</td>
              <td className="px-4 py-4 text-sm text-muted-foreground">{payment.membershipExpiry}</td>
              <td className="px-4 py-4 text-sm font-semibold text-destructive">{payment.amountPayable}</td>
              <td className="px-4 py-4 text-sm text-muted-foreground">{payment.overdue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
