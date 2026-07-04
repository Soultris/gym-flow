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
import { Plus, Banknote, CreditCard, RotateCw, Package, ShoppingBag, Loader2, CheckCircle2, Printer } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGetMembersQuery } from "@/store/api/membersApi"
import { useGetPackagesQuery } from "@/store/api/packagesApi"
import { useGetTrainersQuery } from "@/store/api/trainersApi"
import { useCreateTransactionMutation, type Transaction } from "@/store/api/transactionsApi"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/errorUtils"
import { createPortal } from "react-dom"
import { useAppSelector } from "@/store/hooks"

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
  defaultPackageId?: string
  openByDefault?: boolean
  onOpenChange?: (open: boolean) => void
  cartItems?: CartItem[]
  cartTotal?: number
  onSuccess?: () => void
}

export function NewTransactionDialog({ 
  memberId,
  // memberName is kept for potential future use
  triggerStyle = "button",
  defaultTransactionType = "",
  defaultPackageId = "",
  openByDefault = false,
  onOpenChange,
  cartItems = [],
  cartTotal = 0,
  onSuccess
}: NewTransactionDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(openByDefault)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash")
  const [member, setMember] = useState(memberId || "")
  const [transactionType, setTransactionType] = useState(defaultTransactionType)
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedPackageId, setSelectedPackageId] = useState(defaultPackageId)
  const [selectedTrainerId, setSelectedTrainerId] = useState("")
  
  // Guest fields
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  
  // Receipt settings
  const [sendReceipt, setSendReceipt] = useState(true)

  // Success print & Cashier user selector
  const [successData, setSuccessData] = useState<Transaction | null>(null)
  const user = useAppSelector((state) => state.auth.user)

  // API hooks
  const { data: membersData } = useGetMembersQuery({ limit: 1000 })
  const { data: packages = [] } = useGetPackagesQuery()
  const { data: trainersData } = useGetTrainersQuery()
  const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation()

  const members = membersData?.members || []
  const trainers = trainersData?.trainers || []
  const approvedTrainers = trainers.filter(t => !t.isPending)

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

  // Auto-set amount when package is selected
  useEffect(() => {
    if (transactionType === "membership" && selectedPackageId) {
      const pkg = packages.find(p => p.packageId.toString() === selectedPackageId)
      if (pkg) {
        setAmount(pkg.price.toString())
      }
    }
  }, [selectedPackageId, transactionType, packages])

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
      setSendReceipt(true)
      setSelectedPackageId("")
      setSelectedTrainerId("")
      setSuccessData(null)
    }
  }

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!transactionType) {
        toast.error("Please select a transaction type")
        return
      }
      if (!amount || parseFloat(amount) <= 0) {
        toast.error("Please enter a valid amount")
        return
      }
      if (member !== "guest" && !member) {
        toast.error("Please select a member")
        return
      }
      if (member === "guest" && !guestName) {
        toast.error("Please enter guest name")
        return
      }

      const isGuest = member === "guest"
      const memberId = isGuest ? undefined : parseInt(member, 10)

      const fullTx = await createTransaction({
        isGuest,
        memberId,
        guestName: isGuest ? guestName : undefined,
        guestEmail: isGuest ? guestEmail : undefined,
        guestPhone: isGuest ? guestPhone : undefined,
        transactionType: transactionType as 'membership' | 'personal_training' | 'merchandise',
        packageId: transactionType === "membership" && selectedPackageId ? parseInt(selectedPackageId, 10) : undefined,
        trainerId: transactionType === "personal_training" && selectedTrainerId ? parseInt(selectedTrainerId, 10) : undefined,
        price: parseFloat(amount),
        paymentMethod,
        sendReceipt,
        products: transactionType === "merchandise" && cartItems.length > 0 
          ? cartItems.map(item => ({ 
              productId: parseInt(item.product.id, 10), 
              quantity: item.quantity 
            }))
          : undefined,
      }).unwrap()

      toast.success("Transaction created successfully")
      setSuccessData(fullTx)
      onSuccess?.()
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create transaction"))
      console.error("Transaction error:", error)
    }
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
        {successData ? (
          <div className="flex flex-col items-center text-center gap-6 py-6 animate-in fade-in duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Transaction Successful!</h3>
              <p className="text-sm text-muted-foreground">The transaction has been processed successfully.</p>
            </div>

            <div className="w-full bg-secondary/35 border border-[#3a3a3a] rounded-lg p-4 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Receipt No:</span>
                <span className="font-semibold text-foreground">TXN-{successData.transactionId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium text-foreground text-right truncate max-w-[200px]">
                  {successData.isGuest ? successData.guestName : successData.member?.name || "Member"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium text-foreground uppercase">{successData.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-[#3a3a3a] pt-3">
                <span className="text-muted-foreground font-medium">Total Paid:</span>
                <span className="font-bold text-primary">LKR {successData.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="flex-1 bg-transparent border-[#3a3a3a]"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.print()
                  }
                }}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold"
              >
                <Printer className="h-4 w-4" />
                Print Receipt
              </Button>
            </div>
          </div>
        ) : (
          <>
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
                      <SelectItem key={m.memberId} value={m.memberId.toString()}>
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
                <Select value={transactionType} onValueChange={(value) => {
                  setTransactionType(value)
                  setAmount("")
                  setSelectedPackageId("")
                  setSelectedTrainerId("")
                }}>
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

              {/* Package Selection - shown for membership transactions */}
              {transactionType === "membership" && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="package">Select Package</Label>
                  <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
                    <SelectTrigger className="bg-secondary border-[#3a3a3a]">
                      <SelectValue placeholder="Choose a package" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg.packageId} value={pkg.packageId.toString()}>
                          {pkg.name} - LKR {pkg.price.toLocaleString()} ({pkg.duration} {pkg.durationType})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Trainer Selection - shown for personal training transactions */}
              {transactionType === "personal_training" && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="trainer">Select Trainer</Label>
                  <Select value={selectedTrainerId} onValueChange={setSelectedTrainerId}>
                    <SelectTrigger className="bg-secondary border-[#3a3a3a]">
                      <SelectValue placeholder="Choose a trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvedTrainers.map((trainer) => (
                        <SelectItem key={trainer.trainerId} value={trainer.trainerId.toString()}>
                          {trainer.name} - {trainer.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

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
                    readOnly={transactionType === "membership" && !!selectedPackageId}
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
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex flex-col">
                  <Label htmlFor="sendReceipt">Send Receipt</Label>
                  <span className="text-xs text-muted-foreground">Send receipt via SMS</span>
                </div>
                <Switch
                  id="sendReceipt"
                  checked={sendReceipt}
                  onCheckedChange={setSendReceipt}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleOpenChange(false)} 
                className="flex-1 bg-transparent border-[#3a3a3a]"
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Process Transaction"
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {successData && typeof document !== "undefined" && createPortal(
          <POSReceiptPrint
            transaction={successData}
            gymName={user?.gymName || "GymFlow"}
            gymSubdomain={typeof window !== "undefined" ? window.location.hostname.split(".")[0] : ""}
            cashierName={user?.name || "Cashier"}
          />,
          document.body
        )}
      </DialogContent>
    </Dialog>
  )
}

interface POSReceiptPrintProps {
  transaction: Transaction
  gymName: string
  gymSubdomain: string
  cashierName: string
}

function POSReceiptPrint({ transaction, gymName, gymSubdomain, cashierName }: POSReceiptPrintProps) {
  return (
    <div id="pos-receipt-print" className="hidden">
      <style>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
          body > *:not(#pos-receipt-print) {
            display: none !important;
          }
          #pos-receipt-print {
            display: block !important;
            width: 100%;
            max-width: 80mm;
            margin: 0 auto;
            padding: 10px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 11px;
            color: black !important;
            background: white !important;
            line-height: 1.3;
            box-sizing: border-box;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 10px;
          }
          .receipt-title {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            margin: 4px 0;
          }
          .receipt-divider {
            border-top: 1px dashed black;
            margin: 6px 0;
          }
          .receipt-row {
            display: flex;
            justify-content: space-between;
            margin: 2px 0;
          }
          .receipt-total {
            font-size: 13px;
            font-weight: bold;
            margin-top: 4px;
          }
          .receipt-footer {
            text-align: center;
            margin-top: 12px;
            font-size: 9px;
          }
        }
      `}</style>
      <div className="receipt-header">
        <div className="receipt-title">{gymName}</div>
        <div>{gymSubdomain ? `${gymSubdomain}.gymflow.com` : "GymFlow Portal"}</div>
        <div className="receipt-divider" />
        <div className="receipt-row">
          <span>Receipt No:</span>
          <span>TXN-{transaction.transactionId}</span>
        </div>
        <div className="receipt-row">
          <span>Date:</span>
          <span>{new Date(transaction.paidAt || Date.now()).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short"
          })}</span>
        </div>
        <div className="receipt-row">
          <span>Cashier:</span>
          <span>{cashierName}</span>
        </div>
      </div>
      <div className="receipt-divider" />
      <div className="receipt-row">
        <span>Customer:</span>
        <span>{transaction.isGuest ? transaction.guestName : transaction.member?.name || "Member"}</span>
      </div>
      {transaction.isGuest && transaction.guestPhone && (
        <div className="receipt-row">
          <span>Phone:</span>
          <span>{transaction.guestPhone}</span>
        </div>
      )}
      <div className="receipt-row">
        <span>Type:</span>
        <span style={{ textTransform: "capitalize" }}>{transaction.transactionType.replace("_", " ")}</span>
      </div>
      <div className="receipt-divider" />
      <div>
        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Items:</div>
        {transaction.transactionType === "membership" && transaction.package && (
          <div className="receipt-row">
            <span>{transaction.package.name} Package</span>
            <span>LKR {transaction.package.price.toLocaleString()}</span>
          </div>
        )}
        {transaction.transactionType === "personal_training" && transaction.trainer && (
          <div className="receipt-row">
            <span>PT Sessions - {transaction.trainer.name}</span>
            <span>LKR {transaction.price.toLocaleString()}</span>
          </div>
        )}
        {transaction.transactionType === "merchandise" && transaction.products && transaction.products.map((item, idx) => (
          <div key={idx} style={{ marginBottom: "5px" }}>
            <div className="receipt-row">
              <span>{item.product?.name || "Product"}</span>
              <span>LKR {((item.product?.price || 0) * item.quantity).toLocaleString()}</span>
            </div>
            <div style={{ fontSize: "10px", paddingLeft: "10px" }}>
              {item.quantity} x LKR {(item.product?.price || 0).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <div className="receipt-divider" />
      <div className="receipt-row receipt-total">
        <span>TOTAL:</span>
        <span>LKR {transaction.price.toLocaleString()}</span>
      </div>
      <div className="receipt-row">
        <span>Payment Method:</span>
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>{transaction.paymentMethod}</span>
      </div>
      <div className="receipt-divider" />
      <div className="receipt-footer">
        <div>Thank you for your visit!</div>
        <div style={{ marginTop: "5px", fontStyle: "italic" }}>Powering your fitness journey.</div>
      </div>
    </div>
  )
}
