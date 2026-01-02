import { DashboardLayout } from "@/components/dashboard-layout"
import { FinanceOverview } from "@/components/finance/finance-overview"
import { RevenueChart } from "@/components/finance/revenue-chart"
import { RecentTransactions } from "@/components/finance/recent-transactions"
import { PendingPayments } from "@/components/finance/pending-payments"

export default function FinancePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Finance</h1>
          <p className="text-muted-foreground mt-1">Monitor payments and revenue</p>
        </div>

        <FinanceOverview />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <PendingPayments />
          </div>
        </div>

        <RecentTransactions />
      </div>
    </DashboardLayout>
  )
}
