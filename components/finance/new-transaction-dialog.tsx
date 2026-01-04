"use client"

import { useState } from "react"
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
import { Plus, Banknote, CreditCard, RotateCw } from "lucide-react"

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
  { id: "membership", name: "Membership Fee" },
  { id: "personal_training", name: "Personal Training" },
  { id: "merchandise", name: "Merchandise" },
  { id: "supplement", name: "Supplement" },
  { id: "other", name: "Other" },
]

interface NewTransactionDialogProps {
  memberId?: string
  memberName?: string
  triggerStyle?: "button" | "renew" | "hidden"
  defaultTransactionType?: string
  openByDefault?: boolean
  onOpenChange?: (open: boolean) => void
}

export function NewTransactionDialog({ 
  memberId, 
  memberName, 
  triggerStyle = "button",
  defaultTransactionType = "",
  openByDefault = false,
  onOpenChange
}: NewTransactionDialogProps) {
  const [open, setOpen] = useState(openByDefault)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash")
  const [member, setMember] = useState(memberId || "")
  const [transactionType, setTransactionType] = useState(defaultTransactionType)
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")

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
    }
  }

  const handleSubmit = () => {
    // Process transaction logic here
    console.log({ member, transactionType, amount, paymentMethod, notes })
    handleOpenChange(false)
  }

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
      <DialogContent className="sm:max-w-md bg-card border-border" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
          <DialogDescription>
            Process a payment or transaction for a member or staff
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
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          {/* Amount */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 bg-secondary border-[#3a3a3a]"
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
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 bg-transparent border-[#3a3a3a]">
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
