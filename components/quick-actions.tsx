"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus, ClipboardList, MessageSquare, RotateCw, Search, Loader2 } from "lucide-react"
import { useGetMembersQuery } from "@/store/api/membersApi"

const actions = [
  {
    title: "Add Member",
    description: "Register new gym member",
    icon: UserPlus,
    href: "/members/new",
  },
  {
    title: "Pending Memberships",
    description: "Manage pending memberships",
    icon: MessageSquare,
    href: "/members/pending",
  },
]

export function QuickActions() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch members from API
  const { data: membersData, isLoading } = useGetMembersQuery({ limit: 1000 })

  // Transform API members to match the format needed
  const members = useMemo(() => {
    if (!membersData?.members) return []
    return membersData.members.map((member: any) => ({
      id: String(member.memberId),
      name: member.name,
    }))
  }, [membersData])

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleMemberSelect = (member: { id: string; name: string }) => {
    // Navigate to members page with query params to filter and open renewal dialog
    router.push(`/members?renewMemberId=${member.id}&renewMemberName=${encodeURIComponent(member.name)}`)
    setSearchTerm("")
    setShowDropdown(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="w-full justify-start h-auto p-4 hover:bg-secondary hover:border-primary/50 transition-all bg-transparent"
              asChild
            >
              <a href={action.href}>
                <div className="flex items-start gap-3 w-full">
                  <div className="rounded-lg bg-secondary p-2 mt-0.5">
                    <action.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                  </div>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <RotateCw className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Quick Renewal</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Search for a member to quickly renew their membership
        </p>
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <Input
              placeholder="Search member by name or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setShowDropdown(e.target.value.length > 0)
              }}
              onFocus={() => searchTerm.length > 0 && setShowDropdown(true)}
              className="pl-10 bg-secondary border-[#3a3a3a]"
              disabled={isLoading}
            />
          </div>
          {showDropdown && filteredMembers.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleMemberSelect(member)}
                  className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 border-b border-border last:border-b-0"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                    {member.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {member.id}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {showDropdown && searchTerm.length > 0 && filteredMembers.length === 0 && !isLoading && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg p-4">
              <p className="text-sm text-muted-foreground text-center">No members found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
