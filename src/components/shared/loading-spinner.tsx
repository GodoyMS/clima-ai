"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  color?: string
  className?: string
  label?: string
}

const sizeMap = {
  xs: "h-4 w-4 border-[1.5px]",
  sm: "h-6 w-6 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
  xl: "h-16 w-16 border-4",
}

export function LoadingSpinner({
  size = "md",
  color = "#0c365c",
  className,
  label,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <motion.div
        className={cn("rounded-full border-transparent", sizeMap[size])}
        style={{
          borderTopColor: color,
          borderRightColor: `${color}40`,
          borderBottomColor: `${color}20`,
          borderLeftColor: `${color}10`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.75, ease: "linear", repeat: Infinity }}
      />
      {label && (
        <p className="text-sm font-medium text-gray-500">{label}</p>
      )}
    </div>
  )
}

export function PageLoader({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="flex h-full min-h-[200px] w-full items-center justify-center">
      <LoadingSpinner size="lg" label={label} />
    </div>
  )
}
