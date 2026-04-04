"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Plus, Edit, Trash2, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  CreatePackageRequest,
} from "@/store/api/packagesApi"
import { toast } from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"



type DialogType = "add-package" | "edit-package" | null

export function PackagesList() {
  const [dialogType, setDialogType] = useState<DialogType>(null)
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "1",
    durationType: "months",
    features: "",
    maxMembers: "1",
  })

  const { data: packages = [], isLoading } = useGetPackagesQuery()
  const [createPackage] = useCreatePackageMutation()
  const [updatePackage] = useUpdatePackageMutation()
  const [deletePackage] = useDeletePackageMutation()

  // Helper to format duration for display
  const formatDuration = (duration: number, type: string) => {

    // simple mapping for 'months' -> 'Month' / 'Months'
    if (type === 'months') return `${duration} ${duration === 1 ? 'Month' : 'Months'}`;
    if (type === 'weeks') return `${duration} ${duration === 1 ? 'Week' : 'Weeks'}`;
    if (type === 'days') return `${duration} ${duration === 1 ? 'Day' : 'Days'}`;
    return `${duration} ${type}`;
  }

  const handleEditClick = (packageId: number) => {
    setSelectedPackageId(packageId)
    const pkg = packages.find(p => p.packageId === packageId)
    if (pkg) {
      setFormData({
        name: pkg.name,
        price: pkg.price.toString(),
        duration: pkg.duration.toString(),
        durationType: pkg.durationType,
        features: pkg.features.join("\n"),
        maxMembers: (pkg.maxMembers || 1).toString(),
      })
      setDialogType("edit-package")
    }
  }

  const handleDeleteClick = async (packageId: number) => {
    if (confirm("Are you sure you want to delete this package?")) {
      try {
        await deletePackage(packageId).unwrap()
        toast.success("Package deleted successfully")
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to delete package"))
        console.error(error)
      }
    }
  }

  const closeDialog = () => {
    setDialogType(null)
    setSelectedPackageId(null)
    setFormData({
      name: "",
      price: "",
      duration: "1",
      durationType: "months", // Default
      features: "",
      maxMembers: "1",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Split features by newline and filter empty strings
    const featuresList = formData.features
      .split("\n")
      .map(f => f.trim())
      .filter(f => f.length > 0)

    const payload: CreatePackageRequest = {
      name: formData.name,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      durationType: formData.durationType as 'days' | 'weeks' | 'months',
      features: featuresList,
      maxMembers: parseInt(formData.maxMembers),
    }

    try {
      if (dialogType === "edit-package" && selectedPackageId) {
        await updatePackage({ id: selectedPackageId, data: payload }).unwrap()
        toast.success("Package updated successfully")
      } else {
        await createPackage(payload).unwrap()
        toast.success("Package created successfully")
      }
      closeDialog()
    } catch (error) {
      toast.error(getErrorMessage(error, dialogType === "edit-package" ? "Failed to update package" : "Failed to create package"))
      console.error(error)
    }
  }

  if (isLoading) {
    return <div>Loading packages...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogType === "add-package"} onOpenChange={(open) => {
          if (!open) closeDialog()
          else setDialogType("add-package")
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80">
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle>Create Membership Package</DialogTitle>
              <DialogDescription>Add a new membership package</DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="packageName">Package Name *</Label>
                  <Input 
                    id="packageName" 
                    placeholder="e.g., Premium" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0.00" 
                    step="0.01" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxMembers">Max Members *</Label>
                  <Input 
                    id="maxMembers" 
                    type="number" 
                    min="1"
                    required
                    value={formData.maxMembers}
                    onChange={(e) => setFormData({...formData, maxMembers: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    className="w-1/3"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  />
                  <select 
                    id="durationType" 
                    className="w-2/3 px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
                    value={formData.durationType}
                    onChange={(e) => setFormData({...formData, durationType: e.target.value})}
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea 
                  id="features" 
                  placeholder="Gym Access&#10;Locker Facility&#10;Group Classes" 
                  rows={5}
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80">
                  Create Package
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Package Dialog */}
      <Dialog open={dialogType === "edit-package"} onOpenChange={(open) => {
        if (!open) closeDialog()
      }}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
            <DialogDescription>Update the package details and features</DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="editPackageName">Package Name *</Label>
                <Input 
                  id="editPackageName" 
                  placeholder="e.g., Premium" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPrice">Price *</Label>
                <Input 
                  id="editPrice" 
                  type="number" 
                  placeholder="0.00" 
                  step="0.01" 
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editMaxMembers">Max Members *</Label>
                <Input 
                  id="editMaxMembers" 
                  type="number" 
                  min="1"
                  required
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({...formData, maxMembers: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDuration">Duration</Label>
              <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    className="w-1/3"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  />
                  <select 
                    id="editDurationType" 
                    className="w-2/3 px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
                    value={formData.durationType}
                    onChange={(e) => setFormData({...formData, durationType: e.target.value})}
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editFeatures">Features (one per line)</Label>
              <Textarea 
                id="editFeatures" 
                placeholder="Gym Access&#10;Locker Facility&#10;Group Classes" 
                rows={5}
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80">
                Update Package
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {packages.map((pkg) => (
          <Card
            key={pkg.packageId}
            className={`p-6 transition-colors flex flex-col`}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold">{pkg.name}</h3>
              <div className="mt-2">
                <span className="text-muted-foreground">/{formatDuration(pkg.duration, pkg.durationType)}</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Up to {pkg.maxMembers} members
              </div>
            </div>

            <div className="space-y-3 mb-6 flex-1">
              {pkg.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-[#E8FF00] " />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground mb-4">
              <span className="font-medium text-[#E8FF00]">{pkg._count?.members || 0}</span> active members
            </div>

            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className="flex-1 bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80"
                onClick={() => handleEditClick(pkg.packageId)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteClick(pkg.packageId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
