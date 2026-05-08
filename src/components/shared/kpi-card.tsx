"use client"

import { motion } from "framer-motion"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedCounter } from "./animated-counter"
import { SkeletonCard } from "./skeleton-card"

interface KpiCardProps {
  title: string
  value: string | number
  previousValue?: number
  unit?: string
  trend?: "up" | "down" | "stable"
  trendValue?: number
  icon: React.ReactNode
  color?: string
  loading?: boolean
  description?: string
  className?: string
}

const trendConfig = {
  up: {
    Icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    label: "Subida",
  },
  down: {
    Icon: TrendingDown,
    color: "text-red-500",
    bg: "bg-red-50",
    label: "Bajada",
  },
  stable: {
    Icon: Minus,
    color: "text-gray-400",
    bg: "bg-gray-50",
    label: "Estable",
  },
}

export function KpiCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  color = "#0c365c",
  loading = false,
  description,
  className,
}: KpiCardProps) {
  if (loading) return <SkeletonCard className={className} />

  const isNumeric = typeof value === "number"
  const trendCfg = trend ? trendConfig[trend] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {/* Subtle background gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ background: `radial-gradient(ellipse at top right, ${color}, transparent 70%)` }}
      />

      <div className="relative flex items-start justify-between gap-4">
        {/* Icon */}
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>

        {/* Trend badge */}
        {trendCfg && trendValue !== undefined && (
          <div className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", trendCfg.bg, trendCfg.color)}>
            <trendCfg.Icon className="h-3.5 w-3.5" />
            {trendValue > 0 ? "+" : ""}
            {trendValue}
            {unit ?? ""}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-4">
        <div className="flex items-end gap-1.5">
          <span className="text-3xl font-bold tracking-tight text-gray-900">
            {isNumeric ? (
              <AnimatedCounter value={value as number} />
            ) : (
              value
            )}
          </span>
          {unit && <span className="mb-0.5 text-sm font-medium text-gray-400">{unit}</span>}
        </div>

        <p className="mt-1 text-sm font-medium text-gray-500">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-gray-400">{description}</p>
        )}
      </div>
    </motion.div>
  )
}
