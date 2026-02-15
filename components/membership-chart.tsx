"use client"

import { Card } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { useGetMembershipReportQuery } from "@/store/api/dashboardApi"
import { useGetTransactionsQuery, Transaction } from "@/store/api/transactionsApi"
import { useGetMembersQuery, Member } from "@/store/api/membersApi"
import { useMemo } from "react"
import { Loader2 } from "lucide-react"

export function MembershipChart() {
  const { data: membershipReport } = useGetMembershipReportQuery()
  const { data: transactionsData } = useGetTransactionsQuery({ limit: 1000 })
  const { data: membersData } = useGetMembersQuery({ limit: 1000 })

  const chartData = useMemo(() => {
    // If we have membership report data, use it
    if (membershipReport && Array.isArray(membershipReport)) {
      return membershipReport
    }

    // Otherwise, calculate from members and transactions data
    if (membersData?.members && transactionsData?.transactions) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const now = new Date()
      const lastSixMonths = []

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const month = months[date.getMonth()]
        
        // Count members added in this month
        const membersThisMonth = membersData.members.filter((member: Member) => {
          const memberDate = new Date(member.joiningDate)
          return (
            memberDate.getFullYear() === date.getFullYear() &&
            memberDate.getMonth() === date.getMonth()
          )
        }).length

        // Sum revenue for this month
        const revenueThisMonth = transactionsData.transactions
          .filter((transaction: Transaction) => {
            const txDate = new Date(transaction.paidAt) // Use paidAt instead of createdAt/date based on interface
            return (
              txDate.getFullYear() === date.getFullYear() &&
              txDate.getMonth() === date.getMonth()
            )
          })
          .reduce((sum: number, tx: Transaction) => sum + (tx.price || 0), 0) // Use price based on Transaction interface

        lastSixMonths.push({
          month,
          members: membersThisMonth,
          revenue: revenueThisMonth,
        })
      }
      return lastSixMonths
    }

    // Default data if APIs not loaded
    return [
      { month: "Jan", members: 0, revenue: 0 },
      { month: "Feb", members: 0, revenue: 0 },
      { month: "Mar", members: 0, revenue: 0 },
      { month: "Apr", members: 0, revenue: 0 },
      { month: "May", members: 0, revenue: 0 },
      { month: "Jun", members: 0, revenue: 0 },
    ]
  }, [membershipReport, membersData, transactionsData])

  const isLoading = !membershipReport && !membersData

  return (
    <Card className="p-6">
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-semibold">Membership Growth</h3>
        <p className="text-sm text-muted-foreground">Track your gym&apos;s growth over time</p>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2E" />
              <XAxis dataKey="month" stroke="#A0A0A0" style={{ fontSize: "12px" }} />
              <YAxis stroke="#A0A0A0" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2C2C2E",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                }}
              />
              <Line type="monotone" dataKey="members" stroke="#F4F933" strokeWidth={2} dot={{ fill: "#F4F933", r: 4 }} />
              <Line type="monotone" dataKey="revenue" stroke="#FFFFFF" strokeWidth={2} dot={{ fill: "#FFFFFF", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Members</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Revenue</span>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
