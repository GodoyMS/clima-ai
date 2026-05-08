"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  color?: string
  trend?: "up" | "down"
  trendLabel?: string
  className?: string
}

export function StatCard({
  label,
  value,
  icon,
  color = "#0c365c",
  trend,
  trendLabel,
  className,
}: StatCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown
  const trendColor = trend === "up" ? "text-emerald-600" : "text-red-500"

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {icon && (
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-gray-500">{label}</p>
        <p className="mt-0.5 text-xl font-bold text-gray-900">{value}</p>
      </div>
      {trend && trendLabel && (
        <div className={cn("flex flex-shrink-0 items-center gap-1 text-xs font-semibold", trendColor)}>
          <TrendIcon className="h-3.5 w-3.5" />
          {trendLabel}
        </div>
      )}
    </div>
  )
}
