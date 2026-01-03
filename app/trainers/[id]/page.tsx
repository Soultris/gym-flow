"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Mail, Phone, Calendar, Briefcase } from "lucide-react"
import Link from "next/link"
import { use } from "react"

const trainersData = [
  {
    id: "T001",
    name: "John Smith",
    username: "@johnsmith",
    email: "john.smith@email.com",
    phone: "+94 077 123 4567",
    status: "Active",
    enrolled: "May 12, 2024",
    specialization: "Strength Training",
    experience: "5 years",
    clients: 12,
    certifications: ["NASM", "ACE", "ISSA"],
    bio: "Expert in strength training and muscle building with over 5 years of experience.",
    avatar: "JS",
  },
  {
    id: "T002",
    name: "Sarah Johnson",
    username: "@sarahj",
    email: "sarah.j@email.com",
    phone: "+94 077 123 4567",
    status: "Active",
    enrolled: "January 7, 2024",
    specialization: "Cardio & Fitness",
    experience: "3 years",
    clients: 8,
    certifications: ["ACE", "NASM"],
    bio: "Passionate about cardiovascular fitness and helping clients achieve their health goals.",
    avatar: "SJ",
  },
  {
    id: "T003",
    name: "Mike Wilson",
    username: "@mikewilson",
    email: "mike.w@email.com",
    phone: "+94 077 123 4567",
    status: "Active",
    enrolled: "March 9, 2024",
    specialization: "Yoga & Flexibility",
    experience: "7 years",
    clients: 15,
    certifications: ["RYT-200", "NASM", "ACE"],
    bio: "Certified yoga instructor focused on flexibility, balance, and mindfulness.",
    avatar: "MW",
  },
  {
    id: "T004",
    name: "Emily Davis",
    username: "@emilyd",
    email: "emily.d@email.com",
    phone: "+94 077 123 4567",
    status: "Inactive",
    enrolled: "November 15, 2023",
    specialization: "Weight Loss Program",
    experience: "4 years",
    clients: 6,
    certifications: ["ISSA", "NASM"],
    bio: "Specialized in creating effective weight loss and body transformation programs.",
    avatar: "ED",
  },
]

export default function TrainerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const trainer = trainersData.find(t => t.id === resolvedParams.id)

  if (!trainer) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Trainer Not Found</h1>
            <p className="text-muted-foreground mb-4">The trainer profile you're looking for doesn't exist.</p>
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
        <div>
          <Link href="/members/trainers">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Trainers
            </Button>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-1">
            <Card className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {trainer.avatar}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold">{trainer.name}</h1>
                <p className="text-muted-foreground">{trainer.username}</p>
                <Badge className="mt-3" variant="outline">
                  {trainer.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{trainer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{trainer.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined {trainer.enrolled}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2a2a2a] space-y-3">
                <Button className="w-full bg-primary hover:bg-primary/90">Edit Profile</Button>
                <Button variant="outline" className="w-full border-[#2a2a2a]">Send Message</Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Info */}
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Professional Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Specialization</p>
                  <p className="font-semibold">{trainer.specialization}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Experience</p>
                  <p className="font-semibold">{trainer.experience}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Bio</p>
                <p className="text-sm leading-relaxed">{trainer.bio}</p>
              </div>
            </Card>

            {/* Certifications */}
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {trainer.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {cert}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <p className="text-3xl font-bold text-primary">{trainer.clients}</p>
                <p className="text-sm text-muted-foreground mt-2">Active Clients</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-3xl font-bold text-primary">{trainer.certifications.length}</p>
                <p className="text-sm text-muted-foreground mt-2">Certifications</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
