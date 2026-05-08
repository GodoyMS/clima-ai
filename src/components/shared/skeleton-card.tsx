"use client"

import { cn } from "@/lib/utils"

interface SkeletonCardProps {
  rows?: number
  height?: string
  className?: string
  showHeader?: boolean
}

function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
}

export function SkeletonCard({
  rows = 3,
  height,
  className,
  showHeader = true,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm",
        className
      )}
      style={height ? { height } : undefined}
    >
      {showHeader && (
        <div className="mb-5 flex items-center gap-3">
          <SkeletonLine className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <SkeletonLine className="h-4 w-2/5" />
            <SkeletonLine className="h-3 w-1/4" />
          </div>
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonLine
            key={i}
            className={cn("h-3", i === rows - 1 ? "w-3/4" : "w-full")}
          />
        ))}
      </div>
    </div>
  )
}
