"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState, use } from "react"

const workoutPlans = [
  {
    id: "W001",
    name: "Strength Training",
    description: "Build muscle and increase strength",
    duration: "12 weeks",
    difficulty: "Intermediate",
    sessions: 4,
  },
  {
    id: "W002",
    name: "Cardio Blast",
    description: "Improve cardiovascular endurance",
    duration: "8 weeks",
    difficulty: "Beginner",
    sessions: 3,
  },
  {
    id: "W003",
    name: "Weight Loss Program",
    description: "Effective fat loss with exercises",
    duration: "16 weeks",
    difficulty: "Intermediate",
    sessions: 5,
  },
  {
    id: "W004",
    name: "Flexibility & Mobility",
    description: "Improve flexibility and range of motion",
    duration: "6 weeks",
    difficulty: "Beginner",
    sessions: 3,
  },
  {
    id: "W005",
    name: "Advanced Bodybuilding",
    description: "Advanced muscle building techniques",
    duration: "20 weeks",
    difficulty: "Advanced",
    sessions: 6,
  },
  {
    id: "W006",
    name: "HIIT Training",
    description: "High intensity interval training",
    duration: "10 weeks",
    difficulty: "Advanced",
    sessions: 4,
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
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null)
  const [assigned, setAssigned] = useState(false)

  const member = mockMembers.find(m => m.id === resolvedParams.id)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
        <Card className="p-6 from-primary/10 to-primary/5 border-primary/20">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workoutPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedWorkout(plan.id)}
                className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedWorkout === plan.id
                    ? "border-primary bg-primary/10"
                    : "border-[#2a2a2a] bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-lg">{plan.name}</h4>
                  {selectedWorkout === plan.id && (
                    <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {plan.duration}
                  </Badge>
                  <Badge className={`text-xs ${getDifficultyColor(plan.difficulty)}`}>
                    {plan.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {plan.sessions}x/week
                  </Badge>
                </div>
              </div>
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
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {assigned ? "✓ Workout Assigned" : "Assign Workout"}
          </Button>
        </Link>
      </div>
      </div>
    </DashboardLayout>
  )
}
