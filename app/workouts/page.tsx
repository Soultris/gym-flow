import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { WorkoutsList } from "@/components/workouts/workouts-list"

export default function WorkoutsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-balance">Workout Master</h1>
          <p className="text-muted-foreground mt-1">Manage workout plans and training programs</p>
        </div>

        <Suspense fallback={<div className="text-muted-foreground">Loading workouts...</div>}>
          <WorkoutsList />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
