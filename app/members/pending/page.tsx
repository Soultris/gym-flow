"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { MembersHeader } from "@/components/members/members-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetMembersQuery, useApproveMemberMutation, useDeleteMemberMutation, Member } from "@/store/api/membersApi"
import { useGetPackagesQuery, Package } from "@/store/api/packagesApi"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"
import { PhoneOtpVerify } from "@/components/phone-otp-verify"

const MEMBERSHIP_FEE = 10
const TAX_RATE = 0.04 // 4% tax

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function PendingMembersPage() {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [memberToReview, setMemberToReview] = useState<Member | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [includeMembershipFee, setIncludeMembershipFee] = useState(true)
  
  // API hooks
  const { data: membersData, isLoading, isError } = useGetMembersQuery({ limit: 1000 })
  const { data: packages = [] } = useGetPackagesQuery()
  const [approveMember, { isLoading: isApproving }] = useApproveMemberMutation()
  const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation()
  
  // Filter for pending members only
  const pendingMembers = (membersData?.members || []).filter(
    (member: Member) => member.status === 'pending' || member.isPending
  )
  
  // Form state for editable fields
  const [formData, setFormData] = useState({
    memberNo: "",
    name: "",
    dob: "",
    age: "",
    phone: "",
    email: "",
    gender: "male",
    nic: "",
    height: "",
    weight: "",
    address: "",
    joiningDate: "",
  })

  const handleReview = (member: Member) => {
    setMemberToReview(member)
    setSelectedPlan(member.packageId?.toString() || (packages[0]?.packageId?.toString() || ""))
    setIncludeMembershipFee(true)
    // Initialize form with member data
    setFormData({
      memberNo: String(member.memberId).padStart(4, '0'),
      name: member.name,
      dob: member.dob ? new Date(member.dob).toISOString().split('T')[0] : "",
      age: String(member.age || ""),
      phone: member.phone,
      email: member.email,
      gender: member.gender,
      nic: member.nic,
      height: String(member.height || ""),
      weight: String(member.weight || ""),
      address: member.address,
      joiningDate: member.joiningDate ? new Date(member.joiningDate).toISOString().split('T')[0] : "",
    })
    setReviewDialogOpen(true)
  }

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAccept = async () => {
    if (!memberToReview) return
    
    try {
      const packageId = selectedPlan ? parseInt(selectedPlan, 10) : undefined
      await approveMember({ id: memberToReview.memberId, packageId }).unwrap()
      toast.success(`${memberToReview.name} has been approved`)
      setReviewDialogOpen(false)
      setMemberToReview(null)
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to approve member"))
    }
  }

  const handleReject = async () => {
    if (!memberToReview) return
    
    try {
      await deleteMember(memberToReview.memberId).unwrap()
      toast.success(`${memberToReview.name} has been rejected`)
      setReviewDialogOpen(false)
      setMemberToReview(null)
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to reject member"))
    }
  }

  const selectedPlanData = packages.find((p: Package) => p.packageId?.toString() === selectedPlan)
  const planPrice = selectedPlanData?.price || 0
  const membershipFee = includeMembershipFee ? MEMBERSHIP_FEE : 0
  const taxes = planPrice * TAX_RATE
  const total = planPrice + membershipFee + taxes

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <MembersHeader />
          <div className="border border-[#2a2a2a] rounded-lg p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading pending members...</span>
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
            <p className="text-destructive">Failed to load pending members</p>
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

        {pendingMembers.length === 0 ? (
          <div className="border border-[#2a2a2a] rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No pending members found</p>
          </div>
        ) : (
          <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
                  <th className="w-12 px-4 py-3">
                    <Checkbox className="border-[#3a3a3a]" />
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Submitted Date</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingMembers.map((member: Member, index: number) => (
                  <tr
                    key={member.memberId}
                    className={`border-b border-[#2a2a2a] transition-colors ${
                      index % 2 === 0 ? "bg-[#151515]" : "bg-background"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <Checkbox className="border-[#3a3a3a]" />
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/members/${member.memberId}`}
                        className="flex items-center gap-3 transition-opacity"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.imageUrl || "/placeholder.svg"} />
                          <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {formatDate(member.joiningDate)}
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 border-primary text-primary hover:bg-primary/10"
                        onClick={() => handleReview(member)}
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
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-xl">Review Membership Request</DialogTitle>
            </DialogHeader>

            {memberToReview && (
              <div className="space-y-8 py-4">
                {/* Personal Information */}
                <Card className="p-8">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                    <p className="text-sm text-muted-foreground">
                      Review and edit member&apos;s information
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="memberNo">Member No.</Label>
                      <Input
                        id="memberNo"
                        value={formData.memberNo}
                        onChange={(e) => updateFormField("memberNo", e.target.value)}
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
                        type="member"
                        id={memberToReview.memberId}
                        phoneVerified={memberToReview.phoneVerified}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
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
                        value={formData.nic}
                        onChange={(e) => updateFormField("nic", e.target.value)}
                        className="bg-secondary border-[#3a3a3a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => updateFormField("height", e.target.value)}
                        className="bg-secondary border-[#3a3a3a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => updateFormField("weight", e.target.value)}
                        className="bg-secondary border-[#3a3a3a]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>
                </Card>

                {/* Membership Plan Selection & Cost Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Membership Plan Selection */}
                  <div className="lg:col-span-3">
                    <Card className="p-6 h-full">
                      <div className="mb-4">
                        <h2 className="text-lg font-semibold">Membership Plan</h2>
                        <p className="text-sm text-muted-foreground">
                          Select or confirm the membership plan
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {packages.map((plan: Package) => (
                          <div
                            key={plan.packageId}
                            onClick={() => setSelectedPlan(plan.packageId.toString())}
                            className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
                              selectedPlan === plan.packageId.toString()
                                ? "border-primary bg-primary/10"
                                : "border-border"
                            }`}
                          >
                            {/* Selection indicator */}
                            <div className="absolute top-4 right-4">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  selectedPlan === plan.packageId.toString()
                                    ? "border-primary bg-primary"
                                    : "border-muted-foreground"
                                }`}
                              >
                                {selectedPlan === plan.packageId.toString() && (
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
                                ${plan.price}
                              </span>
                              <span className="text-muted-foreground">/{plan.durationType}</span>
                            </div>

                            {/* Features */}
                            <ul className="space-y-2">
                              {(Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features || '[]') as string[]).map((feature: string, index: number) => (
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
                    </Card>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="lg:col-span-1">
                    <Card className="p-6 h-full">
                      <div className="mb-4">
                        <h2 className="text-lg font-semibold">Cost Breakdown</h2>
                        <p className="text-sm text-muted-foreground">
                          Review the fees
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {selectedPlanData?.name || 'Selected'} Plan
                          </span>
                          <span>${planPrice.toFixed(2)}</span>
                        </div>
                        
                        {/* Membership Fee Toggle */}
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              id="membership-fee"
                              checked={includeMembershipFee}
                              onCheckedChange={setIncludeMembershipFee}
                            />
                            <Label htmlFor="membership-fee" className="text-sm text-muted-foreground cursor-pointer">
                              Membership Fee
                            </Label>
                          </div>
                          <span className={`text-sm ${!includeMembershipFee ? "line-through text-muted-foreground" : ""}`}>
                            ${MEMBERSHIP_FEE.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Taxes</span>
                          <span>${taxes.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-border pt-3 mt-3">
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

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
                    {isApproving ? "Accepting..." : "Accept Membership Request"}
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
