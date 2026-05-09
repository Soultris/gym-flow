"use client"

import { Button } from "@/components/ui/button"
import { Plus, MessageSquare } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useGetMemberCountsQuery } from "@/store/api/membersApi"
import { useAppSelector } from "@/store/hooks"

export function MembersHeader() {
  const pathname = usePathname()
  const user = useAppSelector((state) => state.auth.user)

  // Single lightweight count query — no member data fetched
  const { data: counts } = useGetMemberCountsQuery()

  const totalCount = counts?.total ?? 0
  const activeCount = counts?.active ?? 0
  const expiredCount = counts?.expired ?? 0
  const pendingCount = counts?.pending ?? 0
  const deactivatedCount = counts?.deactivated ?? 0
  const pendingTrainersCount = counts?.trainerPending ?? 0
  const trainersCount = counts?.trainerTotal ?? 0

  const getTabs = () => {
    const baseTab = pathname.split("/")[2] || ""
    return baseTab
  }

  const currentTab = getTabs()

  const tabs = [
    { name: "View all", href: "/members", count: totalCount },
    { name: "Active", href: "/members/active", count: activeCount },
    { name: "Expired", href: "/members/expired", count: expiredCount },
    { name: "QR Members", href: "/members/pending", count: pendingCount },
    { name: "Deactivated", href: "/members/deactivated", count: deactivatedCount },
    { name: "Pending Trainers", href: "/members/pending-trainers", count: pendingTrainersCount },
    { name: "Trainers", href: "/members/trainers", count: trainersCount },
  ]

  const getHeaderTitle = () => {
    switch (currentTab) {
      case "active":
        return `Active members (${activeCount})`
      case "pending":
        return `QR Members (${pendingCount})`
      case "deactivated":
        return `Deactivated members (${deactivatedCount})`
      case "pending-trainers":
        return `Pending Trainers (${pendingTrainersCount})`
      case "expired":
        return `Expired members (${expiredCount})`
      case "trainers":
        return `Trainers (${trainersCount})`
      default:
        return `All members (${totalCount})`
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header Row - Stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold">{getHeaderTitle()}</h1>
        
        {/* Actions - Wraps on mobile */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {user?.features?.includes('DIRECT_MEMBER_CREATION') && (
            <Link href="/members/new">
              <Button size="sm" className="gap-2 bg-primary text-secondary hover:bg-primary/50 font-semibold">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Member</span>
              </Button>
            </Link>
          )}
          <Link href="/trainer-signup">
            <Button size="sm" className="gap-2 bg-primary text-secondary hover:bg-primary/50 font-semibold">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Trainer</span>
            </Button>
          </Link>
          <Link href="/bulk-sms">
            <Button size="sm" className="gap-2 bg-primary text-secondary hover:bg-primary/50 font-semibold">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Bulk SMS</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs - Scrollable on mobile */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-1 sm:gap-2 border-b border-[#2a2a2a] min-w-max">
          {tabs.map((tab) => {
            // Hide Trainers and Pending Trainers tabs for Trainer role
            if (user?.role?.name === 'Trainer' && (tab.name === 'Trainers' || tab.name === 'Pending Trainers')) {
              return null;
            }

            const isActive = currentTab === "" ? tab.href === "/members" : tab.href === pathname
            return (
              <Link key={tab.href} href={tab.href}>
                <button 
                  className={`px-3 sm:px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "border-b-2 border-primary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.name}
                  {tab.count > 0 && (
                    <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-primary text-secondary" : "bg-secondary text-muted-foreground"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
