import { DashboardLayout } from "@/components/dashboard-layout"
import { MembersHeader } from "@/components/members/members-header"
import { FilteredMembersList } from "@/components/members/filtered-members-list"
import { Suspense } from "react"

export default function DeactivatedMembersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <MembersHeader />
        <Suspense fallback={<div>Loading deactivated members...</div>}>
          <FilteredMembersList status="deactivated" />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
