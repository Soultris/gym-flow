"use client"

import { useState } from "react"
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
import { Card } from "@/components/ui/card"
import { CheckCircle2, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

import { SplitScreenLayout } from "@/components/auth/split-screen-layout"
import { AvatarUpload } from "@/components/ui/avatar-upload"
import { useRequestMembershipMutation } from "@/store/api/membersApi"

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
  
  const [image, setImage] = useState<File | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [requestMembership, { isLoading }] = useRequestMembershipMutation()

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Auto-calculate age when DOB changes
    if (field === "dob" && value) {
      const dbDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dbDate.getFullYear();
      const m = today.getMonth() - dbDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dbDate.getDate())) {
          age--;
      }
      setFormData(prev => ({ ...prev, age: age.toString() }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const submitData = new FormData()
      submitData.append('name', formData.fullName)
      submitData.append('email', formData.email)
      submitData.append('phone', formData.mobile)
      submitData.append('dob', formData.dob)
      submitData.append('gender', formData.gender)
      submitData.append('nic', formData.nic)
      submitData.append('address', formData.address)
      submitData.append('joiningDate', formData.joiningDate)
      
      if (formData.height) submitData.append('height', formData.height)
      if (formData.weight) submitData.append('weight', formData.weight)
      
      // Get subdomain
      const subdomain = window.location.hostname === 'localhost' 
        ? 'dev' 
        : window.location.hostname.split('.')[0]
        
      submitData.append('subdomain', subdomain)

      if (image) {
        submitData.append('image', image)
      }

      await requestMembership(submitData).unwrap()
      setSuccess(true)
      toast.success("Membership request submitted successfully!")
    } catch (error: unknown) {
      console.error(error)
      const errorMessage = error && typeof error === 'object' && 'data' in error 
        ? (error.data as { message?: string })?.message || "Failed to submit request"
        : "Failed to submit request"
      toast.error(errorMessage)
    }
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center border-border bg-card/80 backdrop-blur-sm">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Request Submitted!</h1>
          <p className="text-muted-foreground mb-6">
            Your membership request has been submitted successfully. Please wait for admin approval.
          </p>
          {/* No back button here as requested, maybe redirect to home or external site? */}
        </Card>
      </div>
    )
  }

  return (
    <SplitScreenLayout
      title="Membership Request"
      subtitle="Join Our Gym today! Fill in your details to get started."
      image="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop"
      backLink={null}
    >
      <div className="flex justify-center mb-8">
        <AvatarUpload
          value={image}
          onChange={setImage}
          className="w-32 h-32"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <p className="text-sm text-muted-foreground">
              Enter your basic information below
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="memberNo">Member No.</Label>
              <Input id="memberNo" placeholder="Auto-generated" disabled className="bg-muted" />
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
                className="bg-muted"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-2 md:col-span-2">
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
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting Request...
            </>
          ) : (
             "Submit Membership Request"
          )}
        </Button>
      </form>
    </SplitScreenLayout>
  )
}
