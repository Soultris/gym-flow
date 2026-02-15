import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSendOtpMutation, useVerifyOtpMutation } from "@/store/api/otpApi"
import { CheckCircle2, Loader2, Phone, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import toast from "react-hot-toast"

interface PhoneOtpVerifyProps {
  phone: string
  type: "member" | "trainer"
  id: number | string
  phoneVerified?: boolean
  onVerificationComplete?: () => void
}

export function PhoneOtpVerify({
  phone,
  type,
  id,
  phoneVerified = false,
  onVerificationComplete,
}: PhoneOtpVerifyProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [otp, setOtp] = useState("")
  const [cooldown, setCooldown] = useState(0)
  const [step, setStep] = useState<"send" | "verify">("send")

  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation()
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleSendOtp = async () => {
    if (!phone) {
      toast.error("Phone number is required")
      return
    }
    try {
      await sendOtp({ phone, type, id: Number(id) }).unwrap()
      toast.success("OTP sent to " + phone)
      setStep("verify")
      setCooldown(60)
      setOtp("")
    } catch (err: unknown) {
      const error = err as { data?: { error?: string }; message?: string }
      const msg = error?.data?.error || error?.message || "Failed to send OTP"
      toast.error(msg)
    }
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP")
      return
    }
    try {
      const result = await verifyOtp({ phone, type, id: Number(id), otp }).unwrap()
      if (result.verified) {
        toast.success("Phone number verified!")
        setIsOpen(false)
        if (onVerificationComplete) onVerificationComplete()
        else window.location.reload()
      }
    } catch (err: unknown) {
       const error = err as { data?: { error?: string }; message?: string }
       const msg = error?.data?.error || error?.message || "Verification failed"
       toast.error(msg)
    }
  }

  if (phoneVerified) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Verified
      </div>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
            setIsOpen(true)
            setStep("send")
            setOtp("")
        }}
        className="h-7 text-xs gap-1.5 border-orange-500/50 text-orange-500 hover:text-orange-600 hover:bg-orange-500/10"
      >
        <XCircle className="w-3.5 h-3.5" />
        Verify Now
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Phone Verification</DialogTitle>
            <DialogDescription>
              Verify {phone} to secure the account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
             <div className="flex justify-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="h-8 w-8 text-primary" />
                </div>
             </div>

             {step === "send" ? (
                 <div className="text-center space-y-4">
                     <p className="text-sm text-muted-foreground">
                        We will send a 6-digit One Time Password (OTP) to your mobile number.
                     </p>
                     <Button onClick={handleSendOtp} disabled={isSending} className="w-full">
                        {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send OTP
                     </Button>
                 </div>
             ) : (
                 <div className="space-y-4">
                     <div className="space-y-2">
                        <Label className="text-center block">Enter 6-digit OTP</Label>
                        <Input 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            className="text-center text-2xl tracking-[0.5em] font-mono h-12"
                            placeholder="000000"
                            maxLength={6}
                        />
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Didn&apos;t receive code?</span>
                        {cooldown > 0 ? (
                            <span className="text-primary font-medium">Resend in {cooldown}s</span>
                        ) : (
                            <Button variant="link" onClick={handleSendOtp} disabled={isSending} className="p-0 h-auto text-primary">
                                Resend OTP
                            </Button>
                        )}
                     </div>
                     <Button onClick={handleVerify} disabled={isVerifying || otp.length !== 6} className="w-full bg-green-600 hover:bg-green-700">
                        {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Verify & Confirm
                     </Button>
                     <Button variant="ghost" onClick={() => setStep("send")} className="w-full h-8 text-xs text-muted-foreground">
                        Change Mobile Number?
                     </Button>
                 </div>
             )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
