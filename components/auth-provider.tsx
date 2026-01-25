"use client"

import { useEffect } from "react"
import { useGetMeQuery } from "@/store/api/authApi"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setUser, logout } from "@/store/slices/authSlice"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((state) => state.auth.token)
  const dispatch = useAppDispatch()
  
  // Skip query if no token
  const { data: user, error, isLoading } = useGetMeQuery(undefined, {
    skip: !token,
  })

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

  // Optional: Show loading state only if we have a token but no user yet
  // preventing flash of unauthenticated content
  if (token && isLoading) {
      return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return <>{children}</>
}
