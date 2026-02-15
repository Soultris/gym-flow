"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ReceiptPage() {
  const params = useParams()
  const router = useRouter()
  const { subdomain, transactionId } = params

  useEffect(() => {
    if (subdomain && transactionId) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const targetUrl = `${apiUrl}/receipts/${subdomain}/${transactionId}`
      window.location.href = targetUrl
    }
  }, [subdomain, transactionId])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary/30">
      <div className="bg-card p-8 rounded-lg shadow-sm border border-border flex flex-col items-center gap-4 max-w-sm w-full mx-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <div className="text-center space-y-2">
          <h1 className="text-lg font-semibold">Redirecting to Receipt</h1>
          <p className="text-sm text-muted-foreground">Please wait while we fetch your document...</p>
        </div>
      </div>
    </div>
  )
}
