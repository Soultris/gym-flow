"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { FinanceOverview } from "@/components/finance/finance-overview"
import { RevenueChart } from "@/components/finance/revenue-chart"
import { TransactionHistoryTable } from "@/components/finance/transaction-history-table"
import { PendingPaymentsTable } from "@/components/finance/pending-payments-table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function FinancePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-balance">Finance</h1>
          <p className="text-muted-foreground mt-1">Monitor payments and revenue</p>
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList className="bg-transparent border-b border-[#2a2a2a] rounded-none h-auto p-0 gap-6 inline-flex">
            <TabsTrigger
              value="dashboard"
              className="bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-1 pb-3 pt-0 text-muted-foreground data-[state=active]:text-foreground"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="transaction-history"
              className="bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-1 pb-3 pt-0 text-muted-foreground data-[state=active]:text-foreground"
            >
              Transaction History
            </TabsTrigger>
            <TabsTrigger
              value="pending-payments"
              className="bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-1 pb-3 pt-0 text-muted-foreground data-[state=active]:text-foreground"
            >
              Pending Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="flex flex-col gap-6">
              <FinanceOverview />
              <RevenueChart />
            </div>
          </TabsContent>

          <TabsContent value="transaction-history" className="mt-6">
            <TransactionHistoryTable />
          </TabsContent>

          <TabsContent value="pending-payments" className="mt-6">
            <PendingPaymentsTable />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
