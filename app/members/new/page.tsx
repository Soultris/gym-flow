import { DashboardLayout } from "@/components/dashboard-layout"
import { AddMemberForm } from "@/components/members/add-member-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewMemberPage() {
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
            <h1 className="text-2xl sm:text-3xl font-bold">Add New Member</h1>
            <p className="text-muted-foreground mt-1">Register a new gym member</p>
          </div>
        </div>
        <AddMemberForm />
      </div>
    </DashboardLayout>
  )
}
