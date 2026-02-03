"use client"

import { useState } from "react"
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

export default function MembershipRequestPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    age: "",
    mobile: "",
    email: "",
    gender: "male",
    nic: "",
    height: "",
    weight: "",
    address: "",
    joiningDate: new Date().toISOString().split("T")[0],
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Auto-calculate age when DOB changes
    if (field === "dob" && value) {
      const [year, month, day] = value.split('-').map(Number)
      const birthDate = new Date(year, month - 1, day)
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
    // Handle form submission
  }
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Membership Request</h1>
          <p className="text-muted-foreground mt-1">
            Fill in your information to request a gym membership
          </p>
        </div>

        {/* Personal Information Card */}
        <form onSubmit={handleSubmit}>
          <Card className="p-6 mb-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <p className="text-sm text-muted-foreground">
                Enter your basic information below
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="memberNo">Member No.</Label>
                <Input id="memberNo" placeholder="Auto-generated" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input 
                  id="fullName" 
                  placeholder="John Smith" 
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
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
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="Auto-calculated" 
                  value={formData.age}
                  disabled 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile No. *</Label>
                <Input 
                  id="mobile" 
                  placeholder="078 236 2736" 
                  value={formData.mobile}
                  onChange={(e) => updateField("mobile", e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="johnsmith@gmail.com" 
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nic">NIC *</Label>
                <Input 
                  id="nic" 
                  placeholder="National ID" 
                  value={formData.nic}
                  onChange={(e) => updateField("nic", e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input 
                  id="height" 
                  type="number" 
                  placeholder="180" 
                  value={formData.height}
                  onChange={(e) => updateField("height", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input 
                  id="weight" 
                  type="number" 
                  placeholder="66" 
                  value={formData.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input 
                  id="address" 
                  placeholder="123 Main St, City, State 12345" 
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date *</Label>
                <Input 
                  id="joiningDate" 
                  type="date" 
                  value={formData.joiningDate}
                  onChange={(e) => updateField("joiningDate", e.target.value)}
                  required 
                />
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Submit Membership Request
          </Button>
        </form>
      </div>
    </div>
  )
}
