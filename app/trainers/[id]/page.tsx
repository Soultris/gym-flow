"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StrikePointsManager } from "@/components/trainers/strike-points-manager"
import { ArrowLeft, Phone, Loader2, Edit, X, Save } from "lucide-react"
import Link from "next/link"
import { use, useState } from "react"
import { useGetTrainerByIdQuery, useUpdateTrainerMutation } from "@/store/api/trainersApi"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AvatarUpload } from "@/components/ui/avatar-upload"

function getInitials(name: string): string {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function TrainerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const trainerId = parseInt(resolvedParams.id, 10)
  const { data: trainer, isLoading, isError } = useGetTrainerByIdQuery(trainerId)
  
  const [updateTrainer, { isLoading: isUpdating }] = useUpdateTrainerMutation()
  const [isEditing, setIsEditing] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialization: "",
    dob: "",
    age: "",
    gender: "",
    nic: "",
    address: ""
  })

  // Sync state during render when trainer data loads
  const [prevTrainer, setPrevTrainer] = useState(trainer)
  if (trainer !== prevTrainer) {
    setPrevTrainer(trainer)
    if (trainer) {
      setFormData({
        name: trainer.name || "",
        phone: trainer.phone || "",
        specialization: trainer.specialization || "",
        dob: trainer.dob ? new Date(trainer.dob).toISOString().split('T')[0] : "",
        age: trainer.age?.toString() || "",
        gender: trainer.gender || "",
        nic: trainer.nic || "",
        address: trainer.address || ""
      })
      setImageFile(null)
    }
  }

  const handleSave = async () => {
    try {
      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("phone", formData.phone)
      submitData.append("specialization", formData.specialization)
      if (formData.dob) submitData.append("dob", formData.dob)
      if (formData.age) submitData.append("age", formData.age)
      if (formData.gender) submitData.append("gender", formData.gender)
      if (formData.nic) submitData.append("nic", formData.nic)
      if (formData.address) submitData.append("address", formData.address)
      if (imageFile) submitData.append("image", imageFile)

      await updateTrainer({
        id: trainerId,
        data: submitData
      }).unwrap()

      toast.success("Trainer profile updated successfully")
      setIsEditing(false)
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update profile"))
    }
  }

  const handleCancel = () => {
    if (trainer) {
      setFormData({
        name: trainer.name || "",
        phone: trainer.phone || "",
        specialization: trainer.specialization || "",
        dob: trainer.dob ? new Date(trainer.dob).toISOString().split('T')[0] : "",
        age: trainer.age?.toString() || "",
        gender: trainer.gender || "",
        nic: trainer.nic || "",
        address: trainer.address || ""
      })
      setImageFile(null)
    }
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading trainer...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (isError || !trainer) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Trainer Not Found</h1>
            <p className="text-muted-foreground mb-4">The trainer profile you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/members/trainers">
              <Button>Back to Trainers</Button>
            </Link>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/members/trainers">
            <Button variant="ghost" className="gap-2 mb-4 sm:mb-0">
              <ArrowLeft className="h-4 w-4" />
              Back to Trainers
            </Button>
          </Link>
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

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-1">
            <Card className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                {isEditing ? (
                  <AvatarUpload
                    value={imageFile || trainer.imageUrl || undefined}
                    onChange={(file: File | null) => setImageFile(file)}
                    className="mb-4"
                  />
                ) : (
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={trainer.imageUrl || "/placeholder.svg?height=96&width=96"} className="object-cover" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                      {getInitials(trainer.name)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <h1 className="text-2xl font-bold">{formData.name}</h1>
                <p className="text-muted-foreground">{formData.specialization}</p>
                <Badge className="mt-3" variant="outline">
                  {trainer.isPending ? "Pending" : "Active"}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{formData.phone}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Info */}
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Professional Information</h2>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  {isEditing ? (
                    <Input
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      className="bg-secondary border-[#3a3a3a]"
                    />
                  ) : (
                    <p className="font-semibold text-sm py-2">{formData.specialization}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Trainer ID</Label>
                  <p className="font-semibold text-sm py-2">T{String(trainer.trainerId).padStart(3, '0')}</p>
                </div>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  {isEditing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-secondary border-[#3a3a3a]"
                    />
                  ) : (
                    <p className="font-semibold text-sm py-2">{formData.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="bg-secondary border-[#3a3a3a]"
                    />
                  ) : (
                    <p className="font-semibold text-sm py-2">{formData.phone}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Personal Info */}
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => {
                          const newDob = e.target.value;
                          let newAge = formData.age;
                          if (newDob) {
                              const birthDate = new Date(newDob);
                              const today = new Date();
                              let calculatedAge = today.getFullYear() - birthDate.getFullYear();
                              const m = today.getMonth() - birthDate.getMonth();
                              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                  calculatedAge--;
                              }
                              newAge = calculatedAge.toString();
                          } else {
                              newAge = "";
                          }
                          setFormData({...formData, dob: newDob, age: newAge});
                      }}
                      className="bg-secondary border-[#3a3a3a]"
                    />
                  ) : (
                    <p className="font-semibold text-sm py-2">{formatDate(formData.dob)}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  {isEditing ? (
                    <Input
                      value={formData.age}
                      disabled
                      className="bg-muted border-[#3a3a3a]"
                    />
                  ) : (
                    <p className="font-semibold text-sm py-2">{formData.age || 'N/A'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  {isEditing ? (
                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger className="bg-secondary border-[#3a3a3a]">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-semibold text-sm py-2 capitalize">{formData.gender || 'N/A'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>NIC</Label>
                  {isEditing ? (
                    <Input
                      value={formData.nic}
                      onChange={(e) => setFormData({...formData, nic: e.target.value})}
                      className="bg-secondary border-[#3a3a3a]"
                    />
                  ) : (
                    <p className="font-semibold text-sm py-2">{formData.nic || 'N/A'}</p>
                  )}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Address</Label>
                  {isEditing ? (
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="bg-secondary border-[#3a3a3a]"
                    />
                  ) : (
                    <p className="font-semibold text-sm py-2">{formData.address || 'N/A'}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Stats */}
            {/* <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <p className="text-3xl font-bold text-primary">{trainer._count?.transactions || 0}</p>
                <p className="text-sm text-muted-foreground mt-2">Training Sessions</p>
              </Card>
            </div> */}

            {/* Strike Points Manager */}
            {!isEditing && (
              <StrikePointsManager
                trainerId={trainer.trainerId}
                currentStrikePoints={trainer.strikePoints || 0}
                trainerName={trainer.name}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
