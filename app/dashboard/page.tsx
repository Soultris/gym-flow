import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCards } from "@/components/stats-cards"
import { MembershipChart } from "@/components/membership-chart"
import { RecentActivity } from "@/components/recent-activity"
import { QuickActions } from "@/components/quick-actions"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-balance">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your gym overview.</p>
        </div>

        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MembershipChart />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        <RecentActivity />
      </div>
    </DashboardLayout>
  )
}
