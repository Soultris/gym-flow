"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

const packages = [
  {
    id: 1,
    name: "Basic",
    price: 30,
    duration: "1 Month",
    features: ["Gym Access", "Locker Facility", "Basic Equipment"],
    members: 89,
    popular: false,
  },
  {
    id: 2,
    name: "Standard",
    price: 50,
    duration: "1 Month",
    features: ["Gym Access", "Locker Facility", "All Equipment", "Group Classes"],
    members: 134,
    popular: false,
  },
  {
    id: 3,
    name: "Premium",
    price: 80,
    duration: "1 Month",
    features: ["Gym Access", "Locker Facility", "All Equipment", "Group Classes", "Personal Trainer", "Diet Plan"],
    members: 89,
    popular: false,
  },
  {
    id: 4,
    name: "Annual Pass",
    price: 600,
    duration: "12 Months",
    features: [
      "Gym Access",
      "Locker Facility",
      "All Equipment",
      "Group Classes",
      "Personal Trainer",
      "Diet Plan",
      "Free Guest Pass",
    ],
    members: 30,
    popular: false,
  },
]

type DialogType = "add-package" | "edit-package" | null

export function PackagesList() {
  const [dialogType, setDialogType] = useState<DialogType>(null)
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "1 Month",
    features: "",
  })

  const selectedPackage = selectedPackageId ? packages.find(p => p.id === selectedPackageId) : null

  const handleEditClick = (packageId: number) => {
    setSelectedPackageId(packageId)
    const pkg = packages.find(p => p.id === packageId)
    if (pkg) {
      setFormData({
        name: pkg.name,
        price: pkg.price.toString(),
        duration: pkg.duration,
        features: pkg.features.join("\n"),
      })
      setDialogType("edit-package")
    }
  }

  const closeDialog = () => {
    setDialogType(null)
    setSelectedPackageId(null)
    setFormData({
      name: "",
      price: "",
      duration: "1 Month",
      features: "",
    })
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
            <form className="space-y-4 mt-4">
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <select 
                  id="duration" 
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                >
                  <option>1 Month</option>
                  <option>3 Months</option>
                  <option>6 Months</option>
                  <option>12 Months</option>
                </select>
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
          <form className="space-y-4 mt-4">
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDuration">Duration</Label>
              <select 
                id="editDuration" 
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              >
                <option>1 Month</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>12 Months</option>
              </select>
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
            key={pkg.id}
            className={`p-6 transition-colors flex flex-col ${pkg.popular ? "border-[#E8FF00] border-2" : ""}`}
          >
            {pkg.popular && <Badge className="mb-4 bg-[#E8FF00] text-black font-semibold">Most Popular</Badge>}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold">{pkg.name}</h3>
              <div className="mt-2">
                <span className="text-4xl font-bold text-[#E8FF00]">LKR {pkg.price}</span>
                <span className="text-muted-foreground">/{pkg.duration}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6 flex-1">
              {pkg.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-[#E8FF00] flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground mb-4">
              <span className="font-medium text-[#E8FF00]">{pkg.members}</span> active members
            </div>

            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className="flex-1 bg-[#E8FF00] text-black font-semibold hover:bg-[#E8FF00]/80"
                onClick={() => handleEditClick(pkg.id)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-destructive hover:bg-destructive/10"
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
