"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useState } from "react"

type DialogType = "edit-profile" | "update-info" | null

export default function AdminProfilePage() {
  const [dialogType, setDialogType] = useState<DialogType>(null)
  const [formData, setFormData] = useState({
    name: "Admin User",
    email: "admin@gym.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Gym management system administrator responsible for overall system operations and user management.",
  })

  const adminData = {
    name: "Admin User",
    email: "admin@gym.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "January 2023",
    role: "System Administrator",
    avatar: "/placeholder.svg?height=200&width=200",
    bio: "Gym management system administrator responsible for overall system operations and user management.",
    stats: {
      totalMembers: 892,
      activeTrainers: 15,
      packagesManaged: 4,
      totalTransactions: 1250,
    },
  }

  const closeDialog = () => {
    setDialogType(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Admin Profile</h1>
          <p className="text-muted-foreground mt-1">View and manage your administrator profile</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={adminData.avatar} />
                  <AvatarFallback className="text-2xl bg-[#E8FF00] text-black">AU</AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-2xl font-bold mb-1">{adminData.name}</h2>
              <Badge className="mb-4 bg-[#E8FF00] text-black font-semibold">{adminData.role}</Badge>
              <div className="text-muted-foreground text-sm mb-4 line-clamp-3">{adminData.bio}</div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {adminData.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {adminData.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {adminData.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Joined {adminData.joinDate}
                </div>
              </div>

              <Button 
                onClick={() => setDialogType("edit-profile")}
                className="w-full mt-6 bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80"
              >
                Edit Profile
              </Button>
            </Card>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="text-muted-foreground text-sm mb-1">Total Members</div>
                  <div className="text-3xl font-bold text-[#E8FF00]">{adminData.stats.totalMembers}</div>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="text-muted-foreground text-sm mb-1">Active Trainers</div>
                  <div className="text-3xl font-bold text-[#E8FF00]">{adminData.stats.activeTrainers}</div>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="text-muted-foreground text-sm mb-1">Packages Managed</div>
                  <div className="text-3xl font-bold text-[#E8FF00]">{adminData.stats.packagesManaged}</div>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="text-muted-foreground text-sm mb-1">Total Transactions</div>
                  <div className="text-3xl font-bold text-[#E8FF00]">{adminData.stats.totalTransactions}</div>
                </div>
              </div>
            </Card>

            {/* Account Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <div className="text-foreground mt-1">{adminData.email}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <div className="text-foreground mt-1">{adminData.phone}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <div className="text-foreground mt-1">{adminData.location}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                  <div className="text-foreground mt-1">
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setDialogType("update-info")}
                variant="outline" 
                className="w-full mt-4"
              >
                Update Information
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={dialogType === "edit-profile"} onOpenChange={(open) => {
        if (!open) closeDialog()
      }}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile information</DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Full Name *</Label>
              <Input 
                id="editName"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editBio">Bio</Label>
              <Textarea 
                id="editBio"
                placeholder="Tell us about yourself"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="editPhone">Phone Number</Label>
                <Input 
                  id="editPhone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLocation">Location</Label>
                <Input 
                  id="editLocation"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Information Dialog */}
      <Dialog open={dialogType === "update-info"} onOpenChange={(open) => {
        if (!open) closeDialog()
      }}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>Update Account Information</DialogTitle>
            <DialogDescription>Modify your account contact details</DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="updateEmail">Email Address *</Label>
              <Input 
                id="updateEmail"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="updatePhone">Phone Number *</Label>
                <Input 
                  id="updatePhone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="updateLocation">Location *</Label>
                <Input 
                  id="updateLocation"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80">
                Update Information
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
