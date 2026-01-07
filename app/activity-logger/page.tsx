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
import { Search, Calendar, Download, Dumbbell, UserPlus, Edit3 } from "lucide-react"
import { useState, useMemo } from "react"

interface ActivityLog {
  id: string
  trainerId: string
  trainerName: string
  trainerAvatar: string
  action: "created" | "updated" | "assigned" | "deleted"
  actionType: "workout_plan" | "assignment"
  details: string
  targetMember?: string
  timestamp: string
  date: string
}

// Mock activity logs
const activityLogs: ActivityLog[] = [
  {
    id: "L001",
    trainerId: "T001",
    trainerName: "Alex Johnson",
    trainerAvatar: "AJ",
    action: "created",
    actionType: "workout_plan",
    details: "Created new workout plan: Advanced Strength Training",
    timestamp: "10:30 AM",
    date: "2024-01-07",
  },
  {
    id: "L002",
    trainerId: "T002",
    trainerName: "Sarah Williams",
    trainerAvatar: "SW",
    action: "assigned",
    actionType: "assignment",
    details: "Assigned workout plan to John Smith",
    targetMember: "John Smith",
    timestamp: "11:15 AM",
    date: "2024-01-07",
  },
  {
    id: "L003",
    trainerId: "T001",
    trainerName: "Alex Johnson",
    trainerAvatar: "AJ",
    action: "updated",
    actionType: "workout_plan",
    details: "Updated workout plan: Cardio Blast - Changed duration from 30 to 45 minutes",
    timestamp: "02:45 PM",
    date: "2024-01-07",
  },
  {
    id: "L004",
    trainerId: "T003",
    trainerName: "Mike Brown",
    trainerAvatar: "MB",
    action: "assigned",
    actionType: "assignment",
    details: "Assigned workout plan to Emily Davis",
    targetMember: "Emily Davis",
    timestamp: "03:20 PM",
    date: "2024-01-07",
  },
  {
    id: "L005",
    trainerId: "T002",
    trainerName: "Sarah Williams",
    trainerAvatar: "SW",
    action: "created",
    actionType: "workout_plan",
    details: "Created new workout plan: Yoga Flow",
    timestamp: "04:00 PM",
    date: "2024-01-07",
  },
  {
    id: "L006",
    trainerId: "T001",
    trainerName: "Alex Johnson",
    trainerAvatar: "AJ",
    action: "assigned",
    actionType: "assignment",
    details: "Assigned workout plan to Sarah Johnson",
    targetMember: "Sarah Johnson",
    timestamp: "09:30 AM",
    date: "2024-01-06",
  },
  {
    id: "L007",
    trainerId: "T003",
    trainerName: "Mike Brown",
    trainerAvatar: "MB",
    action: "updated",
    actionType: "workout_plan",
    details: "Updated workout plan: HIIT Session - Reduced rest time between sets",
    timestamp: "01:15 PM",
    date: "2024-01-06",
  },
  {
    id: "L008",
    trainerId: "T002",
    trainerName: "Sarah Williams",
    trainerAvatar: "SW",
    action: "deleted",
    actionType: "workout_plan",
    details: "Deleted workout plan: Old Beginner Plan",
    timestamp: "03:45 PM",
    date: "2024-01-05",
  },
]

export default function ActivityLoggerPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [actionFilter, setActionFilter] = useState<"all" | "created" | "updated" | "assigned" | "deleted">("all")
  const [trainerFilter, setTrainerFilter] = useState("all")

  // Get unique trainers for filter
  const trainers = Array.from(new Set(activityLogs.map(log => log.trainerName)))

  // Filter logs
  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      const matchesSearch = searchTerm === "" ||
        log.trainerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.targetMember?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

      const matchesDateRange = (!startDate || log.date >= startDate) && (!endDate || log.date <= endDate)
      const matchesAction = actionFilter === "all" || log.action === actionFilter
      const matchesTrainer = trainerFilter === "all" || log.trainerName === trainerFilter

      return matchesSearch && matchesDateRange && matchesAction && matchesTrainer
    })
  }, [searchTerm, startDate, endDate, actionFilter, trainerFilter])

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "workout_plan":
        return <Dumbbell className="h-4 w-4" />
      case "assignment":
        return <UserPlus className="h-4 w-4" />
      default:
        return <Edit3 className="h-4 w-4" />
    }
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case "created":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Created</Badge>
      case "updated":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">Updated</Badge>
      case "assigned":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">Assigned</Badge>
      case "deleted":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">Deleted</Badge>
      default:
        return <Badge>{action}</Badge>
    }
  }

  const handleExportCSV = () => {
    const headers = ["Trainer", "Action", "Details", "Target Member", "Date", "Time"]
    const rows = filteredLogs.map(log => [
      log.trainerName,
      log.action.toUpperCase(),
      log.details,
      log.targetMember || "-",
      log.date,
      log.timestamp,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Activity Logger</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Track all trainer activities: workout plan changes and member assignments
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
                  placeholder="Search by trainer, member, or activity details..."
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

              {/* Action Filter */}
              <div>
                <Label htmlFor="actionFilter" className="mb-2 block text-sm">
                  Action Type
                </Label>
                <Select
                  value={actionFilter}
                  onValueChange={(value: "all" | "created" | "updated" | "assigned" | "deleted") => setActionFilter(value)}
                >
                  <SelectTrigger id="actionFilter" className="bg-secondary border-[#3a3a3a]">
                    <SelectValue placeholder="All Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="created">Created</SelectItem>
                    <SelectItem value="updated">Updated</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Trainer Filter */}
              <div>
                <Label htmlFor="trainerFilter" className="mb-2 block text-sm">
                  Trainer
                </Label>
                <Select value={trainerFilter} onValueChange={(value) => setTrainerFilter(value)}>
                  <SelectTrigger id="trainerFilter" className="bg-secondary border-[#3a3a3a]">
                    <SelectValue placeholder="All Trainers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Trainers</SelectItem>
                    {trainers.map((trainer) => (
                      <SelectItem key={trainer} value={trainer}>
                        {trainer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(searchTerm || startDate || endDate || actionFilter !== "all" || trainerFilter !== "all") && (
              <div className="flex items-center gap-2 pt-4 border-t border-[#2a2a2a]">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredLogs.length} of {activityLogs.length} activities
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setStartDate("")
                    setEndDate("")
                    setActionFilter("all")
                    setTrainerFilter("all")
                  }}
                  className="text-xs text-muted-foreground"
                >
                  Clear filters
                </Button>
                <Button
                  onClick={handleExportCSV}
                  size="sm"
                  className="ml-auto gap-2 bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80"
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
          {filteredLogs.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No activities found</p>
            </Card>
          ) : (
            filteredLogs.map((log) => (
              <Card key={log.id} className="p-4 hover:bg-card/80 transition-colors border-[#2a2a2a]">
                <div className="flex items-start gap-4">
                  {/* Trainer Avatar */}
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-[#E8FF00]/20 text-[#E8FF00] font-semibold">
                      {log.trainerAvatar}
                    </AvatarFallback>
                  </Avatar>

                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{log.trainerName}</span>
                      {getActionBadge(log.action)}
                      <span className="text-sm text-muted-foreground">
                        {formatDate(log.date)} at {log.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                    {log.targetMember && (
                      <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <UserPlus className="h-3 w-3" />
                        Member: {log.targetMember}
                      </div>
                    )}
                  </div>

                  {/* Action Type Icon */}
                  <div className="flex-shrink-0 p-2 bg-secondary rounded-lg text-[#E8FF00]">
                    {getActionIcon(log.actionType)}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
