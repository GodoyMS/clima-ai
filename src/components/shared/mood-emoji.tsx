"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MoodEmojiProps {
  value?: number
  onChange?: (value: number) => void
  readOnly?: boolean
  className?: string
}

const moods = [
  { value: 1, emoji: "😞", label: "Muy mal" },
  { value: 2, emoji: "😕", label: "Mal" },
  { value: 3, emoji: "😐", label: "Regular" },
  { value: 4, emoji: "🙂", label: "Bien" },
  { value: 5, emoji: "😄", label: "Muy bien" },
]

export function MoodEmoji({ value, onChange, readOnly = false, className }: MoodEmojiProps) {
  return (
    <div className={cn("flex items-end gap-3", className)}>
      {moods.map((mood) => {
        const isSelected = value === mood.value

        return (
          <div key={mood.value} className="flex flex-col items-center gap-1.5">
            <motion.button
              type="button"
              disabled={readOnly}
              onClick={() => !readOnly && onChange?.(mood.value)}
              animate={{
                scale: isSelected ? 1.35 : 1,
                filter: isSelected ? "grayscale(0%)" : "grayscale(30%)",
              }}
              whileHover={!readOnly ? { scale: isSelected ? 1.35 : 1.15 } : {}}
              whileTap={!readOnly ? { scale: 1.25 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={cn(
                "cursor-pointer select-none text-3xl leading-none outline-none",
                readOnly && "cursor-default",
                isSelected && "drop-shadow-md"
              )}
              aria-label={mood.label}
              aria-pressed={isSelected}
            >
              {mood.emoji}
            </motion.button>
            <motion.span
              animate={{ opacity: isSelected ? 1 : 0.45, fontWeight: isSelected ? 600 : 400 }}
              className="text-[10px] text-gray-500 whitespace-nowrap"
            >
              {mood.label}
            </motion.span>
          </div>
        )
      })}
    </div>
  )
}
