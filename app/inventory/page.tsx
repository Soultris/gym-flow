"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Plus, ShoppingCart, X, Minus, Package, MoreVertical, Trash2, ArrowRight } from "lucide-react"
import { AddProductDialog } from "@/components/inventory/add-product-dialog"
import { NewTransactionDialog } from "@/components/finance/new-transaction-dialog"

export interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
  createdAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
}

// Mock product data
const initialProducts: Product[] = [
  { id: "P001", name: "Whey Protein", price: 4500, category: "Supplements", image: "/placeholder.svg?height=200&width=200", createdAt: new Date("2024-01-15") },
  { id: "P002", name: "Creatine Monohydrate", price: 2500, category: "Supplements", image: "/placeholder.svg?height=200&width=200", createdAt: new Date("2024-01-10") },
  { id: "P003", name: "Gym Gloves", price: 1200, category: "Accessories", image: "/placeholder.svg?height=200&width=200", createdAt: new Date("2024-02-01") },
  { id: "P004", name: "Resistance Bands Set", price: 1800, category: "Equipment", image: "/placeholder.svg?height=200&width=200", createdAt: new Date("2024-01-20") },
  { id: "P005", name: "Shaker Bottle", price: 800, category: "Accessories", image: "/placeholder.svg?height=200&width=200", createdAt: new Date("2024-02-05") },
  { id: "P006", name: "BCAA Powder", price: 3200, category: "Supplements", image: "/placeholder.svg?height=200&width=200", createdAt: new Date("2024-01-25") },
  { id: "P007", name: "Yoga Mat", price: 2200, category: "Equipment", image: "/placeholder.svg?height=200&width=200", createdAt: new Date("2024-02-10") },
  { id: "P008", name: "Gym Bag", price: 3500, category: "Accessories", image: "/placeholder.svg?height=200&width=200", createdAt: new Date("2024-01-05") },
  { id: "P009", name: "Pre-Workout", price: 3800, category: "Supplements", image: "/placeholder.svg?height=200&width=200", createdAt: new Date("2024-02-15") },
  { id: "P010", name: "Wrist Wraps", price: 900, category: "Accessories", image: "/placeholder.svg?height=200&width=200", createdAt: new Date("2024-02-20") },
  { id: "P011", name: "Jump Rope", price: 650, category: "Equipment", image: "/placeholder.svg?height=200&width=200", createdAt: new Date("2024-01-30") },
  { id: "P012", name: "Gym Towel", price: 500, category: "Accessories", image: "/placeholder.svg?height=200&width=200", createdAt: new Date("2024-02-25") },
]

const categories = ["All", "Supplements", "Equipment", "Accessories"]

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [sortOrder, setSortOrder] = useState("newest")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "All" || product.category === categoryFilter
      return matchesSearch && matchesCategory
    })

    // Sort
    switch (sortOrder) {
      case "newest":
        result = result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case "oldest":
        result = result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case "alphabetical":
        result = result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "price-low":
        result = result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result = result.sort((a, b) => b.price - a.price)
        break
    }

    return result
  }, [products, searchTerm, categoryFilter, sortOrder])

  // Cart functions
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleAddProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: `P${(products.length + 1).toString().padStart(3, "0")}`,
      createdAt: new Date(),
    }
    setProducts((prev) => [newProduct, ...prev])
  }

  const handleProceedToPayment = () => {
    setShowTransactionDialog(true)
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId))
    // Also remove from cart if present
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  return (
    <DashboardLayout>
      <div className="flex gap-6">
        {/* Main Content */}
        <div className={`flex-1 space-y-6 ${cart.length > 0 ? "lg:pr-80" : ""}`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold">Inventory</h1>
              <p className="text-sm text-muted-foreground">Manage products and merchandise</p>
            </div>
            <AddProductDialog onAddProduct={handleAddProduct} />
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-wrap items-end gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="search" className="mb-2 block text-sm">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-secondary border-[#3a3a3a]"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <Label htmlFor="category" className="mb-2 block text-sm">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category" className="bg-secondary border-[#3a3a3a] w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <Label htmlFor="sort" className="mb-2 block text-sm">Sort By</Label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger id="sort" className="bg-secondary border-[#3a3a3a] w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Products Count */}
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          </p>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden group relative">
                {/* 3-dot Menu - appears on hover or when open */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 z-10 h-8 w-8 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Product
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Product Image */}
                <div className="aspect-square bg-secondary/50 flex items-center justify-center p-4">
                  <Package className="h-16 w-16 text-muted-foreground" />
                </div>

                {/* Product Info */}
                <div className="p-3 space-y-2">
                  <h3 className="font-medium text-sm truncate">{product.name}</h3>
                  <span className="text-sm font-bold">
                    LKR {product.price.toLocaleString()}
                  </span>
                  <Button
                    size="sm"
                    className="w-full gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="h-3 w-3" />
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No products found matching your criteria.
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        {cart.length > 0 && (
          <div className="hidden lg:block fixed right-0 top-0 h-full w-80 bg-card border-l border-border p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pt-16">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <h2 className="font-semibold">Cart ({cartItemCount})</h2>
              </div>
            </div>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 pb-4 border-b border-border">
                  <div className="h-12 w-12 bg-secondary rounded flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      LKR {item.product.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.product.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.product.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-auto text-destructive"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-between text-lg font-semibold mb-4">
                <span>Total:</span>
                <span>LKR {cartTotal.toLocaleString()}</span>
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        )}

        {/* Mobile Cart Button */}
        {cart.length > 0 && (
          <div className="lg:hidden fixed bottom-4 right-4 group">
            <Button
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 relative"
              onClick={handleProceedToPayment}
            >
              <ArrowRight className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                {cartItemCount}
              </span>
            </Button>
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Proceed to Payment
            </div>
          </div>
        )}

        {/* Transaction Dialog */}
        <NewTransactionDialog
          triggerStyle="hidden"
          openByDefault={showTransactionDialog}
          onOpenChange={setShowTransactionDialog}
          defaultTransactionType="merchandise"
          cartItems={cart}
          cartTotal={cartTotal}
        />
      </div>
    </DashboardLayout>
  )
}
