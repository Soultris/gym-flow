"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const workouts = [
  {
    id: 1,
    name: "Strength Training Program",
    description: "Full body strength building with compound movements",
    duration: "60 min",
    frequency: "4 days/week",
    level: "Intermediate",
    assignedTo: 45,
  },
  {
    id: 2,
    name: "Cardio & Endurance",
    description: "High intensity cardio training for stamina",
    duration: "45 min",
    frequency: "5 days/week",
    level: "Beginner",
    assignedTo: 32,
  },
  {
    id: 3,
    name: "Weight Loss Program",
    description: "Combination of cardio and resistance training",
    duration: "50 min",
    frequency: "6 days/week",
    level: "All Levels",
    assignedTo: 67,
  },
  {
    id: 4,
    name: "Muscle Building",
    description: "Hypertrophy focused training with progressive overload",
    duration: "75 min",
    frequency: "5 days/week",
    level: "Advanced",
    assignedTo: 28,
  },
]

export function WorkoutsList() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Workout Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Workout Plan</DialogTitle>
              <DialogDescription>Add a new workout plan for members</DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="workoutName">Workout Name *</Label>
                <Input id="workoutName" placeholder="e.g., Strength Training Program" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workoutDescription">Description</Label>
                <Textarea id="workoutDescription" placeholder="Describe the workout plan" rows={3} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" placeholder="e.g., 60 min" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input id="frequency" placeholder="e.g., 4 days/week" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Difficulty Level</Label>
                <select id="level" className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>All Levels</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Create Workout
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {workouts.map((workout) => (
          <Card key={workout.id} className="p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{workout.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{workout.description}</p>
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                {workout.level}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium">{workout.duration}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Frequency</p>
                <p className="text-sm font-medium">{workout.frequency}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Users className="h-4 w-4" />
              <span>
                Assigned to <span className="text-accent font-medium">{workout.assignedTo}</span> members
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
