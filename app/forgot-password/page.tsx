"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, KeyRound, Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForgotPasswordMutation, useResetPasswordMutation } from "@/store/api/authApi"
import toast from "react-hot-toast"
import { SplitScreenLayout } from "@/components/auth/split-screen-layout"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState("")
  const [phoneMasked, setPhoneMasked] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation()
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()

  const getSubdomain = () => {
    // Basic logic to get subdomain from hostname or default to 'dev' for localhost
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return 'dev';
    return hostname.split('.')[0];
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return;

    try {
      const subdomain = getSubdomain();
      const response = await forgotPassword({ email, subdomain }).unwrap()
      setPhoneMasked(response.phoneMasked || "")
      toast.success(response.message || "OTP sent successfully")
      setStep(2)
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to send OTP. Please check your email.")
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return;
    }

    try {
      const subdomain = getSubdomain();
      await resetPassword({ 
        email, 
        otp, 
        newPassword,
        subdomain 
      }).unwrap()
      
      toast.success("Password reset successfully! Please login.")
      router.push("/login")
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to reset password")
    }
  }

  return (
    <SplitScreenLayout
      title="Reset Password"
      subtitle={step === 1 ? "Enter your email to receive a verification code." : "Enter the code sent to your mobile and your new password."}
      image="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop"
      backLink="/login"
    >
      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@gym.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required 
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
            disabled={isSendingOtp}
          >
            {isSendingOtp ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Code...
              </>
            ) : (
              "Send Verification Code"
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg text-sm text-center mb-6">
             Code sent to: <span className="font-medium">{phoneMasked || "your mobile number"}</span>
             <br/>
             <button type="button" onClick={() => setStep(1)} className="text-primary hover:underline mt-1">
                 Change Email
             </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="relative">
                <Input 
                  id="otp" 
                  type="text" 
                  placeholder="123456" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="pl-10 tracking-widest"
                  required 
                />
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input 
                  id="newPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10"
                  required 
                  minLength={6}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required 
                  minLength={6}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
            disabled={isResetting}
          >
            {isResetting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      )}
    </SplitScreenLayout>
  )
}
