"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function RecordPaymentForm() {
  return (
    <Card className="p-6">
      <form className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member">Select Member *</Label>
            <select
              id="member"
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
              required
            >
              <option>Search member by name or ID...</option>
              <option>John Smith (M001)</option>
              <option>Sarah Johnson (M002)</option>
              <option>Mike Wilson (M003)</option>
              <option>Emily Davis (M004)</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input id="amount" type="number" placeholder="0.00" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <select
                id="paymentMethod"
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
                required
              >
                <option>Select method</option>
                <option>Cash</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Bank Transfer</option>
                <option>UPI</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date *</Label>
              <Input id="paymentDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentFor">Payment For *</Label>
              <select
                id="paymentFor"
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
                required
              >
                <option>Select type</option>
                <option>Membership Fee</option>
                <option>Renewal</option>
                <option>Personal Training</option>
                <option>Late Fee</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID / Reference</Label>
            <Input id="transactionId" placeholder="Enter transaction reference number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Additional payment notes or remarks" rows={3} />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Record Payment
          </Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
