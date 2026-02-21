"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { MembersHeader } from "@/components/members/members-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { useState } from "react"
import { useGetTrainersQuery, useDeleteTrainerMutation, Trainer } from "@/store/api/trainersApi"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function TrainersPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [trainerToDelete, setTrainerToDelete] = useState<{ id: number; name: string } | null>(null)

  // API hooks
  const { data: trainersData, isLoading, isError } = useGetTrainersQuery()
  const [deleteTrainer, { isLoading: isDeleting }] = useDeleteTrainerMutation()

  // Filter for approved trainers only (isPending = false)
  const trainers = (trainersData || []).filter((trainer: Trainer) => !trainer.isPending)

  const handleDeleteClick = (id: number, name: string) => {
    setTrainerToDelete({ id, name })
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!trainerToDelete) return
    
    try {
      await deleteTrainer(trainerToDelete.id).unwrap()
      toast.success(`${trainerToDelete.name} has been deleted`)
      setDeleteDialogOpen(false)
      setTrainerToDelete(null)
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete trainer"))
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <MembersHeader />
          <div className="border border-[#2a2a2a] rounded-lg p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading trainers...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <MembersHeader />
          <div className="border border-[#2a2a2a] rounded-lg p-8 text-center">
            <p className="text-destructive">Failed to load trainers</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (trainers.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <MembersHeader />
          <div className="border border-[#2a2a2a] rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No trainers found</p>
          </div>
        </div>
      </DashboardLayout>
    )
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
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Specialization</th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((trainer: Trainer, index: number) => (
                <tr
                  key={trainer.trainerId}
                  className={`border-b border-[#2a2a2a] transition-colors ${
                    index % 2 === 0 ? "bg-[#151515]" : "bg-background"
                  }`}
                >
                  <td className="px-4 py-4">
                    <Checkbox className="border-[#3a3a3a]" />
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/trainers/${trainer.trainerId}`}
                      className="flex items-center gap-3 transition-opacity"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={trainer.imageUrl || "/placeholder.svg"} className="object-cover" />
                        <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
                          {getInitials(trainer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{trainer.name}</div>
                        <div className="text-sm text-muted-foreground">{trainer.specialization}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-sm">{trainer.phone}</td>
                  <td className="px-4 py-4 text-sm">{trainer.specialization}</td>
                  <td className="px-4 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#2a2a2a] w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/trainers/${trainer.trainerId}`} className="cursor-pointer">
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/trainers/${trainer.trainerId}/edit`} className="cursor-pointer">
                            Edit Trainer
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/bulk-sms?trainerId=${trainer.trainerId}&trainerName=${trainer.name}`} className="cursor-pointer">
                            Send Message
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive cursor-pointer"
                          onClick={() => handleDeleteClick(trainer.trainerId, trainer.name)}
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
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmDelete} 
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
