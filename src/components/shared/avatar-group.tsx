"use client"

import { cn } from "@/lib/utils"

interface AvatarItem {
  name: string
  avatar?: string
}

interface AvatarGroupProps {
  avatars: AvatarItem[]
  max?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: { container: "h-7 w-7 text-xs", border: "ring-[1.5px]" },
  md: { container: "h-9 w-9 text-sm", border: "ring-2" },
  lg: { container: "h-11 w-11 text-sm", border: "ring-2" },
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function stringToColor(str: string) {
  const colors = [
    "bg-violet-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-amber-500",
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export function AvatarGroup({ avatars, max = 4, size = "md", className }: AvatarGroupProps) {
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - max

  const { container, border } = sizeMap[size]

  return (
    <div className={cn("flex items-center", className)}>
      {visible.map((av, i) => (
        <div
          key={i}
          title={av.name}
          className={cn(
            "relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full ring-white",
            container,
            border,
            i !== 0 && "-ml-2",
            !av.avatar && stringToColor(av.name),
            "text-white font-semibold"
          )}
        >
          {av.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={av.avatar} alt={av.name} className="h-full w-full object-cover" />
          ) : (
            getInitials(av.name)
          )}
        </div>
      ))}

      {overflow > 0 && (
        <div
          className={cn(
            "-ml-2 flex flex-shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-600 ring-white",
            container,
            border
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}
