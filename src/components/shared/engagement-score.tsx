"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface EngagementScoreProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

const sizeMap = {
  sm: { dim: 56, stroke: 5, textSize: "text-sm", labelSize: "text-[9px]" },
  md: { dim: 80, stroke: 7, textSize: "text-lg", labelSize: "text-[10px]" },
  lg: { dim: 112, stroke: 9, textSize: "text-2xl", labelSize: "text-xs" },
}

function getScoreColor(score: number) {
  if (score < 40) return "#ef4444"
  if (score < 70) return "#f59e0b"
  return "#10b981"
}

export function EngagementScore({
  score,
  size = "md",
  showLabel = true,
  className,
}: EngagementScoreProps) {
  const { dim, stroke, textSize, labelSize } = sizeMap[size]
  const radius = (dim - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, score))
  const color = getScoreColor(clamped)
  const dashOffset = circumference * (1 - clamped / 100)

  return (
    <div className={cn("relative inline-flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg
          width={dim}
          height={dim}
          viewBox={`0 0 ${dim} ${dim}`}
          className="-rotate-90"
          aria-label={`Puntuación de compromiso: ${clamped}`}
        >
          {/* Track */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <motion.circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold leading-none text-gray-900", textSize)}>{clamped}</span>
          {showLabel && (
            <span className={cn("font-medium text-gray-400 uppercase tracking-wider", labelSize)}>
              pts
            </span>
          )}
        </div>
      </div>

      {showLabel && (
        <span className="text-xs font-medium text-gray-500">
          {clamped < 40 ? "Bajo" : clamped < 70 ? "Medio" : "Alto"}
        </span>
      )}
    </div>
  )
}
