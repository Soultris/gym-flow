"use client"

import { useGetAllGymsQuery, useCreateGymMutation } from "@/store/api/adminApi"
import { Button } from "@/components/ui/button"
import { Plus, Building2, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ImageUpload } from "@/components/ui/image-upload"

export default function GymsPage() {
  const { data: gyms, isLoading } = useGetAllGymsQuery()
  const [createGym, { isLoading: isCreating }] = useCreateGymMutation()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    subdomain: "",
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append("name", formData.name)
      fd.append("address", formData.address)
      fd.append("phone", formData.phone)
      fd.append("subdomain", formData.subdomain)
      if (logoFile) {
        fd.append("logo", logoFile)
      }
      await createGym(fd).unwrap()
      toast.success("Gym created successfully")
      setOpen(false)
      setFormData({ name: "", address: "", phone: "", subdomain: "" })
      setLogoFile(null)
    } catch {
      toast.error("Failed to create gym")
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">Loading gyms...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gym Management</h1>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Gym
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Gym</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Gym Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subdomain">Subdomain</Label>
                  <Input
                    id="subdomain"
                    value={formData.subdomain}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Used for gym identification (e.g., gym1)</p>
                </div>
                <div className="space-y-2">
                  <Label>Gym Logo</Label>
                  <div className="max-w-[200px]">
                    <ImageUpload
                      value={logoFile}
                      onChange={(file) => setLogoFile(file)}
                      onRemove={() => setLogoFile(null)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Gym"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gyms?.map((gym) => (
            <div
              key={gym.gymId}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold leading-none tracking-tight">{gym.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {gym.address || "No address"}
                  </p>
                  {gym.subdomain && (
                    <p className="text-sm font-medium text-primary">
                      {gym.subdomain}.seynextech.com
                    </p>
                  )}
                </div>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  {gym.phone || "No phone"}
                </div>
                <div className="flex gap-4">
                  <span>{gym._count?.members || 0} Members</span>
                  <span>{gym._count?.trainers || 0} Trainers</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {gym.features.map((feature) => (
                  <span
                    key={feature.featureId}
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {feature.name}
                  </span>
                ))}
              </div>

              <Link href={`/admin/gyms/${gym.gymId}`} className="absolute inset-0">
                <span className="sr-only">View gym details</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
