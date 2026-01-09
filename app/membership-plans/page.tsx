"use client"

import { PackagesList } from "@/components/workouts/packages-list"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function MembershipPlansPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Membership Plans</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view all membership packages offered to members
          </p>
        </div>
        <PackagesList />
      </div>
    </DashboardLayout>
  )
}
