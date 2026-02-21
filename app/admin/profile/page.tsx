"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import { useGetMembersQuery } from "@/store/api/membersApi"
import { useGetTrainersQuery } from "@/store/api/trainersApi"
import { useGetPackagesQuery } from "@/store/api/packagesApi"
import { useGetTransactionsQuery } from "@/store/api/transactionsApi"
import { useGetMeQuery } from "@/store/api/authApi"
import { useGetGymProfileQuery } from "@/store/api/gymApi"

export default function AdminProfilePage() {
  // Fetch data from APIs
  const { data: membersData } = useGetMembersQuery({ limit: 1000 })
  const { data: trainersData } = useGetTrainersQuery()
  const { data: packagesData } = useGetPackagesQuery()
  const { data: transactionsData } = useGetTransactionsQuery({ limit: 1000 })
  const { data: user } = useGetMeQuery()
  const { data: gym } = useGetGymProfileQuery()

  // Calculate stats from real data
  const stats = useMemo(() => {
    const totalMembers = membersData?.members?.length || 0
    const activeTrainers = trainersData?.filter((t) => !t.isPending).length || 0
    const packagesManaged = packagesData?.length || 0
    const totalTransactions = transactionsData?.transactions?.length || 0

    return {
      totalMembers,
      activeTrainers,
      packagesManaged,
      totalTransactions,
    }
  }, [membersData, trainersData, packagesData, transactionsData])

  const adminData = {
    name: user?.name || "Admin User",
    email: user?.email || "admin@gym.com",
    phone: gym?.phone || "+1 (555) 123-4567",
    location: gym?.address || "New York, NY",
    joinDate: "January 2023",
    role: user?.role?.name || "System Administrator",
    avatar: user?.gymLogoUrl || gym?.logoUrl || "/placeholder.svg?height=200&width=200",
    bio: "Gym management system administrator responsible for overall system operations and user management.",
    stats,
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
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Profile</h1>
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
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
