import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/buttons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle } from "lucide-react"

const pendingMembers = [
  {
    id: "M004",
    name: "Emily Davis",
    avatar: "ED",
    amount: "$30",
    daysOverdue: 18,
  },
  {
    id: "M012",
    name: "David Lee",
    avatar: "DL",
    amount: "$80",
    daysOverdue: 5,
  },
  {
    id: "M023",
    name: "Lisa Wang",
    avatar: "LW",
    amount: "$50",
    daysOverdue: 3,
  },
  {
    id: "M031",
    name: "Tom Harris",
    avatar: "TH",
    amount: "$120",
    daysOverdue: 12,
  },
]

export function PendingPayments() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <h3 className="text-lg font-semibold">Pending Payments</h3>
      </div>
      <div className="space-y-3">
        {pendingMembers.map((member) => (
          <div key={member.id} className="p-3 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg?height=36&width=36" />
                <AvatarFallback className="bg-secondary text-foreground text-xs">{member.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.daysOverdue} days overdue</p>
              </div>
              <p className="font-semibold text-destructive">{member.amount}</p>
            </div>
            <Button size="sm" variant="outline" className="w-full mt-2 text-xs h-8 bg-transparent">
              Send Reminder
            </Button>
          </div>
        ))}
      </div>
      <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
        Send Bulk Reminders
      </Button>
    </Card>
  )
}
