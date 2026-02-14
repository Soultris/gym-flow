"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { useCreateProductMutation } from "@/store/api/productsApi"
import toast from "react-hot-toast"
import { ImageUpload } from "@/components/ui/image-upload"

interface AddProductDialogProps {
  onAddProduct?: () => void
}

const categories = ["Supplements", "Equipment", "Accessories"]

export function AddProductDialog({ onAddProduct }: AddProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState<File | null>(null)

  const [createProduct, { isLoading }] = useCreateProductMutation()

  const resetForm = () => {
    setName("")
    setPrice("")
    setCategory("")
    setImage(null)
  }

  const handleSubmit = async () => {
    if (!name || !price || !category) {
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('price', price)
      formData.append('category', category)
      
      if (image) {
        formData.append('image', image)
      }

      await createProduct(formData).unwrap()

      toast.success(`${name} added to inventory`)
      resetForm()
      setOpen(false)
      
      // Notify parent to refetch
      onAddProduct?.()
    } catch (error) {
      toast.error("Failed to add product")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {/* Product Image Upload */}
          <div className="flex flex-col gap-2">
            <Label>Product Image</Label>
            <div className="flex justify-center">
              <ImageUpload
                value={image}
                onChange={setImage}
                onRemove={() => setImage(null)}
                className="w-full max-w-[200px]"
                previewClassName="aspect-square object-cover"
              />
            </div>
          </div>

          {/* Product Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary border-[#3a3a3a]"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-secondary border-[#3a3a3a]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Price (LKR)</Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-secondary border-[#3a3a3a]"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)} 
            className="flex-1 bg-transparent border-[#3a3a3a]"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!name || !price || !category || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Product"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
