"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dumbbell, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function TrainerSignupPage() {
  const [formData, setFormData] = useState({
    trainerNo: "",
    fullName: "",
    dob: "",
    age: "",
    mobileNo: "",
    email: "",
    gender: "",
    nic: "",
    address: "",
    joiningDate: "",
    specialization: "",
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-calculate age when DOB changes
    if (field === "dob" && value) {
      const birthDate = new Date(value)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      setFormData(prev => ({ ...prev, age: age.toString() }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Trainer signup submitted:", formData)
    // TODO: Submit to backend
    alert("Trainer registration submitted successfully! Your application will be reviewed.")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/login" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Dumbbell className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Signup as Trainer</h1>
          <p className="text-muted-foreground text-sm mt-1">Fill in your information to apply as a trainer</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 mb-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <p className="text-sm text-muted-foreground">Enter your personal details</p>
            </div>

            {/* Row 1: Trainer No, Full Name, DOB, Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="trainerNo">Trainer No.</Label>
                <Input
                  id="trainerNo"
                  placeholder="Auto-generated"
                  value={formData.trainerNo}
                  onChange={(e) => updateField("trainerNo", e.target.value)}
                  className="bg-secondary border-[#3a3a3a]"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="bg-secondary border-[#3a3a3a]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => updateField("dob", e.target.value)}
                  className="bg-secondary border-[#3a3a3a]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  placeholder="Auto-calculated"
                  value={formData.age}
                  className="bg-secondary border-[#3a3a3a]"
                  disabled
                />
              </div>
            </div>

            {/* Row 2: Mobile No, Email, Gender, NIC */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="mobileNo">Mobile No. *</Label>
                <Input
                  id="mobileNo"
                  placeholder="+1 234 567 8901"
                  value={formData.mobileNo}
                  onChange={(e) => updateField("mobileNo", e.target.value)}
                  className="bg-secondary border-[#3a3a3a]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="bg-secondary border-[#3a3a3a]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
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
                <Label htmlFor="nic">NIC *</Label>
                <Input
                  id="nic"
                  placeholder="National ID number"
                  value={formData.nic}
                  onChange={(e) => updateField("nic", e.target.value)}
                  className="bg-secondary border-[#3a3a3a]"
                  required
                />
              </div>
            </div>

            {/* Row 3: Address, Joining Date, Specialization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="Street, City, State ZIP"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="bg-secondary border-[#3a3a3a]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => updateField("joiningDate", e.target.value)}
                  className="bg-secondary border-[#3a3a3a]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Input
                  id="specialization"
                  placeholder="e.g., Yoga & Pilates"
                  value={formData.specialization}
                  onChange={(e) => updateField("specialization", e.target.value)}
                  className="bg-secondary border-[#3a3a3a]"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Link href="/login">
              <Button type="button" variant="outline" className="bg-transparent border-[#3a3a3a]">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
              Submit Application
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
