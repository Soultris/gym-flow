import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsTabs } from "@/components/settings/settings-tabs"
import { Suspense } from "react"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your gym settings and preferences</p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <SettingsTabs />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
