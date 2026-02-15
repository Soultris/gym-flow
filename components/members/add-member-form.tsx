"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Loader2 } from "lucide-react"
import { useCreateMemberMutation } from "@/store/api/membersApi"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"
import { AvatarUpload } from "@/components/ui/avatar-upload"

export function AddMemberForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    age: "",
    mobile: "",
    email: "",
    gender: "male" as "male" | "female" | "other",
    nic: "",
    height: "",
    weight: "",
    address: "",
    joiningDate: new Date().toISOString().split("T")[0],
  })

  const [image, setImage] = useState<File | null>(null)
  
  const [createMember, { isLoading: isCreating }] = useCreateMemberMutation()

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
      
      if (image) {
        submitData.append('image', image)
      }

      await createMember(submitData).unwrap()
      
      toast.success("Member added successfully!")
      router.push("/members")
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add member"))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <div className="flex justify-center mb-8">
          <AvatarUpload
            value={image}
            onChange={setImage}
            className="w-32 h-32"
          />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="space-y-2 sm:col-span-2 lg:col-span-3">
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

        <div className="flex items-center gap-3 mt-8">
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Member...
              </>
            ) : (
              "Add Member"
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="bg-transparent"
            onClick={() => router.push("/members")}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </form>
  )
}
