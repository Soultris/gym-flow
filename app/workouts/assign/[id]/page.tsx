"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2, Check } from "lucide-react"
import Link from "next/link"
import { useState, use } from "react"

const workoutPlans = [
  {
    id: 1,
    name: "Chest Builder",
    description: "Focuses on developing chest muscles using exercises like bench press, push-ups, and chest flys. Helps increase upper body strength and muscle size.",
    exercises: [
      { name: "Upper Chest", reps: "12 x 4" },
      { name: "Middle Chest", reps: "10 x 4" },
      { name: "Lower Chest", reps: "12 x 4" },
      { name: "Front Shoulders", reps: "10 x 3" },
      { name: "Triceps", reps: "12 x 3" },
    ],
  },
  {
    id: 2,
    name: "Back & Biceps",
    description: "Complete back strengthening routine with biceps exercises for upper body development and strength.",
    exercises: [
      { name: "Lat Pulldowns", reps: "12 x 4" },
      { name: "Barbell Rows", reps: "10 x 4" },
      { name: "Face Pulls", reps: "12 x 3" },
      { name: "Barbell Curls", reps: "10 x 4" },
      { name: "Hammer Curls", reps: "12 x 3" },
    ],
  },
  {
    id: 3,
    name: "Leg Day Pro",
    description: "Comprehensive leg workout focusing on quad, hamstring, and glute development with compound movements.",
    exercises: [
      { name: "Squats", reps: "10 x 4" },
      { name: "Leg Press", reps: "12 x 4" },
      { name: "Leg Curls", reps: "12 x 3" },
      { name: "Calf Raises", reps: "15 x 3" },
      { name: "Lunges", reps: "12 x 3" },
    ],
  },
  {
    id: 4,
    name: "Full Body Blast",
    description: "Total body conditioning program combining strength training with cardio elements for overall fitness.",
    exercises: [
      { name: "Bench Press", reps: "10 x 4" },
      { name: "Squats", reps: "10 x 4" },
      { name: "Deadlifts", reps: "8 x 3" },
      { name: "Push-ups", reps: "15 x 3" },
      { name: "Cardio", reps: "20 min" },
    ],
  },
]

const mockMembers = [
  { id: "M001", name: "John Smith" },
  { id: "M002", name: "Sarah Johnson" },
  { id: "M003", name: "Mike Wilson" },
  { id: "M004", name: "Emily Davis" },
  { id: "M005", name: "Chris Brown" },
  { id: "M006", name: "Jessica Martinez" },
  { id: "M007", name: "David Lee" },
]

export default function AssignWorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null)
  const [assigned, setAssigned] = useState(false)

  const member = mockMembers.find(m => m.id === resolvedParams.id)

  const handleAssign = () => {
    if (selectedWorkout) {
      setAssigned(true)
      setTimeout(() => {
        setAssigned(false)
        setSelectedWorkout(null)
      }, 2000)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link href="/members">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Members
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Assign Workout Plan</h1>
          <p className="text-muted-foreground mt-2">
            Select and assign a workout plan to <span className="font-semibold text-foreground">{member?.name}</span>
          </p>
        </div>

        {/* Member Info Card */}
        <Card className="p-6 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Assigning to</p>
              <h2 className="text-2xl font-bold">{member?.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">Member ID: {member?.id}</p>
            </div>
            {assigned && (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="h-6 w-6" />
                <span className="font-semibold">Assigned!</span>
              </div>
            )}
          </div>
        </Card>

        {/* Workout Plans Grid */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Available Workout Plans</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {workoutPlans.map((workout) => (
              <Card
                key={workout.id}
                onClick={() => setSelectedWorkout(workout.id)}
                className={`p-5 transition-all cursor-pointer ${
                  selectedWorkout === workout.id
                    ? "border-[#E8FF00] border-2 bg-[#E8FF00]/5"
                    : "hover:border-[#E8FF00]/50"
                }`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold">{workout.name}</h3>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{workout.description}</p>
                  </div>
                  {selectedWorkout === workout.id && (
                    <div className="h-5 w-5 rounded-full border-2 border-[#E8FF00] bg-[#E8FF00] ml-2 flex-shrink-0" />
                  )}
                </div>

                <div className="mb-4 space-y-2">
                  {workout.exercises.map((exercise, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#E8FF00] mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{exercise.name}</p>
                        <p className="text-xs text-muted-foreground">{exercise.reps}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <Link href="/members">
            <Button variant="outline" className="border-[#2a2a2a]">
              Cancel
            </Button>
          </Link>
          <Link href="/members">
            <Button
              onClick={handleAssign}
              disabled={!selectedWorkout}
              className="bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {assigned ? "✓ Workout Assigned" : "Assign Workout"}
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
