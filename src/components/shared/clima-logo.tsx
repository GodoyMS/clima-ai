"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

const WIDTH = 1024
const HEIGHT = 615

const sizeClass = {
  "2xs": "h-4 max-h-4",
  xs: "h-5 max-h-5",
  sm: "h-7 max-h-7",
  md: "h-9 max-h-9",
  lg: "h-11 max-h-11 sm:h-12 sm:max-h-12",
  xl: "h-14 max-h-14 sm:h-16 sm:max-h-16 md:h-20 md:max-h-20",
  "2xl": "h-24 max-h-24 sm:h-28 sm:max-h-28",
} as const

export type ClimaLogoSize = keyof typeof sizeClass

export type ClimaLogoProps = {
  className?: string
  size?: ClimaLogoSize
  priority?: boolean
}

/**
 * Official CLIMA AI lockup (PNG in /public).
 */
export function ClimaLogo({ className, size = "md", priority }: ClimaLogoProps) {
  return (
    <Image
      src="/clima-ai-logo.png"
      alt="CLIMA AI"
      width={WIDTH}
      height={HEIGHT}
      priority={priority}
      className={cn("w-auto object-contain object-left", sizeClass[size], className)}
    />
  )
}
