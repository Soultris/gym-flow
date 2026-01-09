"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Printer, Mail, Send } from "lucide-react"

interface Exercise {
  name: string
  reps: string
}

interface WorkoutTemplate {
  id: number
  name: string
  description: string
  exercises: Exercise[]
}

interface AssignedWorkout {
  id: string
  memberId: string
  memberName: string
  workoutId: number
  workoutName: string
  startDate: string
  endDate: string
  assignedDate: string
  notificationSent: boolean
  notificationType?: "sms" | "email" | "both"
}

interface AssignedWorkoutsProps {
  memberId: string
  assignedWorkouts: AssignedWorkout[]
  workoutTemplates: WorkoutTemplate[]
  onPrint?: (assignedWorkoutId: string) => void
  onSendNotification?: (assignedWorkoutId: string, type: "sms" | "email") => void
}

export function AssignedWorkouts({
  memberId,
  assignedWorkouts,
  workoutTemplates,
  onPrint,
  onSendNotification,
}: AssignedWorkoutsProps) {
  const memberAssignments = assignedWorkouts.filter(a => a.memberId === memberId)

  if (memberAssignments.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Assigned Workout Plans</h3>
        <p className="text-muted-foreground">No workout plans assigned yet.</p>
      </Card>
    )
  }

  const isWithinDateRange = (startDate: string, endDate: string) => {
    const today = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    return today >= start && today <= end
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Assigned Workout Plans</h3>
      <div className="space-y-4">
        {memberAssignments.map((assignment) => {
          const template = workoutTemplates.find(t => t.id === assignment.workoutId)
          const isActive = isWithinDateRange(assignment.startDate, assignment.endDate)

          return (
            <div
              key={assignment.id}
              className={`border rounded-lg p-4 ${
                isActive ? "border-accent bg-accent/5" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-base">{assignment.workoutName}</h4>
                    {isActive && <Badge className="bg-green-600 text-white">Active</Badge>}
                    {assignment.notificationSent && (
                      <Badge variant="secondary">Notified</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>{assignment.startDate}</span>
                    <span>→</span>
                    <span>{assignment.endDate}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  Assigned: {assignment.assignedDate}
                </div>
              </div>

              {template && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {template.exercises.map((exercise, idx) => (
                      <div key={idx} className="text-sm bg-muted/50 p-2 rounded">
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-xs text-muted-foreground">{exercise.reps}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t">
                {onPrint && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPrint(assignment.id)}
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                )}
                {onSendNotification && !assignment.notificationSent && (
                  <>
                    {(assignment.notificationType === "email" ||
                      assignment.notificationType === "both") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSendNotification(assignment.id, "email")}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    )}
                    {(assignment.notificationType === "sms" ||
                      assignment.notificationType === "both") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSendNotification(assignment.id, "sms")}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        SMS
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
