"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useGetActivityFeedQuery } from "@/store/api/dashboardApi"

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

function getActivityColor(type: string): string {
  switch (type) {
    case 'member': return 'bg-blue-500/10 text-blue-500'
    case 'transaction': return 'bg-green-500/10 text-green-500'
    case 'workout': return 'bg-purple-500/10 text-purple-500'
    default: return 'bg-gray-500/10 text-gray-500'
  }
}

export function RecentActivity() {
  const { data, isLoading } = useGetActivityFeedQuery({ limit: 10 })
  const activities = data?.activities || []

  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-4 animate-pulse">
              <div className="h-10 w-10 bg-secondary rounded-full" />
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-secondary rounded mb-2" />
                <div className="h-3 w-1/4 bg-secondary rounded" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <p className="text-muted-foreground text-sm">No recent activity</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.activityId} className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-secondary">
                {activity.user?.name?.substring(0, 2).toUpperCase() || 'SY'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{activity.user?.name || 'System'}</span>
                <Badge variant="outline" className={getActivityColor(activity.type)}>
                  {activity.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{activity.action}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
