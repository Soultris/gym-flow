"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { MembersHeader } from "@/components/members/members-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const pendingMembers = [
  {
    id: "P001",
    name: "John Smith",
    username: "@johnsmith",
    role: "Member",
    submittedDate: "May 12, 2024",
    avatar: "JS",
  },
  {
    id: "P002",
    name: "Sarah Johnson",
    username: "@sarahj",
    role: "Trainers",
    submittedDate: "January 7, 2024",
    avatar: "SJ",
  },
  {
    id: "P003",
    name: "Mike Wilson",
    username: "@mikewilson",
    role: "Member",
    submittedDate: "March 9, 2024",
    avatar: "MW",
  },
  {
    id: "P004",
    name: "Emily Davis",
    username: "@emilyd",
    role: "Trainers",
    submittedDate: "November 15, 2023",
    avatar: "ED",
  },
  {
    id: "P005",
    name: "Chris Brown",
    username: "@chrisbrown",
    role: "Member",
    submittedDate: "February 20, 2024",
    avatar: "CB",
  },
  {
    id: "P006",
    name: "Jessica Martinez",
    username: "@jessicam",
    role: "Member",
    submittedDate: "April 3, 2024",
    avatar: "JM",
  },
  {
    id: "P007",
    name: "David Lee",
    username: "@davidlee",
    role: "Member",
    submittedDate: "June 18, 2024",
    avatar: "DL",
  },
]

export default function PendingMembersPage() {
  const [actionDialog, setActionDialog] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [memberToAction, setMemberToAction] = useState<{ id: string; name: string } | null>(null)

  const handleAction = (id: string, name: string, type: "approve" | "reject") => {
    setMemberToAction({ id, name })
    setActionType(type)
    setActionDialog(true)
  }

  const handleConfirmAction = () => {
    console.log(`${actionType}:`, memberToAction?.id)
    setActionDialog(false)
    setMemberToAction(null)
    setActionType(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <MembersHeader />

        {/* Table */}
        <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
                <th className="w-12 px-4 py-3">
                  <Checkbox className="border-[#3a3a3a]" />
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Submitted Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Approve</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Reject</th>
              </tr>
            </thead>
            <tbody>
              {pendingMembers.map((member, index) => (
                <tr
                  key={member.id}
                  className={`border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors ${
                    index % 2 === 0 ? "bg-[#151515]" : "bg-background"
                  }`}
                >
                  <td className="px-4 py-4">
                    <Checkbox className="border-[#3a3a3a]" />
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/members/${member.id}`}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder.svg?height=36&width=36" />
                        <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.username}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <Badge 
                      variant="outline"
                      className={
                        member.role === "Trainers"
                          ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                          : "border-green-500/50 bg-green-500/10 text-green-400"
                      }
                    >
                      {member.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{member.submittedDate}</td>
                  <td className="px-4 py-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-green-500 hover:bg-green-500/10"
                      onClick={() => handleAction(member.id, member.name, "approve")}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </td>
                  <td className="px-4 py-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/10"
                      onClick={() => handleAction(member.id, member.name, "reject")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Confirmation Dialog */}
        <Dialog open={actionDialog} onOpenChange={setActionDialog}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle>
                {actionType === "approve" ? "Approve Member" : "Reject Member"}
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to {actionType} <span className="font-semibold text-foreground">{memberToAction?.name}</span>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-2">
              <Button 
                variant="outline" 
                onClick={() => setActionDialog(false)} 
                className="flex-1 bg-transparent border-[#3a3a3a]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmAction} 
                className={`flex-1 ${
                  actionType === "approve"
                    ? " border-green-600 bg-green-600 text-white hover:bg-green-700"
                    : " border-red-600 bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {actionType === "approve" ? "Approve" : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
