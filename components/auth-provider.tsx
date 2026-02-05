"use client"

import { useEffect, useState } from "react"
import { useGetMeQuery } from "@/store/api/authApi"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setUser, logout } from "@/store/slices/authSlice"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((state) => state.auth.token)
  const dispatch = useAppDispatch()
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Skip query if no token
  const { data: user, error, isLoading } = useGetMeQuery(undefined, {
    skip: !token,
  })

  // Ensure hydration is complete before showing loading state
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (user) {
      dispatch(setUser(user))
    }
  }, [user, dispatch])

  useEffect(() => {
    if (error) {
      // If fetching me fails (e.g. invalid token), logout
      dispatch(logout())
    }
  }, [error, dispatch])

  // Only show loading after hydration to avoid hydration mismatch
  if (isHydrated && token && isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return <>{children}</>
}
