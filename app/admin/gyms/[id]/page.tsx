"use client"

import { useGetGymByIdQuery, useToggleFeatureMutation } from "@/store/api/adminApi"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Copy } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"
import { DashboardLayout } from "@/components/dashboard-layout"

const AVAILABLE_FEATURES = [
  { code: 'BULK_SMS', name: 'Bulk SMS', description: 'Enable SMS marketing and notifications' },
  { code: 'INVENTORY', name: 'Inventory Management', description: 'Track products and stock levels' },
]

export default function GymDetailsPage() {
  const params = useParams()
  const gymId = parseInt(params.id as string)
  const { data: gym, isLoading } = useGetGymByIdQuery(gymId)
  const [toggleFeature] = useToggleFeatureMutation()

  const handleToggleFeature = async (featureCode: string, enabled: boolean) => {
    try {
      await toggleFeature({ gymId, featureCode, enabled }).unwrap()
      toast.success(`Feature ${enabled ? 'enabled' : 'disabled'} successfully`)
    } catch (error) {
      toast.error("Failed to update feature")
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">Loading gym details...</div>
      </DashboardLayout>
    )
  }

  if (!gym) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">Gym not found</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/gyms">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{gym.name}</h1>
            <p className="text-muted-foreground">Gym ID: {gym.gymId}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p>{gym.address || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p>{gym.phone || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Management</CardTitle>
              <CardDescription>Enable or disable premium features for this gym</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {AVAILABLE_FEATURES.map((feature) => {
                const isEnabled = gym.features.some(f => f.code === feature.code)
                return (
                  <div key={feature.code} className="flex items-center justify-between space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium leading-none">{feature.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) => handleToggleFeature(feature.code, checked)}
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
