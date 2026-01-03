"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, Plus } from "lucide-react"
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
    { name: "Trainers", href: "/members/trainers", count: 15 },
  ]

  const getHeaderTitle = () => {
    switch (currentTab) {
      case "active":
        return "Active members (128)"
      case "pending":
        return "Pending members (38)"
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{getHeaderTitle()}</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9  bg-[#1a1a1a] border-[#2a2a2a]" />
          </div>
          <Button variant="outline" size="sm" className="gap-2 border-[#2a2a2a] bg-transparent">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          <Link href="/members/new">
            <Button size="sm" className="gap-2 bg-primary text-secondary hover:bg-primary/50 font-semibold">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </Link>
          <Link href="/bulk-sms">
            <Button size="sm" className="gap-2 bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/50">
              <Plus className="h-4 w-4" />
              Bulk SMS
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-[#2a2a2a]">
        {tabs.map((tab) => {
          const isActive = currentTab === "" ? tab.href === "/members" : tab.href === pathname
          return (
            <Link key={tab.href} href={tab.href}>
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
  )
}
