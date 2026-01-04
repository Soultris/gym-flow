"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { BulkSmsForm } from "@/components/sms/bulk-sms-form"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function BulkSmsContent() {
  const searchParams = useSearchParams()
  const memberId = searchParams.get("memberId")
  const memberName = searchParams.get("memberName")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Bulk SMS</h1>
        <p className="text-muted-foreground mt-2">Send SMS messages to multiple members</p>
      </div>

      <BulkSmsForm initialMemberId={memberId || ""} initialMemberName={memberName || ""} />
    </div>
  )
}

export default function BulkSmsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <BulkSmsContent />
      </Suspense>
    </DashboardLayout>
  )
}
