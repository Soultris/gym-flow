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
import { Check, Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface MembershipPlan {
  id: string
  name: string
  price: number
  popular?: boolean
  features: string[]
}

const membershipPlans: MembershipPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    features: [
      "Access to gym floor",
      "Locker room access",
      "2 guest passes/month",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 49,
    popular: true,
    features: [
      "Access to gym floor",
      "Locker room access",
      "5 guest passes/month",
      "Group classes",
      "Free parking",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 79,
    features: [
      "Access to gym floor",
      "Locker room access",
      "Unlimited guest passes",
      "All classes",
      "Personal training (2x/month)",
      "Spa access",
      "Priority booking",
    ],
  },
]

const MEMBERSHIP_FEE = 10
const TAX_RATE = 0.04 // 4% tax

interface PendingMember {
  id: string
  name: string
  username: string
  email: string
  phone: string
  submittedDate: string
  avatar: string
  memberNo: string
  dob: string
  age: number
  gender: string
  nic: string
  height: number
  weight: number
  address: string
  joiningDate: string
  selectedPlan: string
}

const pendingMembers: PendingMember[] = [
  {
    id: "P001",
    name: "John Smith",
    username: "@johnsmith",
    email: "john.smith@email.com",
    phone: "+1 234 567 8900",
    submittedDate: "May 12, 2024",
    avatar: "JS",
    memberNo: "0001",
    dob: "1995-05-27",
    age: 29,
    gender: "Male",
    nic: "34376623742634",
    height: 180,
    weight: 66,
    address: "123 Main St, City, State 12345",
    joiningDate: "2024-05-12",
    selectedPlan: "standard",
  },
  {
    id: "P003",
    name: "Mike Wilson",
    username: "@mikewilson",
    email: "mike.w@email.com",
    phone: "+1 234 567 8902",
    submittedDate: "March 9, 2024",
    avatar: "MW",
    memberNo: "0003",
    dob: "1998-08-20",
    age: 26,
    gender: "Male",
    nic: "56789012345678",
    height: 175,
    weight: 72,
    address: "789 Pine Rd, City, State 11223",
    joiningDate: "2024-03-09",
    selectedPlan: "basic",
  },
  {
    id: "P005",
    name: "Chris Brown",
    username: "@chrisbrown",
    email: "chris.b@email.com",
    phone: "+1 234 567 8904",
    submittedDate: "February 20, 2024",
    avatar: "CB",
    memberNo: "0005",
    dob: "1996-07-05",
    age: 28,
    gender: "Male",
    nic: "78901234567890",
    height: 182,
    weight: 78,
    address: "654 Maple Dr, City, State 77889",
    joiningDate: "2024-02-20",
    selectedPlan: "premium",
  },
  {
    id: "P006",
    name: "Jessica Martinez",
    username: "@jessicam",
    email: "jessica.m@email.com",
    phone: "+1 234 567 8905",
    submittedDate: "April 3, 2024",
    avatar: "JM",
    memberNo: "0006",
    dob: "1994-02-28",
    age: 30,
    gender: "Female",
    nic: "89012345678901",
    height: 162,
    weight: 54,
    address: "987 Cedar Ln, City, State 99001",
    joiningDate: "2024-04-03",
    selectedPlan: "standard",
  },
  {
    id: "P007",
    name: "David Lee",
    username: "@davidlee",
    email: "david.l@email.com",
    phone: "+1 234 567 8906",
    submittedDate: "June 18, 2024",
    avatar: "DL",
    memberNo: "0007",
    dob: "1999-12-15",
    age: 25,
    gender: "Male",
    nic: "90123456789012",
    height: 178,
    weight: 70,
    address: "741 Birch Way, City, State 22334",
    joiningDate: "2024-06-18",
    selectedPlan: "basic",
  },
]

export default function PendingMembersPage() {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [memberToReview, setMemberToReview] = useState<PendingMember | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string>("standard")
  const [includeMembershipFee, setIncludeMembershipFee] = useState(true)
  
  // Form state for editable fields
  const [formData, setFormData] = useState({
    memberNo: "",
    name: "",
    dob: "",
    age: "",
    phone: "",
    email: "",
    gender: "Male",
    nic: "",
    height: "",
    weight: "",
    address: "",
    joiningDate: "",
  })

  const handleReview = (member: PendingMember) => {
    setMemberToReview(member)
    setSelectedPlan(member.selectedPlan)
    setIncludeMembershipFee(true)
    // Initialize form with member data
    setFormData({
      memberNo: member.memberNo,
      name: member.name,
      dob: member.dob,
      age: String(member.age),
      phone: member.phone,
      email: member.email,
      gender: member.gender,
      nic: member.nic,
      height: String(member.height),
      weight: String(member.weight),
      address: member.address,
      joiningDate: member.joiningDate,
    })
    setReviewDialogOpen(true)
  }

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAccept = () => {
    console.log("Accepting member:", memberToReview?.id, {
      plan: selectedPlan,
      includeMembershipFee,
    })
    setReviewDialogOpen(false)
    setMemberToReview(null)
  }

  const handleReject = () => {
    console.log("Rejecting member:", memberToReview?.id)
    setReviewDialogOpen(false)
    setMemberToReview(null)
  }

  const selectedPlanData = membershipPlans.find((p) => p.id === selectedPlan)
  const planPrice = selectedPlanData?.price || 0
  const membershipFee = includeMembershipFee ? MEMBERSHIP_FEE : 0
  const taxes = planPrice * TAX_RATE
  const total = planPrice + membershipFee + taxes

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
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Submitted Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingMembers.map((member, index) => (
                <tr
                  key={member.id}
                  className={`border-b border-[#2a2a2a] transition-colors ${
                    index % 2 === 0 ? "bg-[#151515]" : "bg-background"
                  }`}
                >
                  <td className="px-4 py-4">
                    <Checkbox className="border-[#3a3a3a]" />
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/members/${member.id}`}
                      className="flex items-center gap-3 transition-opacity"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder.svg?height=36&width=36" />
                        <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.username}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{member.submittedDate}</td>
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
                        {membershipPlans.map((plan) => (
                          <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
                              selectedPlan === plan.id
                                ? "border-primary bg-primary/10"
                                : "border-border"
                            }`}
                          >
                            {/* Selection indicator */}
                            <div className="absolute top-4 right-4">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  selectedPlan === plan.id
                                    ? "border-primary bg-primary"
                                    : "border-muted-foreground"
                                }`}
                              >
                                {selectedPlan === plan.id && (
                                  <Check className="w-3 h-3 text-primary-foreground" />
                                )}
                              </div>
                            </div>

                            {/* Plan header */}
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{plan.name}</h3>
                              {plan.popular && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded">
                                  Popular
                                </span>
                              )}
                            </div>

                            {/* Price */}
                            <div className="mb-4">
                              <span className="text-2xl font-bold text-primary">
                                ${plan.price}
                              </span>
                              <span className="text-muted-foreground">/month</span>
                            </div>

                            {/* Features */}
                            <ul className="space-y-2">
                              {plan.features.map((feature, index) => (
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
                            {selectedPlanData?.name} Plan
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
                    Accept Membership Request
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
