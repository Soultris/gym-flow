"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCards } from "@/components/stats-cards"
import { MembershipChart } from "@/components/membership-chart"
import { RecentActivity } from "@/components/recent-activity"
import { QuickActions } from "@/components/quick-actions"
import { useAppSelector } from "@/store/hooks"

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user)
  const isTrainer = user?.role?.name === "Trainer"

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-balance">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s your gym overview.</p>
        </div>

        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-3">
          {!isTrainer && (
            <div className="lg:col-span-2">
              <MembershipChart />
            </div>
          )}
          <div className={isTrainer ? "lg:col-span-3 transition-all duration-300" : ""}>
            <QuickActions />
          </div>
        </div>

        {!isTrainer && <RecentActivity />}
      </div>
    </DashboardLayout>
  )
}
