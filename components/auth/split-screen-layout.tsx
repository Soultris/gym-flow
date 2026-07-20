"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface SplitScreenLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  image?: string
  backLink?: string | null
  backLabel?: string
}

import { useState } from "react"
import { useGetGymBySubdomainQuery } from "@/store/api/gymApi"

export function SplitScreenLayout({
  children,
  title,
  subtitle,
  image = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop", // Default gym image
  backLink = "/login",
  backLabel = "Back to Login"
}: SplitScreenLayoutProps) {
  const [subdomain] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      // Default to 'dev' on localhost to match dashboard behavior
      if (hostname === 'localhost') {
        return 'dev'
      }

      const parts = hostname.split('.')
      if (parts.length > 1 && parts[0] !== 'www') {
          return parts[0]
      }
    }
    return ""
  })

  // No setSubdomain needed if we only set it on mount.


  const { data: gym } = useGetGymBySubdomainQuery(subdomain, { skip: !subdomain })

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Side - Image */}
      <div className="hidden lg:block relative h-screen sticky top-0 bg-muted overflow-hidden">
        <Image
          src={image}
          alt="Gym background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            {gym?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={gym.logoUrl} 
                alt={gym.name} 
                className="h-12 w-12 rounded-lg object-contain bg-white/10 backdrop-blur-sm p-1" 
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-bold text-black">sf</span>
              </div>
            )}
            <span className="text-xl font-bold">{gym?.name || "SoulFlow"}</span>
          </div>
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-lg text-white/80">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col bg-background">
        <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full lg:max-w-2xl">
            <div className="lg:hidden mb-8 text-center">
              <div className="flex justify-center mb-4">
                {gym?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={gym.logoUrl} 
                    alt={gym.name} 
                    className="h-16 w-16 object-contain" 
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                    <span className="font-bold text-black text-xl">sf</span>
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
            </div>
            
            {backLink && (
              <div className="mb-8">
                <Link 
                  href={backLink} 
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {backLabel}
                </Link>
              </div>
            )}

            {children}
            
          </div>
        </div>
      </div>
    </div>
  )
}
