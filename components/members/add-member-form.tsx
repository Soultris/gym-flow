"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function AddMemberForm() {
  return (
    <Card className="p-6">
      <form className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" placeholder="John" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" placeholder="Smith" required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="john@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" type="tel" placeholder="+1 234 567 8900" required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select id="gender" className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                <option>Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" placeholder="Street address, city, state, zip code" rows={3} />
          </div>
        </div>

        <div className="border-t border-border pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Membership Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="package">Package *</Label>
              <select
                id="package"
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
                required
              >
                <option>Select package</option>
                <option>Basic - LKR 30/month</option>
                <option>Standard - LKR 50/month</option>
                <option>Premium - LKR 80/month</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <select
                id="duration"
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
                required
              >
                <option>Select duration</option>
                <option>1 Month</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>12 Months</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input id="startDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount Paid</Label>
              <Input id="amount" type="number" placeholder="0.00" />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Emergency Contact</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">Contact Name</Label>
              <Input id="emergencyName" placeholder="Emergency contact name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Contact Phone</Label>
              <Input id="emergencyPhone" type="tel" placeholder="+1 234 567 8900" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Add Member
          </Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
