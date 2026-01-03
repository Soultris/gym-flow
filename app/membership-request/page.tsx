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
import { Check } from "lucide-react"

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

export default function MembershipRequestPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("standard")

  const selectedPlanData = membershipPlans.find((p) => p.id === selectedPlan)
  const planPrice = selectedPlanData?.price || 0
  const taxes = planPrice * TAX_RATE
  const total = planPrice + MEMBERSHIP_FEE + taxes

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Membership Request</h1>
          <p className="text-muted-foreground mt-1">
            Fill in your information to request a gym membership
          </p>
        </div>

        {/* Personal Information Card */}
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
              <Input id="memberNo" placeholder="0001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="John Smith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" placeholder="2003/05/27" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="23" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile No.</Label>
              <Input id="mobile" placeholder="078 236 2736" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="johnsmith@gmail.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select defaultValue="male">
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
              <Label htmlFor="nic">NIC</Label>
              <Input id="nic" placeholder="34376623742634" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" placeholder="180" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" placeholder="66" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="123 Main St, City, State 12345" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joiningDate">Joining Date</Label>
              <Input id="joiningDate" type="date" placeholder="2025/05/27" />
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
                  Choose the plan that best fits your needs
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
                        : "border-border hover:border-muted-foreground"
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
                  Check the amount to be paid
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {selectedPlanData?.name} Plan
                  </span>
                  <span>${planPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Membership Fee</span>
                  <span>${MEMBERSHIP_FEE.toFixed(2)}</span>
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

        {/* Submit Button */}
        <Button
          size="lg"
          className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Submit Membership Request
        </Button>
      </div>
    </div>
  )
}
