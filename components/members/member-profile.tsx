"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Mail, Phone, Calendar, MapPin, User, CreditCard, Clock, Edit, X, Save, Ruler, Weight } from "lucide-react"
import { useState } from "react"

const attendanceHistory = [
  { date: "Jun 23, 2024", time: "06:30 AM", duration: "1.5 hrs" },
  { date: "Jun 21, 2024", time: "06:15 AM", duration: "1.2 hrs" },
  { date: "Jun 19, 2024", time: "07:00 AM", duration: "1.8 hrs" },
  { date: "Jun 17, 2024", time: "06:45 AM", duration: "1.3 hrs" },
  { date: "Jun 15, 2024", time: "06:30 AM", duration: "1.5 hrs" },
]

const paymentHistory = [
  { date: "Jun 1, 2024", amount: "LKR 80", method: "Card", status: "Paid" },
  { date: "May 1, 2024", amount: "LKR 80", method: "Card", status: "Paid" },
  { date: "Apr 1, 2024", amount: "LKR 80", method: "Cash", status: "Paid" },
  { date: "Mar 1, 2024", amount: "LKR 80", method: "Card", status: "Paid" },
]

interface MemberData {
  fullName: string
  email: string
  phone: string
  dob: string
  age: string
  gender: string
  nic: string
  height: string
  weight: string
  address: string
  joiningDate: string
  package: string
  duration: string
  expiryDate: string
  amountPaid: string
  status: string
}

export function MemberProfile({ memberId }: { memberId: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [memberData, setMemberData] = useState<MemberData>({
    fullName: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 234 567 8900",
    dob: "1990-01-15",
    age: "34",
    gender: "Male",
    nic: "123456789V",
    height: "175",
    weight: "70",
    address: "123 Main St, City, ST 12345",
    joiningDate: "2024-01-15",
    package: "Premium",
    duration: "6 Months",
    expiryDate: "2024-07-15",
    amountPaid: "480",
    status: "Active",
  })

  const updateField = (field: keyof MemberData, value: string) => {
    setMemberData(prev => ({ ...prev, [field]: value }))
    
    // Auto-calculate age when DOB changes
    if (field === "dob" && value) {
      const birthDate = new Date(value)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      setMemberData(prev => ({ ...prev, age: age.toString() }))
    }
  }

  const handleSave = () => {
    console.log("Saving member data:", memberData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const getInitials = () => {
    const names = memberData.fullName.split(" ")
    return names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0]
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Edit/Save buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{memberData.fullName}</h1>
          <p className="text-sm text-muted-foreground">Member ID: {memberId}</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback className="bg-secondary text-foreground text-2xl font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mt-4">{memberData.fullName}</h2>
              <p className="text-sm text-muted-foreground">ID: {memberId}</p>
              <Badge variant="outline" className={`mt-2 ${memberData.status === "Active" ? "border-accent text-accent" : "border-destructive text-destructive"}`}>
                {memberData.status}
              </Badge>
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{memberData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{memberData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Born: {formatDate(memberData.dob)} (Age: {memberData.age})</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{memberData.gender}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <span>{memberData.height} cm / {memberData.weight} kg</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{memberData.address}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <Button variant="outline" className="w-full bg-transparent">
                Send SMS
              </Button>
              <Button variant="outline" className="w-full text-destructive hover:text-destructive bg-transparent">
                Deactivate
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="membership">Membership</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      {isEditing ? (
                        <Input
                          value={memberData.fullName}
                          onChange={(e) => updateField("fullName", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{memberData.fullName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={memberData.dob}
                          onChange={(e) => updateField("dob", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{formatDate(memberData.dob)}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <p className="text-sm py-2">{memberData.age}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Mobile No.</Label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={memberData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{memberData.phone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={memberData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{memberData.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      {isEditing ? (
                        <Select value={memberData.gender} onValueChange={(value) => updateField("gender", value)}>
                          <SelectTrigger className="bg-secondary border-[#3a3a3a]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm py-2">{memberData.gender}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>NIC</Label>
                      {isEditing ? (
                        <Input
                          value={memberData.nic}
                          onChange={(e) => updateField("nic", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{memberData.nic}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Height (cm)</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={memberData.height}
                          onChange={(e) => updateField("height", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{memberData.height} cm</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Weight (kg)</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={memberData.weight}
                          onChange={(e) => updateField("weight", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{memberData.weight} kg</p>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <Label>Address</Label>
                      {isEditing ? (
                        <Input
                          value={memberData.address}
                          onChange={(e) => updateField("address", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{memberData.address}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Joining Date</Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={memberData.joiningDate}
                          onChange={(e) => updateField("joiningDate", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{formatDate(memberData.joiningDate)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Membership Tab */}
              <TabsContent value="membership" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Membership Details</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Package</Label>
                      {isEditing ? (
                        <Select value={memberData.package} onValueChange={(value) => updateField("package", value)}>
                          <SelectTrigger className="bg-secondary border-[#3a3a3a]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Basic">Basic - LKR 30/month</SelectItem>
                            <SelectItem value="Standard">Standard - LKR 50/month</SelectItem>
                            <SelectItem value="Premium">Premium - LKR 80/month</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-lg font-semibold text-primary">{memberData.package}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      {isEditing ? (
                        <Select value={memberData.duration} onValueChange={(value) => updateField("duration", value)}>
                          <SelectTrigger className="bg-secondary border-[#3a3a3a]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1 Month">1 Month</SelectItem>
                            <SelectItem value="3 Months">3 Months</SelectItem>
                            <SelectItem value="6 Months">6 Months</SelectItem>
                            <SelectItem value="12 Months">12 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-lg font-semibold">{memberData.duration}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Expiry Date</Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={memberData.expiryDate}
                          onChange={(e) => updateField("expiryDate", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-lg font-semibold">{formatDate(memberData.expiryDate)}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Amount Paid</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={memberData.amountPaid}
                          onChange={(e) => updateField("amountPaid", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-lg font-semibold">LKR {memberData.amountPaid}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      {isEditing ? (
                        <Select value={memberData.status} onValueChange={(value) => updateField("status", value)}>
                          <SelectTrigger className="bg-secondary border-[#3a3a3a]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Expired">Expired</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline" className={`${memberData.status === "Active" ? "border-accent text-accent" : "border-destructive text-destructive"}`}>
                          {memberData.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold mb-3">Assigned Workout Plan</h3>
                  <Card className="p-4 bg-secondary">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Strength Training Program</p>
                        <p className="text-sm text-muted-foreground">4 days/week • 60 min sessions</p>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Attendance Tab */}
              <TabsContent value="attendance" className="space-y-4 mt-6">
                <div className="space-y-3">
                  {attendanceHistory.map((record, i) => (
                    <Card key={i} className="p-4 bg-secondary/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-accent/10 p-2">
                            <Clock className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium">{record.date}</p>
                            <p className="text-sm text-muted-foreground">Check-in: {record.time}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-primary text-primary">
                          {record.duration}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments" className="space-y-4 mt-6">
                <div className="space-y-3">
                  {paymentHistory.map((payment, i) => (
                    <Card key={i} className="p-4 bg-secondary/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <CreditCard className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{payment.amount}</p>
                            <p className="text-sm text-muted-foreground">
                              {payment.date} • {payment.method}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-accent text-accent">
                          {payment.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}
