"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarUpload } from "@/components/ui/avatar-upload"
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
import { Mail, Phone, Calendar, MapPin, User, CreditCard, Clock, Edit, X, Save, Ruler, Loader2 } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"
import { useGetMemberByIdQuery, useUpdateMemberMutation, useGetMemberAttendanceQuery, useGetMemberTransactionsQuery, useDeactivateMemberMutation } from "@/store/api/membersApi"
import { useGetAssignedWorkoutsQuery, AssignedWorkout } from "@/store/api/workoutsApi"
import { Transaction } from "@/store/api/transactionsApi"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface MemberFormData {
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
}

export function MemberProfile({ memberId }: { memberId: string }) {
  const router = useRouter()
  const numericMemberId = parseInt(memberId, 10)
  
  // API Queries
  const { data: member, isLoading: memberLoading, error: memberError } = useGetMemberByIdQuery(numericMemberId)
  const { data: attendanceData } = useGetMemberAttendanceQuery({ id: numericMemberId })
  const { data: transactionsData } = useGetMemberTransactionsQuery(numericMemberId)
  const { data: assignedWorkoutsResponse } = useGetAssignedWorkoutsQuery({ memberId: numericMemberId })
  const assignedWorkoutsData = assignedWorkoutsResponse?.workouts || []
  
  // API Mutations
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation()
  const [deactivateMember, { isLoading: isDeactivating }] = useDeactivateMemberMutation()
  
  // UI State
  const [isEditing, setIsEditing] = useState(false)
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)
  const [attendanceFromDate, setAttendanceFromDate] = useState("")
  const [attendanceToDate, setAttendanceToDate] = useState("")
  
  // Form state (separate from API data for editing)
  const [formData, setFormData] = useState<MemberFormData>({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    age: "",
    gender: "",
    nic: "",
    height: "",
    weight: "",
    address: "",
    joiningDate: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Populate form when member data loads
  useEffect(() => {
    if (member) {
      const birthDate = new Date(member.dob)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      setFormData({
        fullName: member.name,
        email: member.email,
        phone: member.phone,
        dob: member.dob?.split('T')[0] || "",
        age: age.toString(),
        gender: member.gender.charAt(0).toUpperCase() + member.gender.slice(1),
        nic: member.nic,
        height: member.height?.toString() || "",
        weight: member.weight?.toString() || "",
        address: member.address,
        joiningDate: member.joiningDate?.split('T')[0] || "",
      })
      setImageFile(null)
    }
  }, [member])

  const updateField = (field: keyof MemberFormData, value: string) => {
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

  const handleSave = async () => {
    try {
      const updateData = new FormData()
      updateData.append("name", formData.fullName)
      updateData.append("email", formData.email)
      updateData.append("phone", formData.phone)
      updateData.append("dob", formData.dob)
      updateData.append("gender", formData.gender.toLowerCase())
      updateData.append("nic", formData.nic)
      updateData.append("height", formData.height)
      updateData.append("weight", formData.weight)
      updateData.append("address", formData.address)
      updateData.append("joiningDate", formData.joiningDate)
      
      if (imageFile) {
        updateData.append("image", imageFile)
      }

      await updateMember({
        id: numericMemberId,
        data: updateData
      }).unwrap()
      toast.success("Profile updated successfully")
      setIsEditing(false)
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update profile"))
    }
  }

  const handleCancel = () => {
    // Reset form data from member
    if (member) {
      const birthDate = new Date(member.dob)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      setFormData({
        fullName: member.name,
        email: member.email,
        phone: member.phone,
        dob: member.dob?.split('T')[0] || "",
        age: age.toString(),
        gender: member.gender.charAt(0).toUpperCase() + member.gender.slice(1),
        nic: member.nic,
        height: member.height?.toString() || "",
        weight: member.weight?.toString() || "",
        address: member.address,
        joiningDate: member.joiningDate?.split('T')[0] || "",
      })
      setImageFile(null)
    }
    setIsEditing(false)
  }

  const handleDeactivateClick = async () => {
    try {
      await deactivateMember(numericMemberId).unwrap()
      toast.success("Member has been deactivated")
      setDeactivateDialogOpen(false)
      // Optionally navigate back to members list
      router.push("/members?status=deactivated")
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to deactivate member"))
    }
  }

  const getInitials = () => {
    const names = formData.fullName.split(" ")
    return names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0]?.[0] || "?"
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Get member status
  const memberStatus = member?.status || (member?.isPending ? "pending" : "active")

  // Get active package info
  const activePackage = member?.memberPackages?.find(pkg => {
    const expDate = new Date(pkg.expiresAt)
    return expDate >= new Date()
  })

  // Filter attendance based on date range
  const filteredAttendance = useMemo(() => {
    if (!attendanceData) return []
    
    return attendanceData.filter((record: { timestamp: string }) => {
      if (!attendanceFromDate && !attendanceToDate) return true
      
      const recordDate = new Date(record.timestamp)
      
      if (attendanceFromDate && attendanceToDate) {
        const from = new Date(attendanceFromDate)
        const to = new Date(attendanceToDate)
        to.setHours(23, 59, 59, 999)
        return recordDate >= from && recordDate <= to
      }
      
      if (attendanceFromDate) {
        return recordDate >= new Date(attendanceFromDate)
      }
      
      if (attendanceToDate) {
        const to = new Date(attendanceToDate)
        to.setHours(23, 59, 59, 999)
        return recordDate <= to
      }
      
      return true
    })
  }, [attendanceData, attendanceFromDate, attendanceToDate])

  const clearAttendanceFilters = () => {
    setAttendanceFromDate("")
    setAttendanceToDate("")
  }

  // Loading state
  if (memberLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Error state
  if (memberError || !member) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Member not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Edit/Save buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{formData.fullName}</h1>
          <p className="text-sm text-muted-foreground">Member ID: {memberId}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isUpdating} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
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
              {isEditing ? (
                <AvatarUpload
                  value={imageFile || member.imageUrl || undefined}
                  onChange={(file: File | null) => setImageFile(file)}
                  className="mb-4"
                />
              ) : (
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={member.imageUrl || undefined} />
                  <AvatarFallback className="bg-secondary text-foreground text-2xl font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              )}
              <h2 className="text-xl font-bold mt-4">{formData.fullName}</h2>
              <p className="text-sm text-muted-foreground">ID: {memberId}</p>
              <Badge variant="outline" className={`mt-2 ${memberStatus === "active" ? "border-green-500 text-green-500" : memberStatus === "pending" ? "border-yellow-500 text-yellow-500" : "border-destructive text-destructive"}`}>
                {memberStatus.charAt(0).toUpperCase() + memberStatus.slice(1)}
              </Badge>
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{formData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Born: {formatDate(formData.dob)} (Age: {formData.age})</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{formData.gender}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <span>{formData.height} cm / {formData.weight} kg</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{formData.address}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <Button 
                variant="outline" 
                className="w-full bg-transparent"
                onClick={() => {
                  const params = new URLSearchParams()
                  params.set("memberId", member?.memberId?.toString() || "")
                  params.set("memberName", member?.name || "")
                  router.push(`/bulk-sms?${params.toString()}`)
                }}
              >
                Send SMS
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-destructive hover:text-destructive bg-transparent"
                onClick={() => setDeactivateDialogOpen(true)}
              >
                Deactivate
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="flex flex-wrap w-full h-auto gap-1 sm:grid sm:grid-cols-3 lg:grid-cols-5">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="membership">Membership</TabsTrigger>
                <TabsTrigger value="workout">Workouts</TabsTrigger>
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
                          value={formData.fullName}
                          onChange={(e) => updateField("fullName", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{formData.fullName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={formData.dob}
                          onChange={(e) => updateField("dob", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{formatDate(formData.dob)}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <p className="text-sm py-2">{formData.age}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Mobile No.</Label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{formData.phone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{formData.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      {isEditing ? (
                        <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
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
                        <p className="text-sm py-2">{formData.gender}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>NIC</Label>
                      {isEditing ? (
                        <Input
                          value={formData.nic}
                          onChange={(e) => updateField("nic", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{formData.nic}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Height (cm)</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={formData.height}
                          onChange={(e) => updateField("height", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{formData.height} cm</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Weight (kg)</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={formData.weight}
                          onChange={(e) => updateField("weight", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{formData.weight} kg</p>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <Label>Address</Label>
                      {isEditing ? (
                        <Input
                          value={formData.address}
                          onChange={(e) => updateField("address", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{formData.address}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Joining Date</Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={formData.joiningDate}
                          onChange={(e) => updateField("joiningDate", e.target.value)}
                          className="bg-secondary border-[#3a3a3a]"
                        />
                      ) : (
                        <p className="text-sm py-2">{formatDate(formData.joiningDate)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Membership Tab */}
              <TabsContent value="membership" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Membership Details</h3>
                  {activePackage ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Package</Label>
                        <p className="text-lg font-semibold text-primary">{activePackage.package?.name || "N/A"}</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Purchased</Label>
                        <p className="text-lg font-semibold">{formatDate(activePackage.purchasedAt)}</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <p className="text-lg font-semibold">{formatDate(activePackage.expiresAt)}</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <p className="text-lg font-semibold">LKR {activePackage.package?.price || 0}</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Badge variant="outline" className="border-accent text-accent">
                          Active
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No active membership</p>
                  )}
                </div>
              </TabsContent>

              {/* Workouts Tab */}
              <TabsContent value="workout" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Assigned Workout Plans</h3>
                  <div className="space-y-4">
                    {assignedWorkoutsData && assignedWorkoutsData.length > 0 ? (
                      assignedWorkoutsData.map((workout: AssignedWorkout) => {
                        const isActive = new Date(workout.endDate) >= new Date()
                        return (
                          <Card key={workout.assignedWorkoutId} className="p-5 bg-secondary/30 border border-border">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#E8FF00] text-black font-bold text-lg">
                                  {String(workout.dayNumber).padStart(2, '0')}
                                </span>
                                <div>
                                  <h4 className="font-semibold text-lg">{workout.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    📅 {formatDate(workout.startDate)} - {formatDate(workout.endDate)}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline" className={isActive ? "border-accent text-accent" : "border-muted-foreground text-muted-foreground"}>
                                {isActive ? "Active" : "Expired"}
                              </Badge>
                            </div>
                            {workout.rows && workout.rows.length > 0 && (
                              <div className="space-y-3 bg-background/50 p-4 rounded-lg">
                                <p className="font-medium text-sm mb-2">Exercises:</p>
                                <div className="space-y-2">
                                  {workout.rows.map((row) => (
                                    <div key={row.assignedWorkoutRowId} className="flex items-center justify-between text-sm">
                                      <span>{row.name}</span>
                                      <span className="text-muted-foreground">{row.reps}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </Card>
                        )
                      })
                    ) : (
                      <p className="text-center text-muted-foreground text-sm mt-6">No workout plans assigned. Assign new workout plans from the Workouts menu.</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Attendance Tab */}
              <TabsContent value="attendance" className="space-y-4 mt-6">
                {/* Date Filters and Visit Count */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 pb-4 border-b border-border">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="attendance-from" className="text-sm">From Date</Label>
                      <Input
                        id="attendance-from"
                        type="date"
                        value={attendanceFromDate}
                        onChange={(e) => setAttendanceFromDate(e.target.value)}
                        className="bg-secondary border-[#3a3a3a] h-9 w-full sm:w-40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attendance-to" className="text-sm">To Date</Label>
                      <Input
                        id="attendance-to"
                        type="date"
                        value={attendanceToDate}
                        onChange={(e) => setAttendanceToDate(e.target.value)}
                        min={attendanceFromDate}
                        className="bg-secondary border-[#3a3a3a] h-9 w-full sm:w-40"
                      />
                    </div>
                    {(attendanceFromDate || attendanceToDate) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAttendanceFilters}
                        className="self-end text-muted-foreground hover:text-foreground h-9"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {filteredAttendance.length} {filteredAttendance.length === 1 ? "visit" : "visits"}
                  </p>
                </div>

                <div className="space-y-3">
                  {filteredAttendance.length > 0 ? (
                    filteredAttendance.map((record: { attendanceId: number; timestamp: string }, i: number) => (
                      <Card key={record.attendanceId || i} className="p-4 bg-secondary/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-accent/10 p-2">
                              <Clock className="h-4 w-4 text-accent" />
                            </div>
                            <div>
                              <p className="font-medium">{formatDate(record.timestamp)}</p>
                              <p className="text-sm text-muted-foreground">
                                Check-in: {new Date(record.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No attendance records found{attendanceFromDate || attendanceToDate ? " for the selected date range" : ""}.
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments" className="space-y-4 mt-6">
                <div className="space-y-3">
                  {transactionsData && transactionsData.length > 0 ? (
                    transactionsData.map((payment: Transaction, i: number) => (
                      <Card key={payment.transactionId || i} className="p-4 bg-secondary/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                              <CreditCard className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">LKR {payment.price}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(payment.paidAt)} {payment.paymentMethod ? `• ${payment.paymentMethod}` : ""}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-accent text-accent">
                            Paid
                          </Badge>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No payment records found.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Deactivate Confirmation Dialog */}
      <Dialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate {formData.fullName}? This member will no longer be able to access their account and won&apos;t appear in active members list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeactivateDialogOpen(false)}
              disabled={isDeactivating}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeactivateClick}
              disabled={isDeactivating}
            >
              {isDeactivating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deactivating...
                </>
              ) : (
                "Deactivate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>    </div>
  )
}