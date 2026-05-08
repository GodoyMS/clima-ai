"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

export default function EmployeePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/employee/home")
    } else {
      router.replace("/employee/login")
    }
  }, [isAuthenticated, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <LoadingSpinner size="lg" />
    </div>
  )
}
