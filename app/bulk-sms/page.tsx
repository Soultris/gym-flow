"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { BulkSmsForm } from "@/components/sms/bulk-sms-form"

export default function BulkSmsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk SMS</h1>
          <p className="text-muted-foreground mt-2">Send SMS messages to multiple members</p>
        </div>

        <BulkSmsForm />
      </div>
    </DashboardLayout>
  )
}
