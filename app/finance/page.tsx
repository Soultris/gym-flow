"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FinanceOverview } from "@/components/finance/finance-overview"
import { RevenueChart } from "@/components/finance/revenue-chart"
import { TransactionHistoryTable } from "@/components/finance/transaction-history-table"
import { PendingPaymentsTable } from "@/components/finance/pending-payments-table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useAppSelector } from "@/store/hooks"

export default function FinancePage() {
  const user = useAppSelector((state) => state.auth.user)
  const isTrainer = user?.role?.name === "Trainer"
  const [activeTab, setActiveTab] = useState(isTrainer ? "transaction-history" : "dashboard")

  useEffect(() => {
    if (isTrainer) {
      setActiveTab("transaction-history")
    }
  }, [isTrainer])

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-balance">Finance</h1>
          <p className="text-muted-foreground mt-1">Monitor payments and revenue</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-[#2a2a2a] rounded-none h-auto p-0 gap-4 sm:gap-6 flex overflow-x-auto w-full justify-start whitespace-nowrap">
            {!isTrainer && (
              <TabsTrigger
                value="dashboard"
                className="bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-1 pb-3 pt-0 text-muted-foreground data-[state=active]:text-foreground shrink-0"
              >
                Dashboard
              </TabsTrigger>
            )}
            <TabsTrigger
              value="transaction-history"
              className="bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-1 pb-3 pt-0 text-muted-foreground data-[state=active]:text-foreground shrink-0"
            >
              Transaction History
            </TabsTrigger>
            {!isTrainer && (
              <TabsTrigger
                value="pending-payments"
                className="bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-1 pb-3 pt-0 text-muted-foreground data-[state=active]:text-foreground shrink-0"
              >
                Pending Payments
              </TabsTrigger>
            )}
          </TabsList>

          {!isTrainer && (
            <TabsContent value="dashboard" className="mt-6">
              <div className="flex flex-col gap-6">
                <FinanceOverview />
                <RevenueChart />
              </div>
            </TabsContent>
          )}

          <TabsContent value="transaction-history" className="mt-6">
            <TransactionHistoryTable />
          </TabsContent>

          {!isTrainer && (
            <TabsContent value="pending-payments" className="mt-6">
              <PendingPaymentsTable />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
