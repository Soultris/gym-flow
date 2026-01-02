import { DashboardLayout } from "@/components/dashboard-layout"
import { MemberProfile } from "@/components/members/member-profile"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MemberDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/members">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Member Profile</h1>
            <p className="text-muted-foreground mt-1">View and manage member details</p>
          </div>
        </div>
        <MemberProfile memberId={params.id} />
      </div>
    </DashboardLayout>
  )
}
