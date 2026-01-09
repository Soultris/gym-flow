"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/buttons"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Banknote, CreditCard, RotateCw, Package, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"

const members = [
  { id: "M001", name: "John Smith" },
  { id: "M002", name: "Sarah Johnson" },
  { id: "M003", name: "Mike Wilson" },
  { id: "M004", name: "Emily Davis" },
  { id: "M005", name: "Chris Brown" },
  { id: "M006", name: "Jessica Martinez" },
  { id: "M007", name: "David Lee" },
]

const transactionTypes = [
  { id: "membership", name: "Membership" },
  { id: "personal_training", name: "Personal Training" },
  { id: "merchandise", name: "Merchandise" },
]

interface CartItem {
  product: {
    id: string
    name: string
    price: number
  }
  quantity: number
}

interface NewTransactionDialogProps {
  memberId?: string
  memberName?: string
  triggerStyle?: "button" | "renew" | "hidden"
  defaultTransactionType?: string
  openByDefault?: boolean
  onOpenChange?: (open: boolean) => void
  cartItems?: CartItem[]
  cartTotal?: number
}

export function NewTransactionDialog({ 
  memberId,
  // memberName is kept for potential future use
  triggerStyle = "button",
  defaultTransactionType = "",
  openByDefault = false,
  onOpenChange,
  cartItems = [],
  cartTotal = 0
}: NewTransactionDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(openByDefault)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash")
  const [member, setMember] = useState(memberId || "")
  const [transactionType, setTransactionType] = useState(defaultTransactionType)
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")
  
  // Guest fields
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  
  // Receipt settings
  const [sendReceipt, setSendReceipt] = useState(false)
  const [receiptMethod, setReceiptMethod] = useState<"sms" | "email">("sms")

  // Sync open state with openByDefault prop
  useEffect(() => {
    setOpen(openByDefault)
  }, [openByDefault])

  // Set amount from cart total when merchandise is selected
  useEffect(() => {
    if (transactionType === "merchandise" && cartTotal > 0) {
      setAmount(cartTotal.toString())
    }
  }, [transactionType, cartTotal])

  // Handle external open state changes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
    if (!newOpen) {
      // Reset form when closing
      setMember(memberId || "")
      setTransactionType(defaultTransactionType)
      setAmount("")
      setPaymentMethod("cash")
      setNotes("")
      setGuestName("")
      setGuestEmail("")
      setGuestPhone("")
      setSendReceipt(false)
      setReceiptMethod("sms")
    }
  }

  const handleSubmit = () => {
    // Process transaction logic here
    console.log({ 
      member, 
      transactionType, 
      amount, 
      paymentMethod, 
      notes, 
      cartItems,
      guestName: member === "guest" ? guestName : undefined,
      guestEmail: member === "guest" ? guestEmail : undefined,
      guestPhone: member === "guest" ? guestPhone : undefined,
      sendReceipt,
      receiptMethod: sendReceipt ? receiptMethod : undefined
    })
    handleOpenChange(false)
  }

  const getItemPrice = (item: CartItem) => item.product.price

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {triggerStyle !== "hidden" && (
        <DialogTrigger asChild>
          {triggerStyle === "renew" ? (
            <Button size="sm" className="gap-2 bg-primary text-secondary font-semibold hover:bg-primary/80">
              <RotateCw className="h-4 w-4" />
              Renew
            </Button>
          ) : (
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              New Transaction
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md bg-card border-border max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
          <DialogDescription>
            Process a payment or transaction for a member
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {/* Select Member */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="member">Select Member</Label>
            <Select value={member} onValueChange={setMember}>
              <SelectTrigger className="bg-secondary border-[#3a3a3a]">
                <SelectValue placeholder="Choose a member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guest">Guest</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Guest Fields - shown when Guest is selected */}
          {member === "guest" && (
            <div className="flex flex-col gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="flex flex-col gap-2">
                <Label htmlFor="guestName">Name</Label>
                <Input
                  id="guestName"
                  placeholder="Enter guest name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="bg-secondary border-[#3a3a3a]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="guestEmail">Email</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  placeholder="Enter guest email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="bg-secondary border-[#3a3a3a]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="guestPhone">Phone Number</Label>
                <Input
                  id="guestPhone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="bg-secondary border-[#3a3a3a]"
                />
              </div>
            </div>
          )}

          {/* Transaction Type */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Transaction Type</Label>
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger className="bg-secondary border-[#3a3a3a]">
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Merchandise Items Display */}
          {transactionType === "merchandise" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label>Items</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 text-xs"
                  onClick={() => {
                    handleOpenChange(false)
                    router.push("/inventory")
                  }}
                >
                  <ShoppingBag className="h-3 w-3" />
                  Add Items
                </Button>
              </div>
              
              {cartItems.length > 0 ? (
                <div className="bg-secondary rounded-lg p-3 space-y-2 max-h-32 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{item.product.name}</span>
                        <span className="text-muted-foreground">x{item.quantity}</span>
                      </div>
                      <span className="font-medium">
                        LKR {(getItemPrice(item) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-secondary rounded-lg p-4 text-center text-sm text-muted-foreground">
                  No items added. Click &quot;Add Items&quot; to browse inventory.
                </div>
              )}
            </div>
          )}

          {/* Amount */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">LKR</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-12 bg-secondary border-[#3a3a3a]"
                readOnly={transactionType === "merchandise" && cartItems.length > 0}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-2">
            <Label>Payment Method</Label>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                  paymentMethod === "cash"
                    ? "border-primary bg-primary/10"
                    : "border-[#3a3a3a] bg-secondary"
                }`}
              >
                <div className={`p-2 rounded-md ${paymentMethod === "cash" ? "bg-primary" : "bg-muted"}`}>
                  <Banknote className={`h-4 w-4 ${paymentMethod === "cash" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">Cash</p>
                  <p className="text-xs text-muted-foreground">Physical currency payment</p>
                </div>
                <div className={`h-4 w-4 rounded-full border-2 ${
                  paymentMethod === "cash" ? "border-primary bg-primary" : "border-muted-foreground"
                }`}>
                  {paymentMethod === "cash" && (
                    <div className="h-full w-full rounded-full bg-primary-foreground scale-50" />
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/10"
                    : "border-[#3a3a3a] bg-secondary"
                }`}
              >
                <div className={`p-2 rounded-md ${paymentMethod === "card" ? "bg-primary" : "bg-muted"}`}>
                  <CreditCard className={`h-4 w-4 ${paymentMethod === "card" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">Card</p>
                  <p className="text-xs text-muted-foreground">Credit or debit card</p>
                </div>
                <div className={`h-4 w-4 rounded-full border-2 ${
                  paymentMethod === "card" ? "border-primary bg-primary" : "border-muted-foreground"
                }`}>
                  {paymentMethod === "card" && (
                    <div className="h-full w-full rounded-full bg-primary-foreground scale-50" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes about this transaction"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-secondary border-[#3a3a3a]"
            />
          </div>

          {/* Send Receipt Toggle */}
          <div className="flex flex-col gap-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <Label htmlFor="sendReceipt">Send Receipt</Label>
              <Switch
                id="sendReceipt"
                checked={sendReceipt}
                onCheckedChange={setSendReceipt}
              />
            </div>

            {/* Receipt Method - shown when Send Receipt is enabled */}
            {sendReceipt && (
              <div className="flex gap-4 pl-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="receiptMethod"
                    value="sms"
                    checked={receiptMethod === "sms"}
                    onChange={() => setReceiptMethod("sms")}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="text-sm">SMS</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="receiptMethod"
                    value="email"
                    checked={receiptMethod === "email"}
                    onChange={() => setReceiptMethod("email")}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="text-sm">Email</span>
                </label>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)} className="flex-1 bg-transparent border-[#3a3a3a]">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            Process Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
