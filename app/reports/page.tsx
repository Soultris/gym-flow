import { DashboardLayout } from "@/components/dashboard-layout"
import { ReportCards } from "@/components/reports/report-cards"
import { DailyInvoice } from "@/components/reports/daily-invoice"
import { AttendanceReport } from "@/components/reports/attendance-report"
import { MembershipReport } from "@/components/reports/membership-report"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and view gym analytics</p>
        </div>

        <ReportCards />

        <Tabs defaultValue="daily-invoice" className="w-full">
          <TabsList>
            <TabsTrigger value="daily-invoice">Daily Invoice</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
          </TabsList>

          <TabsContent value="daily-invoice" className="mt-6">
            <DailyInvoice />
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <AttendanceReport />
          </TabsContent>

          <TabsContent value="membership" className="mt-6">
            <MembershipReport />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
