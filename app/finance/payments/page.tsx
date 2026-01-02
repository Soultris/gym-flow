import { DashboardLayout } from "@/components/dashboard-layout"
import { RecordPaymentForm } from "@/components/finance/record-payment-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RecordPaymentPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/finance">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Record Payment</h1>
            <p className="text-muted-foreground mt-1">Log a member payment transaction</p>
          </div>
        </div>
        <RecordPaymentForm />
      </div>
    </DashboardLayout>
  )
}
