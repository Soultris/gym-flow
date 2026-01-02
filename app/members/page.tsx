import { DashboardLayout } from "@/components/dashboard-layout"
import { MembersList } from "@/components/members/members-list"
import { MembersHeader } from "@/components/members/members-header"

export default function MembersPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <MembersHeader />
        <MembersList />
      </div>
    </DashboardLayout>
  )
}
