import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, CreditCard, ClipboardList, MessageSquare } from "lucide-react"

const actions = [
  {
    title: "Add Member",
    description: "Register new gym member",
    icon: UserPlus,
    href: "/members/new",
  },{
    title: "Pending Memberships",
    description: "Manage pending memberships",
    icon: MessageSquare,
    href: "/members/pending",
  },
  {
    title: "Mark Attendance",
    description: "Track daily check-ins",
    icon: ClipboardList,
    href: "/attendance",
  },
   {
    title: "Record Payment",
    description: "Log member payment",
    icon: CreditCard,
    href: "/finance/payment",
  },
  
]

export function QuickActions() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant="outline"
            className="w-full justify-start h-auto p-4 hover:bg-secondary hover:border-primary/50 transition-all bg-transparent"
            asChild
          >
            <a href={action.href}>
              <div className="flex items-start gap-3 w-full">
                <div className="rounded-lg bg-secondary p-2 mt-0.5">
                  <action.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                </div>
              </div>
            </a>
          </Button>
        ))}
      </div>
    </Card>
  )
}
