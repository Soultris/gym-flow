"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Printer } from "lucide-react"
import { useGetTransactionsQuery, Transaction } from "@/store/api/transactionsApi"
import { useAppSelector } from "@/store/hooks"
import toast from "react-hot-toast"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function generateReceiptHTML(transaction: Transaction, logoUrl?: string | null): string {
  const memberName = transaction.member?.name || transaction.guestName || "Guest"
  const memberEmail = transaction.member?.email || transaction.guestEmail || ""
  

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt - ${transaction.transactionId}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
        }
        .receipt-container {
          max-width: 400px;
          margin: 20px auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #fff;
        }
        .receipt-header {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #000;
          padding-bottom: 15px;
          gap: 15px;
        }
        .receipt-header img {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }
        .receipt-header-text {
          text-align: left;
        }
        .receipt-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .receipt-subtitle {
          font-size: 12px;
          color: #666;
        }
        .receipt-body {
          margin: 20px 0;
        }
        .receipt-section {
          margin-bottom: 20px;
        }
        .receipt-label {
          font-weight: bold;
          font-size: 12px;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 8px;
        }
        .receipt-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .receipt-row-label {
          font-weight: 600;
        }
        .receipt-row-value {
          text-align: right;
        }
        .receipt-divider {
          border-bottom: 1px dashed #ddd;
          margin: 15px 0;
        }
        .receipt-total {
          display: flex;
          justify-content: space-between;
          font-size: 18px;
          font-weight: bold;
          margin: 15px 0;
          padding: 10px 0;
          border-top: 2px solid #000;
          border-bottom: 2px solid #000;
        }
        .receipt-footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
        }
        .receipt-id {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #999;
          text-align: center;
          margin-top: 10px;
        }
        @media print {
          body {
            background: #fff;
          }
          .receipt-container {
            border: none;
            max-width: 100%;
            margin: 0;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="receipt-header">
          ${logoUrl ? `<img src="${logoUrl}" alt="Gym Logo">` : ""}
          <div class="receipt-header-text">
            <div class="receipt-title">RECEIPT</div>
            <div class="receipt-subtitle">Transaction Receipt</div>
          </div>
        </div>

        <div class="receipt-body">
          <div class="receipt-section">
            <div class="receipt-label">Customer Details</div>
            <div class="receipt-row">
              <span class="receipt-row-label">Name:</span>
              <span class="receipt-row-value">${memberName}</span>
            </div>
            ${memberEmail ? `<div class="receipt-row">
              <span class="receipt-row-label">Email:</span>
              <span class="receipt-row-value">${memberEmail}</span>
            </div>` : ""}
            
          </div>

          <div class="receipt-divider"></div>

          <div class="receipt-section">
            <div class="receipt-label">Transaction Details</div>
            <div class="receipt-row">
              <span class="receipt-row-label">Type:</span>
              <span class="receipt-row-value">${transaction.transactionType.replace(/_/g, " ")}</span>
            </div>
            ${transaction.package ? `<div class="receipt-row">
              <span class="receipt-row-label">Package:</span>
              <span class="receipt-row-value">${transaction.package.name}</span>
            </div>` : ""}
            <div class="receipt-row">
              <span class="receipt-row-label">Payment Method:</span>
              <span class="receipt-row-value">${transaction.paymentMethod.charAt(0).toUpperCase() + transaction.paymentMethod.slice(1)}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-row-label">Date:</span>
              <span class="receipt-row-value">${formatDate(transaction.paidAt)}</span>
            </div>
          </div>

          <div class="receipt-divider"></div>

          <div class="receipt-total">
            <span>Total Amount:</span>
            <span>LKR ${transaction.price.toLocaleString()}</span>
          </div>
        </div>

        <div class="receipt-footer">
          <p>Thank you for your transaction!</p>
          <p>Please keep this receipt for your records.</p>
          <div class="receipt-id">Receipt #${transaction.transactionId}</div>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `
}

const getPackageBadgeClass = (pkg: string) => {
  switch (pkg) {
    case "Premium":
      return "bg-primary/20 text-primary border-primary/30"
    case "Staff":
      return "bg-primary/20 text-primary border-primary/30"
    case "Standard":
      return "bg-secondary/50 text-muted-foreground border-[#2a2a2a]"
    case "Basic":
      return "bg-secondary/50 text-muted-foreground border-[#2a2a2a]"
    default:
      return "bg-secondary/50 text-muted-foreground border-[#2a2a2a]"
  }
}

const handlePrintReceipt = (transaction: Transaction, logoUrl?: string | null) => {
  try {
    const receiptHTML = generateReceiptHTML(transaction, logoUrl)
    const printWindow = window.open("", "_blank")
    
    if (!printWindow) {
      toast.error("Please allow pop-ups to print receipts")
      return
    }
    
    printWindow.document.write(receiptHTML)
    printWindow.document.close()
  } catch (error) {
    console.error("Print error:", error)
    toast.error("Failed to print receipt")
  }
}

export function TransactionHistoryTable() {
  const { data, isLoading, isError } = useGetTransactionsQuery()
  const logoUrl = useAppSelector(state => state.auth.user?.gymLogoUrl)
  const transactions = data?.transactions || []

  if (isLoading) {
    return (
      <div className="border border-[#2a2a2a] rounded-lg p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading transactions...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="border border-[#2a2a2a] rounded-lg p-8 text-center text-destructive">
        Failed to load transactions
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="border border-[#2a2a2a] rounded-lg p-8 text-center text-muted-foreground">
        No transactions found
      </div>
    )
  }

  return (
    <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
            <th className="w-12 px-4 py-3">
              <Checkbox className="border-[#3a3a3a]" />
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Type</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Package</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Amount</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Payment Method</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Paid Date</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction: Transaction, index: number) => (
            <tr
              key={transaction.transactionId}
              className={`border-b border-[#2a2a2a] transition-colors ${
                index % 2 === 0 ? "bg-[#151515]" : "bg-background"
              }`}
            >
              <td className="px-4 py-4">
                <Checkbox className="border-[#3a3a3a]" />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder.svg?height=36&width=36" />
                    <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
                      {transaction.member ? getInitials(transaction.member.name) : transaction.guestName ? getInitials(transaction.guestName) : "G"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{transaction.member?.name || transaction.guestName || "Guest"}</div>
                    <div className="text-sm text-muted-foreground">{transaction.member?.email || transaction.guestEmail || ""}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge variant="outline" className="capitalize">
                  {transaction.transactionType.replace("_", " ")}
                </Badge>
              </td>
              <td className="px-4 py-4">
                {transaction.package ? (
                  <Badge variant="secondary" className={getPackageBadgeClass(transaction.package.name)}>
                    {transaction.package.name}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </td>
              <td className="px-4 py-4 text-sm font-medium">LKR {transaction.price.toLocaleString()}</td>
              <td className="px-4 py-4 text-sm text-muted-foreground capitalize">{transaction.paymentMethod}</td>
              <td className="px-4 py-4 text-sm text-muted-foreground">{formatDate(transaction.paidAt)}</td>
              <td className="px-4 py-4">
                <Button
                  onClick={() => handlePrintReceipt(transaction, logoUrl)}
                  variant="outline"
                  size="sm"
                  className="h-7 px-3 text-xs border-primary text-primary hover:bg-primary/10 gap-1"
                >
                  <Printer className="w-3 h-3" />
                  Print
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  )
}
