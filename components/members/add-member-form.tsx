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
import { Check, Loader2 } from "lucide-react"
import { useCreateMemberMutation } from "@/store/api/membersApi"
import { useGetPackagesQuery, Package } from "@/store/api/packagesApi"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"
import { ImageUpload } from "@/components/ui/image-upload"

const MEMBERSHIP_FEE = 10
const TAX_RATE = 0.04 // 4% tax

export function AddMemberForm() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
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
  
  const { data: packages, isLoading: packagesLoading } = useGetPackagesQuery()
  const [createMember, { isLoading: isCreating }] = useCreateMemberMutation()

  const selectedPlanData = packages?.find((p: Package) => p.packageId === selectedPlan)
  const planPrice = selectedPlanData?.price || 0
  const taxes = planPrice * TAX_RATE
  const total = planPrice + MEMBERSHIP_FEE + taxes

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
      submitData.append('height', formData.height)
      submitData.append('weight', formData.weight)
      submitData.append('address', formData.address)
      submitData.append('joiningDate', formData.joiningDate)
      
      if (selectedPlan) {
        submitData.append('packageId', selectedPlan.toString())
      }
      
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
      {/* Personal Information Card */}
      <Card className="p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <p className="text-sm text-muted-foreground">
            Enter member&apos;s basic information below
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <ImageUpload
            value={image}
            onChange={setImage}
            onRemove={() => setImage(null)}
            className="w-full max-w-xs "
            previewClassName="aspect-square object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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

      {/* Membership Plan & Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Membership Plan Selection */}
        <div className="lg:col-span-3">
          <Card className="p-6 h-full">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Select Membership Plan</h2>
              <p className="text-sm text-muted-foreground">
                Choose the plan that best fits the member&apos;s needs
              </p>
            </div>

            {packagesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packages?.map((plan: Package) => (
                  <div
                    key={plan.packageId}
                    onClick={() => setSelectedPlan(plan.packageId)}
                    className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPlan === plan.packageId
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    {/* Selection indicator */}
                    <div className="absolute top-4 right-4">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPlan === plan.packageId
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {selectedPlan === plan.packageId && (
                          <Check className="w-3 h-3 text-primary-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Plan header */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{plan.name}</h3>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-primary">
                        LKR {plan.price}
                      </span>
                      <span className="text-muted-foreground">/{plan.durationType}</span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2">
                      {plan.features.map((feature: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Cost Breakdown */}
        <div className="lg:col-span-1">
          <Card className="p-6 h-full">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Cost Breakdown</h2>
              <p className="text-sm text-muted-foreground">
                Check the amount to be paid
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {selectedPlanData?.name || "No"} Plan
                </span>
                <span>LKR {planPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Membership Fee</span>
                <span>LKR {MEMBERSHIP_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxes</span>
                <span>LKR {taxes.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>LKR {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
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
    </form>
  )
}
