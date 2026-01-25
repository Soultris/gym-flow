import { DashboardLayout } from "@/components/dashboard-layout"
import { MembersHeader } from "@/components/members/members-header"
import { FilteredMembersList } from "@/components/members/filtered-members-list"
import { Suspense } from "react"

export default function ExpiredMembersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <MembersHeader />
        <Suspense fallback={<div>Loading members...</div>}>
          <FilteredMembersList status="expired" />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
