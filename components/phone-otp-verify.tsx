"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSendOtpMutation, useVerifyOtpMutation } from "@/store/api/otpApi"
import { CheckCircle2, Loader2, Phone, RotateCcw } from "lucide-react"
import toast from "react-hot-toast"

interface PhoneOtpVerifyProps {
  phone: string
  type: "member" | "trainer"
  id: number
  phoneVerified?: boolean
  onVerified?: () => void
}

export function PhoneOtpVerify({
  phone,
  type,
  id,
  phoneVerified = false,
  onVerified,
}: PhoneOtpVerifyProps) {
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState("")
  const [verified, setVerified] = useState(phoneVerified)
  const [cooldown, setCooldown] = useState(0)

  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation()
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()

  // Sync external prop
  useEffect(() => {
    setVerified(phoneVerified)
  }, [phoneVerified])

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleSendOtp = useCallback(async () => {
    if (!phone) {
      toast.error("Phone number is required")
      return
    }
    try {
      await sendOtp({ phone, type, id }).unwrap()
      toast.success("OTP sent to " + phone)
      setShowOtpInput(true)
      setCooldown(20)
      setOtp("")
    } catch (err: unknown) {
      const error = err as { data?: { error?: string; retryAfter?: number } }
      const msg = error?.data?.error || "Failed to send OTP"
      if (error?.data?.retryAfter) {
        setCooldown(error.data.retryAfter)
      }
      toast.error(msg)
    }
  }, [phone, type, id, sendOtp])

  const handleVerify = useCallback(async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP")
      return
    }
    try {
      const result = await verifyOtp({ phone, type, id, otp }).unwrap()
      if (result.verified) {
        setVerified(true)
        setShowOtpInput(false)
        toast.success("Phone number verified!")
        onVerified?.()
      }
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } }
      toast.error(error?.data?.error || "Verification failed")
    }
  }, [otp, phone, type, id, verifyOtp, onVerified])

  // Already verified
  if (verified) {
    return (
      <div className="flex items-center gap-2 mt-1">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <span className="text-sm text-green-500 font-medium">Verified</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {!showOtpInput ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSendOtp}
          disabled={isSending || !phone}
          className="gap-2 border-primary text-primary hover:bg-primary/10 mt-1"
        >
          {isSending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Phone className="h-3.5 w-3.5" />
          )}
          Verify Phone
        </Button>
      ) : (
        <div className="flex flex-col gap-2 mt-1">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6)
                setOtp(val)
              }}
              className="w-36 bg-secondary border-[#3a3a3a] text-sm"
              maxLength={6}
            />
            <Button
              type="button"
              size="sm"
              onClick={handleVerify}
              disabled={isVerifying || otp.length !== 6}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isVerifying ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {cooldown > 0 ? (
              <span className="text-xs text-muted-foreground">
                Resend in {cooldown}s
              </span>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSendOtp}
                disabled={isSending}
                className="gap-1.5 text-xs text-primary hover:text-primary/80 h-auto p-0"
              >
                <RotateCcw className="h-3 w-3" />
                Resend OTP
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
