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
import { Dumbbell, ArrowLeft, User, Lock, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useSignupTrainerMutation } from "@/store/api/trainersApi"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function TrainerSignupPage() {
  const router = useRouter()
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
      await signupTrainer({
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        phone: formData.mobileNo,
        specialization: formData.specialization,
        gymId: 1,
      }).unwrap()

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-8 border-border bg-card/80 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/login" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
            <Dumbbell className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Become a Trainer
          </h1>
          <p className="text-muted-foreground mt-2">
            Join our team of professional fitness trainers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: User Credentials */}
          <Card className="p-6 border-border bg-secondary/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">User Credentials</h2>
                <p className="text-sm text-muted-foreground">Login credentials for your account</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="trainer@example.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="bg-background border-border"
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
                    className="bg-background border-border pr-10"
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
                    className="bg-background border-border pr-10"
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
          </Card>

          {/* Section 2: Personal Information */}
          <Card className="p-6 border-border bg-secondary/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <p className="text-sm text-muted-foreground">Tell us about yourself</p>
              </div>
            </div>

            {/* Row 1: Full Name, DOB, Age, Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="bg-background border-border"
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
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  placeholder="Auto-calculated"
                  value={formData.age}
                  className="bg-background border-border"
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
                  className="bg-background border-border"
                  required
                />
              </div>
            </div>

            {/* Row 2: Gender, NIC, Specialization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
                  <SelectTrigger className="bg-background border-border">
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
                  placeholder="National ID number"
                  value={formData.nic}
                  onChange={(e) => updateField("nic", e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Input
                  id="specialization"
                  placeholder="e.g., Yoga, Strength Training, HIIT"
                  value={formData.specialization}
                  onChange={(e) => updateField("specialization", e.target.value)}
                  className="bg-background border-border"
                  required
                />
              </div>
            </div>

            {/* Row 3: Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Street, City, State ZIP"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-2">
            <Link href="/login">
              <Button 
                type="button" 
                variant="outline" 
                className="bg-transparent border-border hover:bg-secondary"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 shadow-lg shadow-green-600/20 min-w-[180px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}
