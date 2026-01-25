"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StrikePointsManager } from "@/components/trainers/strike-points-manager"
import { ArrowLeft, Mail, Phone, Calendar, Loader2 } from "lucide-react"
import Link from "next/link"
import { use } from "react"
import { useGetTrainerByIdQuery } from "@/store/api/trainersApi"

function getInitials(name: string): string {
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
                    {getInitials(trainer.name)}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold">{trainer.name}</h1>
                <p className="text-muted-foreground">{trainer.specialization}</p>
                <Badge className="mt-3" variant="outline">
                  Active
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{trainer.phone}</span>
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
                  <p className="text-sm text-muted-foreground mb-1">Trainer ID</p>
                  <p className="font-semibold">T{String(trainer.trainerId).padStart(3, '0')}</p>
                </div>
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <p className="text-3xl font-bold text-primary">{trainer._count?.transactions || 0}</p>
                <p className="text-sm text-muted-foreground mt-2">Training Sessions</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-3xl font-bold text-primary">{trainer._count?.users || 0}</p>
                <p className="text-sm text-muted-foreground mt-2">Associated Members</p>
              </Card>
            </div>

            {/* Strike Points Manager */}
            <StrikePointsManager
              trainerId={trainer.trainerId}
              currentStrikePoints={trainer.strikePoints || 0}
              trainerName={trainer.name}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
