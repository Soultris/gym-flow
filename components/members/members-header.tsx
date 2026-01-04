"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, Plus, MessageSquare } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MembersHeader() {
  const pathname = usePathname()

  const getTabs = () => {
    const baseTab = pathname.split("/")[2] || ""
    return baseTab
  }

  const currentTab = getTabs()

  const tabs = [
    { name: "View all", href: "/members", count: 248 },
    { name: "Active", href: "/members/active", count: 128 },
    { name: "Expired", href: "/members/expired", count: 48 },
    { name: "Pending", href: "/members/pending", count: 38 },
    { name: "Pending Trainers", href: "/members/pending-trainers", count: 8 },
    { name: "Trainers", href: "/members/trainers", count: 15 },
  ]

  const getHeaderTitle = () => {
    switch (currentTab) {
      case "active":
        return "Active members (128)"
      case "pending":
        return "Pending members (38)"
      case "pending-trainers":
        return "Pending Trainers (8)"
      case "expired":
        return "Expired members (48)"
      case "trainers":
        return "Trainers (15)"
      default:
        return "All members (248)"
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header Row - Stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold">{getHeaderTitle()}</h1>
        
        {/* Actions - Wraps on mobile */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative flex-1 sm:flex-initial min-w-[120px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9 bg-[#1a1a1a] border-[#2a2a2a] w-full" />
          </div>
          <Button variant="outline" size="sm" className="gap-2 border-[#2a2a2a] bg-transparent">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
          <Link href="/members/new">
            <Button size="sm" className="gap-2 bg-primary text-secondary hover:bg-primary/50 font-semibold">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Member</span>
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
    </div>
  )
}
