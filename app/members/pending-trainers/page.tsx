"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { MembersHeader } from "@/components/members/members-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetTrainersQuery, useApproveTrainerMutation, useDeleteTrainerMutation, Trainer } from "@/store/api/trainersApi"
import toast from "react-hot-toast"
import { PhoneOtpVerify } from "@/components/phone-otp-verify"

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
  
  // API hooks
  const { data: trainersData, isLoading, isError } = useGetTrainersQuery()
  const [approveTrainer, { isLoading: isApproving }] = useApproveTrainerMutation()
  const [deleteTrainer, { isLoading: isDeleting }] = useDeleteTrainerMutation()
  
  // Filter for pending trainers only
  const pendingTrainers = (trainersData || []).filter((trainer: Trainer) => trainer.isPending)
  
  // Form state for editable fields
  const [formData, setFormData] = useState({
    trainerNo: "",
    name: "",
    phone: "",
    gender: "male",
    specialization: "",
  })

  const handleReview = (trainer: Trainer) => {
    setTrainerToReview(trainer)
    // Initialize form with trainer data
    setFormData({
      trainerNo: `TR${String(trainer.trainerId).padStart(3, '0')}`,
      name: trainer.name,
      phone: trainer.phone,
      gender: "male",
      specialization: trainer.specialization,
    })
    setReviewDialogOpen(true)
  }

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAccept = async () => {
    if (!trainerToReview) return
    
    try {
      await approveTrainer(trainerToReview.trainerId).unwrap()
      toast.success(`${trainerToReview.name} has been approved`)
      setReviewDialogOpen(false)
      setTrainerToReview(null)
    } catch {
      toast.error("Failed to approve trainer")
    }
  }

  const handleReject = async () => {
    if (!trainerToReview) return
    
    try {
      await deleteTrainer(trainerToReview.trainerId).unwrap()
      toast.success(`${trainerToReview.name} has been rejected`)
      setReviewDialogOpen(false)
      setTrainerToReview(null)
    } catch {
      toast.error("Failed to reject trainer")
    }
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

        {pendingTrainers.length === 0 ? (
          <div className="border border-[#2a2a2a] rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No pending trainers found</p>
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
                          <AvatarImage src="/placeholder.svg" />
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
          </div>
        )}

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-xl">Review Trainer Request</DialogTitle>
            </DialogHeader>

            {trainerToReview && (
              <div className="space-y-8 py-4">
                {/* Personal Information */}
                <Card className="p-8">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                    <p className="text-sm text-muted-foreground">
                      Review and edit trainer&apos;s information
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="trainerNo">Trainer No.</Label>
                      <Input
                        id="trainerNo"
                        value={formData.trainerNo}
                        onChange={(e) => updateFormField("trainerNo", e.target.value)}
                        className="bg-secondary border-[#3a3a3a]"
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateFormField("name", e.target.value)}
                        className="bg-secondary border-[#3a3a3a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile No.</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => updateFormField("phone", e.target.value)}
                        className="bg-secondary border-[#3a3a3a]"
                      />
                      <PhoneOtpVerify
                        phone={formData.phone}
                        type="trainer"
                        id={trainerToReview.trainerId}
                        phoneVerified={trainerToReview.phoneVerified}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => updateFormField("gender", value)}>
                        <SelectTrigger className="bg-secondary border-[#3a3a3a]">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => updateFormField("specialization", e.target.value)}
                        className="bg-secondary border-[#3a3a3a]"
                      />
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setReviewDialogOpen(false)}
                    className="bg-transparent border-[#3a3a3a]"
                    disabled={isApproving || isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                    disabled={isApproving || isDeleting}
                  >
                    {isDeleting ? "Rejecting..." : "Reject"}
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className="bg-green-600 text-white hover:bg-green-700"
                    disabled={isApproving || isDeleting}
                  >
                    {isApproving ? "Accepting..." : "Accept Trainer Request"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
