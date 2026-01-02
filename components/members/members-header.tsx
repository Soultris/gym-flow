"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, Plus } from "lucide-react"
import Link from "next/link"

export function MembersHeader() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All members (248)</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9 w-[280px] bg-[#1a1a1a] border-[#2a2a2a]" />
          </div>
          <Button variant="outline" size="sm" className="gap-2 border-[#2a2a2a] bg-transparent">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          <Link href="/members/new">
            <Button size="sm" className="gap-2 bg-primary text-secondary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-[#2a2a2a]">
        <button className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-foreground">View all</button>
        <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Active
        </button>
        <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Expired
        </button>
        <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Trainers
        </button>
      </div>
    </div>
  )
}
