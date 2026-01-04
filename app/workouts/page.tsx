import { DashboardLayout } from "@/components/dashboard-layout"
import { WorkoutsList } from "@/components/workouts/workouts-list"
import { PackagesList } from "@/components/workouts/packages-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WorkoutsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-balance">Workouts & Packages</h1>
          <p className="text-muted-foreground mt-1">Manage workout plans and membership packages</p>
        </div>

        <Tabs defaultValue="workouts" className="w-full">
          <TabsList>
            <TabsTrigger value="workouts">Workout Plans</TabsTrigger>
            <TabsTrigger value="packages">Membership Packages</TabsTrigger>
          </TabsList>

          <TabsContent value="workouts" className="mt-6">
            <WorkoutsList />
          </TabsContent>

          <TabsContent value="packages" className="mt-6">
            <PackagesList />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
