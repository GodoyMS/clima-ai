"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MobileHeaderProps {
  title: string
  showBack?: boolean
  rightAction?: ReactNode
  className?: string
  transparent?: boolean
}

export function MobileHeader({
  title,
  showBack = false,
  rightAction,
  className,
  transparent = false,
}: MobileHeaderProps) {
  const router = useRouter()

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between px-4 h-14",
        transparent
          ? "bg-transparent"
          : "bg-white border-b border-gray-100",
        className
      )}
    >
      <div className="w-10 flex items-center justify-start">
        {showBack && (
          <motion.button
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </motion.button>
        )}
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-gray-900 tracking-tight"
      >
        {title}
      </motion.h1>

      <div className="w-10 flex items-center justify-end">
        {rightAction}
      </div>
    </header>
  )
}
