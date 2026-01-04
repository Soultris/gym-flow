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
import { useState } from "react"

const trainers = [
  {
    id: "T001",
    name: "John Smith",
    username: "@johnsmith",
    phone: "+94 077 123 4567",
    status: "Active",
    enrolled: "May 12, 2024",
    avatar: "JS",
  },
  {
    id: "T002",
    name: "Sarah Johnson",
    username: "@sarahj",
    phone: "+94 077 123 4567",
    status: "Active",
    enrolled: "January 7, 2024",
    avatar: "SJ",
  },
  {
    id: "T003",
    name: "Mike Wilson",
    username: "@mikewilson",
    phone: "+94 077 123 4567",
    status: "Active",
    enrolled: "March 9, 2024",
    avatar: "MW",
  },
  {
    id: "T004",
    name: "Emily Davis",
    username: "@emilyd",
    phone: "+94 077 123 4567",
    status: "Inactive",
    enrolled: "November 15, 2023",
    avatar: "ED",
  },
  {
    id: "T005",
    name: "Chris Brown",
    username: "@chrisbrown",
    phone: "+94 077 123 4567",
    status: "Active",
    enrolled: "February 20, 2024",
    avatar: "CB",
  },
  {
    id: "T006",
    name: "Jessica Martinez",
    username: "@jessicam",
    phone: "+94 077 123 4567",
    status: "Active",
    enrolled: "April 3, 2024",
    avatar: "JM",
  },
  {
    id: "T007",
    name: "David Lee",
    username: "@davidlee",
    phone: "+94 077 123 4567",
    status: "Active",
    enrolled: "June 18, 2024",
    avatar: "DL",
  },
]

export default function TrainersPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [trainerToDelete, setTrainerToDelete] = useState<{ id: string; name: string } | null>(null)

  const handleDeleteClick = (id: string, name: string) => {
    setTrainerToDelete({ id, name })
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    setDeleteDialogOpen(false)
    setTrainerToDelete(null)
  }

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "border-accent text-accent bg-accent/10"
      : "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <MembersHeader />

        {/* Table */}
        <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
                <th className="w-12 px-4 py-3">
                  <Checkbox className="border-[#3a3a3a]" />
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Phone Number</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Enrolled</th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((trainer, index) => (
                <tr
                  key={trainer.id}
                  className={`border-b border-[#2a2a2a] transition-colors ${
                    index % 2 === 0 ? "bg-[#151515]" : "bg-background"
                  }`}
                >
                  <td className="px-4 py-4">
                    <Checkbox className="border-[#3a3a3a]" />
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/trainers/${trainer.id}`}
                      className="flex items-center gap-3 transition-opacity"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder.svg?height=36&width=36" />
                        <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
                          {trainer.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{trainer.name}</div>
                        <div className="text-sm text-muted-foreground">{trainer.username}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-sm">{trainer.phone}</td>
                  <td className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className={getStatusColor(trainer.status)}
                    >
                      {trainer.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{trainer.enrolled}</td>
                  <td className="px-4 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#2a2a2a] w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/trainers/${trainer.id}`} className="cursor-pointer">
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/members/${trainer.id}/edit`} className="cursor-pointer">
                            Edit Trainer
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/bulk-sms?memberId=${trainer.id}&memberName=${trainer.name}`} className="cursor-pointer">
                            Send Message
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive cursor-pointer"
                          onClick={() => handleDeleteClick(trainer.id, trainer.name)}
                        >
                          Delete Trainer
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
              <DialogTitle>Delete Trainer</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <span className="font-semibold text-foreground">{trainerToDelete?.name}</span>? This action cannot be undone.
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
