"use client"

import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DailyInvoice } from "@/components/reports/daily-invoice"
import { AttendanceReport } from "@/components/reports/attendance-report"
import { MembershipReport } from "@/components/reports/membership-report"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function ReportsContent() {
  const searchParams = useSearchParams()
  const currentTab = searchParams.get("tab") || "daily-invoice"

  const tabs = [
    { name: "Daily Invoice", value: "daily-invoice" },
    { name: "Attendance", value: "attendance" },
    { name: "Membership", value: "membership" },
  ]

  const getHeaderTitle = () => {
    switch (currentTab) {
      case "attendance":
        return "Attendance Report"
      case "membership":
        return "Membership Report"
      default:
        return "Daily Invoice Report"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{getHeaderTitle()}</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#2a2a2a]">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.value
            return (
              <Link key={tab.value} href={`/reports?tab=${tab.value}`}>
                <button 
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-b-2 border-primary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.name}
                </button>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      {currentTab === "daily-invoice" && <DailyInvoice />}
      {currentTab === "attendance" && <AttendanceReport />}
      {currentTab === "membership" && <MembershipReport />}
    </div>
  )
}

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading reports...</div>}>
        <ReportsContent />
      </Suspense>
    </DashboardLayout>
  )
}
