import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    user: "John Smith",
    avatar: "JS",
    action: "checked in",
    time: "2 minutes ago",
    type: "attendance",
  },
  {
    id: 2,
    user: "Sarah Johnson",
    avatar: "SJ",
    action: "made payment",
    amount: "$120",
    time: "15 minutes ago",
    type: "payment",
  },
  {
    id: 3,
    user: "Mike Wilson",
    avatar: "MW",
    action: "completed workout",
    workout: "Strength Training",
    time: "32 minutes ago",
    type: "workout",
  },
  {
    id: 4,
    user: "Emily Davis",
    avatar: "ED",
    action: "joined membership",
    plan: "Premium",
    time: "1 hour ago",
    type: "new-member",
  },
  {
    id: 5,
    user: "Chris Brown",
    avatar: "CB",
    action: "checked in",
    time: "1 hour ago",
    type: "attendance",
  },
]

export function RecentActivity() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <a href="/activity" className="text-sm text-primary">
          View all
        </a>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`/generic-placeholder-graphic.png?height=40&width=40`} />
              <AvatarFallback className="bg-secondary text-foreground">{activity.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>
                {activity.amount && <span className="font-medium text-accent"> {activity.amount}</span>}
                {activity.workout && <span className="font-medium text-primary"> {activity.workout}</span>}
                {activity.plan && <span className="font-medium text-primary"> {activity.plan}</span>}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
            </div>
            <Badge
              variant="outline"
              className={
                activity.type === "payment"
                  ? "border-accent text-accent"
                  : activity.type === "new-member"
                    ? "border-primary text-primary"
                    : "border-muted-foreground/50"
              }
            >
              {activity.type}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}
