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
import { Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PendingTrainer {
  id: string
  name: string
  username: string
  email: string
  phone: string
  submittedDate: string
  avatar: string
  trainerNo: string
  dob: string
  age: number
  gender: string
  nic: string
  address: string
  joiningDate: string
  specialization: string
}

const pendingTrainers: PendingTrainer[] = [
  {
    id: "T001",
    name: "Sarah Johnson",
    username: "@sarahj",
    email: "sarah.j@email.com",
    phone: "+1 234 567 8901",
    submittedDate: "January 7, 2024",
    avatar: "SJ",
    trainerNo: "TR001",
    dob: "1992-03-15",
    age: 32,
    gender: "Female",
    nic: "45678901234567",
    address: "456 Oak Ave, City, State 67890",
    joiningDate: "2024-01-07",
    specialization: "Yoga & Pilates",
  },
  {
    id: "T002",
    name: "Emily Davis",
    username: "@emilyd",
    email: "emily.d@email.com",
    phone: "+1 234 567 8903",
    submittedDate: "November 15, 2023",
    avatar: "ED",
    trainerNo: "TR002",
    dob: "1990-11-10",
    age: 34,
    gender: "Female",
    nic: "67890123456789",
    address: "321 Elm St, City, State 44556",
    joiningDate: "2023-11-15",
    specialization: "Strength Training",
  },
  {
    id: "T003",
    name: "Marcus Thompson",
    username: "@marcust",
    email: "marcus.t@email.com",
    phone: "+1 234 567 8907",
    submittedDate: "December 20, 2023",
    avatar: "MT",
    trainerNo: "TR003",
    dob: "1988-06-22",
    age: 36,
    gender: "Male",
    nic: "12345678901234",
    address: "567 Pine St, City, State 33445",
    joiningDate: "2023-12-20",
    specialization: "CrossFit",
  },
  {
    id: "T004",
    name: "Lisa Chen",
    username: "@lisac",
    email: "lisa.c@email.com",
    phone: "+1 234 567 8908",
    submittedDate: "February 5, 2024",
    avatar: "LC",
    trainerNo: "TR004",
    dob: "1993-09-18",
    age: 31,
    gender: "Female",
    nic: "23456789012345",
    address: "890 Maple Dr, City, State 55667",
    joiningDate: "2024-02-05",
    specialization: "Cardio & HIIT",
  },
]

export default function PendingTrainersPage() {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [trainerToReview, setTrainerToReview] = useState<PendingTrainer | null>(null)
  
  // Form state for editable fields
  const [formData, setFormData] = useState({
    trainerNo: "",
    name: "",
    dob: "",
    age: "",
    phone: "",
    email: "",
    gender: "Male",
    nic: "",
    address: "",
    joiningDate: "",
    specialization: "",
  })

  const handleReview = (trainer: PendingTrainer) => {
    setTrainerToReview(trainer)
    // Initialize form with trainer data
    setFormData({
      trainerNo: trainer.trainerNo,
      name: trainer.name,
      dob: trainer.dob,
      age: String(trainer.age),
      phone: trainer.phone,
      email: trainer.email,
      gender: trainer.gender,
      nic: trainer.nic,
      address: trainer.address,
      joiningDate: trainer.joiningDate,
      specialization: trainer.specialization,
    })
    setReviewDialogOpen(true)
  }

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAccept = () => {
    console.log("Accepting trainer:", trainerToReview?.id, formData)
    setReviewDialogOpen(false)
    setTrainerToReview(null)
  }

  const handleReject = () => {
    console.log("Rejecting trainer:", trainerToReview?.id)
    setReviewDialogOpen(false)
    setTrainerToReview(null)
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
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Specialization</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Submitted Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingTrainers.map((trainer, index) => (
                <tr
                  key={trainer.id}
                  className={`border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors ${
                    index % 2 === 0 ? "bg-[#151515]" : "bg-background"
                  }`}
                >
                  <td className="px-4 py-4">
                    <Checkbox className="border-[#3a3a3a]" />
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/members/${trainer.id}`}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
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
                  <td className="px-4 py-4 text-sm text-muted-foreground">{trainer.specialization}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{trainer.submittedDate}</td>
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
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) => updateFormField("dob", e.target.value)}
                        className="bg-secondary border-[#3a3a3a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => updateFormField("age", e.target.value)}
                        className="bg-secondary border-[#3a3a3a]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile No.</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => updateFormField("phone", e.target.value)}
                        className="bg-secondary border-[#3a3a3a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormField("email", e.target.value)}
                        className="bg-secondary border-[#3a3a3a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => updateFormField("gender", value)}>
                        <SelectTrigger className="bg-secondary border-[#3a3a3a]">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nic">NIC</Label>
                      <Input
                        id="nic"
                        value={formData.nic}
                        onChange={(e) => updateFormField("nic", e.target.value)}
                        className="bg-secondary border-[#3a3a3a]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => updateFormField("address", e.target.value)}
                        className="bg-secondary border-[#3a3a3a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joiningDate">Joining Date</Label>
                      <Input
                        id="joiningDate"
                        type="date"
                        value={formData.joiningDate}
                        onChange={(e) => updateFormField("joiningDate", e.target.value)}
                        className="bg-secondary border-[#3a3a3a]"
                      />
                    </div>
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
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Accept Trainer Request
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
