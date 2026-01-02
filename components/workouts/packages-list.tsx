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
    popular: true,
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

export function PackagesList() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Membership Package</DialogTitle>
              <DialogDescription>Add a new membership package</DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="packageName">Package Name *</Label>
                  <Input id="packageName" placeholder="e.g., Premium" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input id="price" type="number" placeholder="0.00" step="0.01" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <select id="duration" className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                  <option>1 Month</option>
                  <option>3 Months</option>
                  <option>6 Months</option>
                  <option>12 Months</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea id="features" placeholder="Gym Access&#10;Locker Facility&#10;Group Classes" rows={5} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Create Package
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`p-6 hover:border-primary/50 transition-colors ${pkg.popular ? "border-accent border-2" : ""}`}
          >
            {pkg.popular && <Badge className="mb-4 bg-accent text-accent-foreground">Most Popular</Badge>}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold">{pkg.name}</h3>
              <div className="mt-2">
                <span className="text-4xl font-bold text-primary">${pkg.price}</span>
                <span className="text-muted-foreground">/{pkg.duration}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {pkg.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-accent flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground mb-4">
              <span className="font-medium text-accent">{pkg.members}</span> active members
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
