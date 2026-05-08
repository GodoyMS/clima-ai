"use client"

import { cn } from "@/lib/utils"

type RiskLevel = "low" | "medium" | "high" | "critical"

interface RiskBadgeProps {
  level: RiskLevel
  className?: string
  showDot?: boolean
}

const config: Record<RiskLevel, { label: string; classes: string; dot: string }> = {
  low: {
    label: "Bajo",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  medium: {
    label: "Medio",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  high: {
    label: "Alto",
    classes: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
  critical: {
    label: "Crítico",
    classes: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
}

export function RiskBadge({ level, className, showDot = true }: RiskBadgeProps) {
  const { label, classes, dot } = config[level]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        classes,
        className
      )}
    >
      {showDot && <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />}
      {label}
    </span>
  )
}
