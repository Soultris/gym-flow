"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, MessageSquare, Search, SlidersHorizontal } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useGetMembersQuery } from "@/store/api/membersApi"
import { useGetTrainersQuery, Trainer } from "@/store/api/trainersApi"
import { Input } from "../ui/input"
import { useAppSelector } from "@/store/hooks"

export function MembersHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const user = useAppSelector((state) => state.auth.user)
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")

  // Fetch members to get real counts
  const { data: membersData } = useGetMembersQuery({ limit: 1000 })
  const { data: trainersData } = useGetTrainersQuery()

  const members = membersData?.members || []
  const trainers = trainersData || []

  // Calculate counts from actual data
  const totalCount = members.length
  const activeCount = members.filter(m => m.status === 'active').length
  const expiredCount = members.filter(m => m.status === 'expired').length
  const pendingCount = members.filter(m => m.status === 'pending' || m.isPending).length
  const deactivatedCount = members.filter(m => m.status === 'deactivated').length
  const pendingTrainersCount = trainers.filter((t: Trainer) => t.isPending).length
  const trainersCount = trainers.filter((t: Trainer) => !t.isPending).length

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

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }
    // Update the URL with the new search parameter
    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, router, searchParams])

  // Sync state with URL params
  useEffect(() => {
    setSearchValue(searchParams.get("search") || "")
  }, [searchParams])

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
                </button>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, name, email or phone..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
          />
        </div>
        <Button variant="outline" size="icon" className="border-[#2a2a2a] hover:bg-[#1a1a1a]">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
