"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { MembersHeader } from "@/components/members/members-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Eye, Loader2, Search } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetTrainersQuery, useApproveTrainerMutation, useDeleteTrainerMutation, useUpdateTrainerMutation, Trainer } from "@/store/api/trainersApi"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"
import { PhoneOtpVerify } from "@/components/phone-otp-verify"
import { PaginationControls } from "@/components/ui/pagination-controls"

const PAGE_SIZE = 20

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function PendingTrainersPage() {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [trainerToReview, setTrainerToReview] = useState<Trainer | null>(null)
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])
  
  // API hooks — pending trainers only
  const { data: trainersData, isLoading, isError, refetch } = useGetTrainersQuery({
    pending: true,
    page,
    limit: PAGE_SIZE,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  })
  
  const pendingTrainers = trainersData?.trainers || []
  const pagination = trainersData?.pagination

  const handleReview = (trainer: Trainer) => {
    setTrainerToReview(trainer)
    setReviewDialogOpen(true)
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <MembersHeader />
          <div className="border border-[#2a2a2a] rounded-lg p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading pending trainers...</span>
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
            <p className="text-destructive">Failed to load pending trainers</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <MembersHeader />

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, phone or specialization..."
            className="pl-9 bg-transparent border-[#2a2a2a] focus-visible:ring-primary"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {pendingTrainers.length === 0 ? (
          <div className="border border-[#2a2a2a] rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              {debouncedSearch ? `No pending trainers matching "${debouncedSearch}"` : 'No pending trainers found'}
            </p>
          </div>
        ) : (
          <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
                  <th className="w-12 px-4 py-3">
                    <Checkbox className="border-[#3a3a3a]" />
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Specialization</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Phone</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingTrainers.map((trainer: Trainer, index: number) => (
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
                          <div className="text-sm text-muted-foreground">{trainer.phone}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{trainer.specialization}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{trainer.phone}</td>
                    <td className="px-4 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 border-primary text-primary hover:bg-primary/10"
                        onClick={() => handleReview(trainer)}
                      >
                        <Eye className="h-4 w-4" />
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>

            {pagination && (
              <PaginationControls
                page={page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={PAGE_SIZE}
                onPageChange={setPage}
                itemLabel="pending trainers"
              />
            )}
          </div>
        )}

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border p-0 gap-0">
             <div className="p-6 border-b border-border">
              <DialogHeader>
                <DialogTitle className="text-xl">Review Trainer Request</DialogTitle>
              </DialogHeader>
            </div>

            {trainerToReview && (
              <ReviewTrainerContent  
                trainer={trainerToReview} 
                onClose={() => setReviewDialogOpen(false)}
                refetch={refetch}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

function ReviewTrainerContent({ trainer, onClose, refetch }: { trainer: Trainer, onClose: () => void, refetch: () => void }) {
    const [approveTrainer, { isLoading: isApproving }] = useApproveTrainerMutation()
    const [deleteTrainer, { isLoading: isDeleting }] = useDeleteTrainerMutation()
    const [updateTrainer, { isLoading: isUpdating }] = useUpdateTrainerMutation()

    const [formData, setFormData] = useState({
        name: trainer.name,
        phone: trainer.phone,
        specialization: trainer.specialization,
        dob: trainer.dob ? new Date(trainer.dob).toISOString().split('T')[0] : "",
        age: trainer.age?.toString() || "",
        gender: trainer.gender || "",
        nic: trainer.nic || "",
        address: trainer.address || "",
    })

    const handleAccept = async () => {
        try {
            // First update the trainer details
            await updateTrainer({
                id: trainer.trainerId,
                data: formData
            }).unwrap()

            // Then approve
            await approveTrainer(trainer.trainerId).unwrap()
            
            toast.success(`${formData.name} has been approved`)
            onClose()
            refetch()
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to approve trainer"))
        }
    }

    const handleReject = async () => {
        try {
            await deleteTrainer(trainer.trainerId).unwrap()
            toast.success(`${trainer.name} has been rejected`)
            onClose()
            refetch()
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to reject trainer"))
        }
    }

    const isProcessing = isApproving || isDeleting || isUpdating

    return (
        <div className="p-6 space-y-8">
            {/* Avatar Section - Centered */}
            <div className="flex justify-center mb-8">
                <Avatar className="h-32 w-32 border-4 border-muted">
                    <AvatarImage src={trainer.imageUrl || "/placeholder.svg"} className="object-cover" />
                    <AvatarFallback className="text-4xl bg-secondary">{getInitials(trainer.name)}</AvatarFallback>
                </Avatar>
            </div>

            {/* Info Grid - Matching Member Review Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label>Trainer No.</Label>
                    <Input value={`TR${String(trainer.trainerId).padStart(3, '0')}`} disabled className="bg-muted" />
                 </div>
                 
                 <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                 </div>

                 <div className="space-y-2">
                    <Label htmlFor="phone">Mobile No.</Label>
                    <div className="flex gap-2">
                        <Input 
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                        <div className="shrink-0 pt-1">
                             <PhoneOtpVerify 
                                phone={formData.phone} 
                                type="trainer" 
                                id={trainer.trainerId} 
                                phoneVerified={trainer.phoneVerified} 
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input 
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input 
                        id="dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) => {
                            const newDob = e.target.value;
                            let newAge = formData.age;
                            if (newDob) {
                                const birthDate = new Date(newDob);
                                const today = new Date();
                                let calculatedAge = today.getFullYear() - birthDate.getFullYear();
                                const m = today.getMonth() - birthDate.getMonth();
                                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                    calculatedAge--;
                                }
                                newAge = calculatedAge.toString();
                            } else {
                                newAge = "";
                            }
                            setFormData({...formData, dob: newDob, age: newAge});
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                        id="age"
                        value={formData.age}
                        disabled
                        className="bg-muted"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nic">NIC</Label>
                    <Input 
                        id="nic"
                        value={formData.nic}
                        onChange={(e) => setFormData({...formData, nic: e.target.value})}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                </div>
            </div>

            <div className="flex gap-3 justify-end pt-6 border-t border-border mt-6">
                <Button variant="outline" onClick={onClose} disabled={isProcessing}>Cancel</Button>
                <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
                    {isDeleting ? "Rejecting..." : "Reject"}
                </Button>
                <Button onClick={handleAccept} disabled={isProcessing} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {isProcessing ? "Processing..." : "Approve Trainer Request"}
                </Button>
            </div>
        </div>
    )
}
