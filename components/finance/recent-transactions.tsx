import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreditCard, Wallet, Banknote } from "lucide-react"

const transactions = [
  {
    id: "TXN001",
    member: "John Smith",
    avatar: "JS",
    amount: "$80",
    method: "Credit Card",
    type: "Membership",
    status: "Completed",
    date: "Jun 23, 2024",
    time: "10:30 AM",
  },
  {
    id: "TXN002",
    member: "Sarah Johnson",
    avatar: "SJ",
    amount: "$120",
    method: "Cash",
    type: "Membership + PT",
    status: "Completed",
    date: "Jun 23, 2024",
    time: "09:15 AM",
  },
  {
    id: "TXN003",
    member: "Mike Wilson",
    avatar: "MW",
    amount: "$50",
    method: "Debit Card",
    type: "Membership",
    status: "Completed",
    date: "Jun 22, 2024",
    time: "06:45 PM",
  },
  {
    id: "TXN004",
    member: "Emily Davis",
    avatar: "ED",
    amount: "$30",
    method: "Credit Card",
    type: "Membership",
    status: "Pending",
    date: "Jun 22, 2024",
    time: "02:20 PM",
  },
  {
    id: "TXN005",
    member: "Chris Brown",
    avatar: "CB",
    amount: "$50",
    method: "Cash",
    type: "Membership",
    status: "Completed",
    date: "Jun 21, 2024",
    time: "11:00 AM",
  },
]

const getMethodIcon = (method: string) => {
  if (method === "Cash") return Banknote
  if (method === "Debit Card") return Wallet
  return CreditCard
}

export function RecentTransactions() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <a href="/finance/history" className="text-sm text-primary hover:underline">
          View all
        </a>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => {
          const MethodIcon = getMethodIcon(transaction.method)
          return (
            <div
              key={transaction.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-secondary text-foreground">{transaction.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{transaction.member}</p>
                  <span className="text-xs text-muted-foreground">• {transaction.id}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <MethodIcon className="h-3 w-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {transaction.method} • {transaction.type}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg text-accent">{transaction.amount}</p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
              <Badge
                variant="outline"
                className={
                  transaction.status === "Completed" ? "border-accent text-accent" : "border-primary text-primary"
                }
              >
                {transaction.status}
              </Badge>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
