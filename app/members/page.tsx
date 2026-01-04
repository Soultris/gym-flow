import { DashboardLayout } from "@/components/dashboard-layout"
import { MembersList } from "@/components/members/members-list"
import { MembersHeader } from "@/components/members/members-header"
import { Suspense } from "react"

export default function MembersPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <MembersHeader />
        <Suspense fallback={<div>Loading members...</div>}>
          <MembersList />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
