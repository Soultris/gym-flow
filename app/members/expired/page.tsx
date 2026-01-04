"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { MembersHeader } from "@/components/members/members-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { NewTransactionDialog } from "@/components/finance/new-transaction-dialog"
import { useState } from "react"

const expiredMembers = [
  {
    id: "M001",
    name: "John Smith",
    username: "@johnsmith",
    package: "Premium",
    enrolled: "May 12, 2024",
    expiredDate: "May 12, 2024",
    avatar: "JS",
  },
  {
    id: "M003",
    name: "Mike Wilson",
    username: "@mikewilson",
    package: "Standard",
    enrolled: "March 9, 2024",
    expiredDate: "March 9, 2024",
    avatar: "MW",
  },
  {
    id: "M004",
    name: "Emily Davis",
    username: "@emilyd",
    package: "Basic",
    enrolled: "November 15, 2023",
    expiredDate: "November 15, 2023",
    avatar: "ED",
  },
  {
    id: "M006",
    name: "Jessica Martinez",
    username: "@jessicam",
    package: "Premium",
    enrolled: "April 3, 2024",
    expiredDate: "April 3, 2024",
    avatar: "JM",
  },
  {
    id: "M007",
    name: "David Lee",
    username: "@davidlee",
    package: "Standard",
    enrolled: "June 18, 2024",
    expiredDate: "June 18, 2024",
    avatar: "DL",
  },
]

export default function ExpiredMembersPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<{ id: string; name: string } | null>(null)

  const handleDeleteClick = (id: string, name: string) => {
    setMemberToDelete({ id, name })
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    setDeleteDialogOpen(false)
    setMemberToDelete(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <MembersHeader />

        {/* Table */}
        <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
                <th className="w-12 px-4 py-3">
                  <Checkbox className="border-[#3a3a3a]" />
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Package</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Enrolled</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Expired Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Renew</th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {expiredMembers.map((member, index) => (
                <tr
                  key={member.id}
                  className={`border-b border-[#2a2a2a] transition-colors ${
                    index % 2 === 0 ? "bg-[#151515]" : "bg-background"
                  }`}
                >
                  <td className="px-4 py-4">
                    <Checkbox className="border-[#3a3a3a]" />
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/members/${member.id}`}
                      className="flex items-center gap-3 transition-opacity"
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
                  <td className="px-4 py-4 text-sm">Member</td>
                  <td className="px-4 py-4 text-sm">{member.package}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{member.enrolled}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{member.expiredDate}</td>
                  <td className="px-4 py-4">
                    <NewTransactionDialog 
                      memberId={member.id}
                      memberName={member.name}
                      triggerStyle="renew"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#2a2a2a] w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/members/${member.id}`} className="cursor-pointer">
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/members/${member.id}/edit`} className="cursor-pointer">
                            Edit Member
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/workouts/assign/${member.id}`} className="cursor-pointer">
                            Assign Workout
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/bulk-sms?memberId=${member.id}&memberName=${member.name}`} className="cursor-pointer">
                            Send Message
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive cursor-pointer"
                          onClick={() => handleDeleteClick(member.id, member.name)}
                        >
                          Delete Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle>Delete Member</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <span className="font-semibold text-foreground">{memberToDelete?.name}</span>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-2">
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialogOpen(false)} 
                className="flex-1 bg-transparent border-[#3a3a3a]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmDelete} 
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
