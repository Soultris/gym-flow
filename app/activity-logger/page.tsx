"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Calendar, Download, Dumbbell, UserPlus, Edit3, Loader2, CreditCard, User } from "lucide-react"
import { useState, useMemo } from "react"
import { useGetActivityFeedQuery } from "@/store/api/dashboardApi"

interface ActivityLog {
  activityId: number
  userId: number
  action: string
  timestamp: string
  type: "transaction" | "workout" | "user" | "member"
  user?: {
    userId: number
    name: string
  }
  member?: {
    memberId: number
    name: string
  }
  assignedWorkout?: {
    assignedWorkoutId: number
    name: string
  }
}

export default function ActivityLoggerPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "transaction" | "workout" | "user" | "member">("all")
  const [userFilter, setUserFilter] = useState("all")

  // Build query params
  const queryParams = useMemo(() => {
    const params: { from?: string; to?: string; type?: string; userId?: string; search?: string } = {}
    if (startDate) params.from = startDate
    if (endDate) params.to = endDate
    if (typeFilter !== "all") params.type = typeFilter
    if (userFilter !== "all") params.userId = userFilter
    if (searchTerm) params.search = searchTerm
    return params
  }, [startDate, endDate, typeFilter, userFilter, searchTerm])

  const { data, isLoading, error } = useGetActivityFeedQuery(queryParams)
  
  const activities: ActivityLog[] = data?.activities || []
  const users = data?.users || []

  const getActionIcon = (type: string) => {
    switch (type) {
      case "workout":
        return <Dumbbell className="h-4 w-4" />
      case "member":
        return <UserPlus className="h-4 w-4" />
      case "transaction":
        return <CreditCard className="h-4 w-4" />
      case "user":
        return <User className="h-4 w-4" />
      default:
        return <Edit3 className="h-4 w-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "transaction":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Transaction</Badge>
      case "workout":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">Workout</Badge>
      case "member":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">Member</Badge>
      case "user":
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">User</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  const handleExportCSV = () => {
    const headers = ["User", "Action", "Type", "Target", "Date", "Time"]
    const rows = activities.map(log => [
      log.user?.name || "System",
      formatActionText(log.action, log.type),
      log.type.toUpperCase(),
      log.member?.name || log.assignedWorkout?.name || "-",
      new Date(log.timestamp).toLocaleDateString(),
      new Date(log.timestamp).toLocaleTimeString(),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `activity-log-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
  }

  const formatActionText = (action: string, type: string) => {
    // Replace $ with Rs. for transaction type activities
    if (type === "transaction") {
      return action.replace(/\$/g, "Rs.")
    }
    return action
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Activity Logger</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Track all system activities: transactions, workouts, members, and users
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div>
              <Label htmlFor="search" className="mb-2 block text-sm">
                Search Activities
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by action description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-secondary border-[#3a3a3a]"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Range */}
              <div>
                <Label htmlFor="startDate" className="mb-2 block text-sm">
                  From Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-9 bg-secondary border-[#3a3a3a]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endDate" className="mb-2 block text-sm">
                  To Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-9 bg-secondary border-[#3a3a3a]"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <Label htmlFor="typeFilter" className="mb-2 block text-sm">
                  Activity Type
                </Label>
                <Select
                  value={typeFilter}
                  onValueChange={(value: "all" | "transaction" | "workout" | "user" | "member") => setTypeFilter(value)}
                >
                  <SelectTrigger id="typeFilter" className="bg-secondary border-[#3a3a3a]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="transaction">Transaction</SelectItem>
                    <SelectItem value="workout">Workout</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User Filter */}
              <div>
                <Label htmlFor="userFilter" className="mb-2 block text-sm">
                  User
                </Label>
                <Select value={userFilter} onValueChange={(value) => setUserFilter(value)}>
                  <SelectTrigger id="userFilter" className="bg-secondary border-[#3a3a3a]">
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {users.map((user: { userId: number; name: string }) => (
                      <SelectItem key={user.userId} value={String(user.userId)}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(searchTerm || startDate || endDate || typeFilter !== "all" || userFilter !== "all") && (
              <div className="flex items-center gap-2 pt-4 border-t border-[#2a2a2a]">
                <span className="text-sm text-muted-foreground">
                  Showing {activities.length} activities
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setStartDate("")
                    setEndDate("")
                    setTypeFilter("all")
                    setUserFilter("all")
                  }}
                  className="text-xs text-muted-foreground"
                >
                  Clear filters
                </Button>
                <Button
                  onClick={handleExportCSV}
                  size="sm"
                  className="ml-auto gap-2 bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80"
                  disabled={activities.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Activity Feed */}
        <div className="space-y-3">
          {isLoading ? (
            <Card className="p-8 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Card>
          ) : error ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Failed to load activities</p>
            </Card>
          ) : activities.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No activities found</p>
            </Card>
          ) : (
            activities.map((log) => {
              const { date, time } = formatDateTime(log.timestamp)
              return (
                <Card key={log.activityId} className="p-4 hover:bg-card/80 transition-colors border-[#2a2a2a]">
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback className="bg-[#E8FF00]/20 text-[#E8FF00] font-semibold">
                        {log.user ? getInitials(log.user.name) : "SYS"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Activity Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">{log.user?.name || "System"}</span>
                        {getTypeBadge(log.type)}
                        <span className="text-sm text-muted-foreground">
                          {date} at {time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{formatActionText(log.action, log.type)}</p>
                      {log.member && (
                        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <UserPlus className="h-3 w-3" />
                          Member: {log.member.name}
                        </div>
                      )}
                      {log.assignedWorkout && (
                        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Dumbbell className="h-3 w-3" />
                          Workout: {log.assignedWorkout.name}
                        </div>
                      )}
                    </div>

                    {/* Type Icon */}
                    <div className="flex-shrink-0 p-2 bg-secondary rounded-lg text-[#E8FF00]">
                      {getActionIcon(log.type)}
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
