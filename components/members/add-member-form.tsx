"use client"

import { useState, useEffect } from "react"
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
import { Loader2, CheckCircle2, Check } from "lucide-react"
import { useCreateMemberMutation } from "@/store/api/membersApi"
import { useGetPackagesQuery, Package } from "@/store/api/packagesApi"
import { useGetGymProfileQuery } from "@/store/api/gymApi"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"
import { AvatarUpload } from "@/components/ui/avatar-upload"
import { PhoneOtpVerify } from "@/components/phone-otp-verify"
import { Switch } from "@/components/ui/switch"

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
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    medicalIssues: "",
  })

  const [image, setImage] = useState<File | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [membershipFee, setMembershipFee] = useState<string>("0")
  const [includeMembershipFee, setIncludeMembershipFee] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash")
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  
  const [createMember, { isLoading: isCreating }] = useCreateMemberMutation()
  const { data: packages = [] } = useGetPackagesQuery()
  const { data: gym } = useGetGymProfileQuery()

  // Initialize membership fee from gym settings
  useEffect(() => {
    if (gym?.membershipFee) {
        setMembershipFee(String(gym.membershipFee))
    }
  }, [gym])

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
    
    // Reset phone verification if number changes
    if (field === "mobile") {
        setIsPhoneVerified(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    if (formData.emergencyContactPhone && !/^\d{10}$/.test(formData.emergencyContactPhone)) {
      toast.error("Emergency contact phone must be exactly 10 digits");
      return;
    }
    
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

      submitData.append('emergencyContactName', formData.emergencyContactName)
      submitData.append('emergencyContactRelation', formData.emergencyContactRelation)
      submitData.append('emergencyContactPhone', formData.emergencyContactPhone)
      submitData.append('medicalIssues', formData.medicalIssues)

      // Add new fields
      if (selectedPlan) {
        submitData.append('packageId', selectedPlan)
      }
      
      const fee = includeMembershipFee ? parseFloat(membershipFee || "0") : 0
      submitData.append('membershipFee', fee.toString())
      submitData.append('paymentMethod', paymentMethod)
      submitData.append('phoneVerified', isPhoneVerified.toString())

      await createMember(submitData).unwrap()
      
      toast.success("Member added successfully!")
      router.push("/members")
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add member"))
    }
  }

  const selectedPlanData = packages.find((p: Package) => p.packageId?.toString() === selectedPlan)
  const planPrice = selectedPlanData?.price || 0
  const total = planPrice + (includeMembershipFee ? parseFloat(membershipFee || "0") : 0)

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

        <div className="space-y-8">
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
              <div className="flex gap-2">
                  <Input 
                    id="mobile" 
                    placeholder="078 236 2736" 
                    value={formData.mobile}
                    onChange={(e) => updateField("mobile", e.target.value)}
                    required
                    pattern="^\d{10}$"
                    title="Phone number must be exactly 10 digits"
                  />
                  <div className="shrink-0 pt-1">
                       <PhoneOtpVerify 
                          phone={formData.mobile} 
                          type="member" 
                          id={0} // 0 indicates new member
                          phoneVerified={isPhoneVerified} 
                          onVerificationComplete={() => setIsPhoneVerified(true)}
                      />
                  </div>
              </div>
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

          {/* Emergency Contact & Medical Info */}
          <div className="pt-6 border-t border-border">
            <div className="mb-4">
              <h3 className="font-semibold text-lg">Emergency Contact & Medical Details</h3>
              <p className="text-sm text-muted-foreground">Optional contact and health information</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Contact Person Name</Label>
                <Input 
                  id="emergencyContactName" 
                  placeholder="Jane Doe" 
                  value={formData.emergencyContactName}
                  onChange={(e) => updateField("emergencyContactName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation">Relation</Label>
                <Input 
                  id="emergencyContactRelation" 
                  placeholder="Mother, Spouse, Subling etc." 
                  value={formData.emergencyContactRelation}
                  onChange={(e) => updateField("emergencyContactRelation", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Contact Phone No.</Label>
                <Input 
                  id="emergencyContactPhone" 
                  placeholder="071 234 5678" 
                  value={formData.emergencyContactPhone}
                  onChange={(e) => updateField("emergencyContactPhone", e.target.value)}
                  pattern="^\d{10}$"
                  title="Phone number must be exactly 10 digits"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="medicalIssues">Medical Issues / Conditions</Label>
                <Input 
                  id="medicalIssues" 
                  placeholder="Any allergies, previous injuries, operations etc." 
                  value={formData.medicalIssues}
                  onChange={(e) => updateField("medicalIssues", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-border">
                {/* Plan Selection */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-semibold text-lg">Membership Plan</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {packages.map((plan: Package) => (
                          <div
                            key={plan.packageId}
                            onClick={() => setSelectedPlan(plan.packageId.toString())}
                            className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
                              selectedPlan === plan.packageId.toString()
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold">{plan.name}</h4>
                                {selectedPlan === plan.packageId.toString() && <CheckCircle2 className="w-5 h-5 text-primary" />}
                            </div>
                            <div className="text-2xl font-bold text-primary mb-2">
                                {plan.price.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}
                                <span className="text-sm text-muted-foreground font-normal">/{plan.durationType}</span>
                            </div>
                           <ul className="space-y-1">
                              {(Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features || '[]') as string[]).slice(0, 3).map((feature: string, index: number) => (
                                <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Check className="w-3 h-3 text-primary" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Payment Summary</h3>
                    <Card className="p-5 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Plan Fee</span>
                            <span className="font-medium">{planPrice.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}</span>
                        </div>
                        
                        <div className="flex items-center justify-between gap-2">
                             <div className="flex items-center gap-2">
                                <Switch checked={includeMembershipFee} onCheckedChange={setIncludeMembershipFee} id="fee-switch" />
                                <Label htmlFor="fee-switch" className="text-sm text-muted-foreground font-normal">Membership Fee</Label>
                             </div>
                             {includeMembershipFee ? (
                                 <Input 
                                    type="number" 
                                    value={membershipFee} 
                                    onChange={(e) => setMembershipFee(e.target.value)}
                                    className="w-24 h-8 text-right font-medium"
                                 />
                             ) : (
                                 <span className="text-sm font-medium text-muted-foreground line-through">
                                     {parseFloat(membershipFee).toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}
                                 </span>
                             )}
                        </div>

                        <div className="pt-3 mt-3 border-t border-border flex justify-between items-center">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-bold text-primary">{total.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}</span>
                        </div>

                        <div className="pt-2">
                            <Label className="text-xs mb-1.5 block text-muted-foreground">Payment Method</Label>
                            <Select value={paymentMethod} onValueChange={(v: "cash" | "card") => setPaymentMethod(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="card">Card</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>
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
