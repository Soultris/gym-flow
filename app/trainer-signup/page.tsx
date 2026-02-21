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
import { User, Lock, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { SplitScreenLayout } from "@/components/auth/split-screen-layout"
import Link from "next/link"
import { useState } from "react"
import { useSignupTrainerMutation } from "@/store/api/trainersApi"
import toast from "react-hot-toast"
import { AvatarUpload } from "@/components/ui/avatar-upload"

export default function TrainerSignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    // User Credentials
    email: "",
    password: "",
    confirmPassword: "",
    // Personal Information
    fullName: "",
    dob: "",
    age: "",
    mobileNo: "",
    gender: "",
    nic: "",
    address: "",
    specialization: "",
  })
  
  const [image, setImage] = useState<File | null>(null)

  const [signupTrainer, { isLoading }] = useSignupTrainerMutation()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.email || !formData.password || !formData.fullName || !formData.mobileNo || !formData.specialization) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      const submitData = new FormData()
      submitData.append('email', formData.email)
      submitData.append('password', formData.password)
      submitData.append('name', formData.fullName)
      submitData.append('phone', formData.mobileNo)
      submitData.append('specialization', formData.specialization)
      if (formData.dob) submitData.append('dob', formData.dob)
      if (formData.age) submitData.append('age', formData.age)
      if (formData.gender) submitData.append('gender', formData.gender)
      if (formData.nic) submitData.append('nic', formData.nic)
      if (formData.address) submitData.append('address', formData.address)
      const subdomain = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'dev' 
        : window.location.hostname.split('.')[0]
      submitData.append('subdomain', subdomain)
      
      if (image) {
        submitData.append('image', image)
      }

      await signupTrainer(submitData).unwrap()

      setSuccess(true)
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error 
        ? (error.data as { message?: string })?.message || "Failed to submit application"
        : "Failed to submit application"
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
          <h1 className="text-2xl font-bold mb-2">Application Submitted!</h1>
          <p className="text-muted-foreground mb-6">
            Your trainer application has been submitted successfully. Please wait for admin approval before you can sign in.
          </p>
          <Link href="/login">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Return to Login
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <SplitScreenLayout
      title="Become a Trainer"
      subtitle="Join our team of professional fitness trainers and help transform lives."
      image="https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=1974&auto=format&fit=crop"
    >
      <div className="flex justify-center mb-8">
        <AvatarUpload
          value={image}
          onChange={setImage}
          className="w-32 h-32"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: User Credentials */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold">User Credentials</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="trainer@example.com"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-border my-6" />

        {/* Section 2: Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => updateField("dob", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                placeholder="Auto-calculated"
                value={formData.age}
                className="bg-muted"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileNo">Mobile No. *</Label>
              <Input
                id="mobileNo"
                placeholder="+94 7X XXX XXXX"
                value={formData.mobileNo}
                onChange={(e) => updateField("mobileNo", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
                <SelectTrigger>
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
              <Label htmlFor="nic">NIC</Label>
              <Input
                id="nic"
                placeholder="National ID"
                value={formData.nic}
                onChange={(e) => updateField("nic", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization *</Label>
              <Input
                id="specialization"
                placeholder="e.g., Yoga, HIIT"
                value={formData.specialization}
                onChange={(e) => updateField("specialization", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Street address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting Application...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </SplitScreenLayout>
  )
}
