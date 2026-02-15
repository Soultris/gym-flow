"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLoginMutation } from "@/store/api/authApi"
import { useAppDispatch } from "@/store/hooks"
import { setCredentials } from "@/store/slices/authSlice"
import toast from "react-hot-toast"
import { SplitScreenLayout } from "@/components/auth/split-screen-layout"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await login({ email, password }).unwrap()
      dispatch(setCredentials({ user: response.user, token: response.token }))
      toast.success("Login successful!")
      
      if (response.user.role?.name === 'Superadmin') {
        router.push("/admin/gyms")
      } else {
        router.push("/dashboard")
      }
    } catch (error: unknown) {
      const err = error as { data?: { error?: string } }
      toast.error(err?.data?.error || "Invalid email or password")
    }
  }

  return (
    <SplitScreenLayout
      title="Access Dashboard"
      subtitle="Sign in to manage your gym operations, members, and trainers efficiently."
      image="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
      backLink={null}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email or Username</Label>
            <div className="relative">
              <Input 
                id="email" 
                type="text" 
                placeholder="admin@gym.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required 
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required 
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-center text-sm text-muted-foreground mb-4">
          Want to join as a trainer?
        </p>
        <Link href="/trainer-signup">
          <Button variant="outline" className="w-full h-11">
            Signup as Trainer
          </Button>
        </Link>
      </div>
    </SplitScreenLayout>
  )
}
