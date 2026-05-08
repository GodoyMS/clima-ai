"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Heart } from "lucide-react"
import { MOCK_RECOGNITIONS } from "@/lib/mock-data"
import { useAuthStore } from "@/store/auth-store"
import { staggerContainer, cardVariant } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import type { Recognition } from "@/lib/types"

const REACTIONS = ["❤️", "👏", "🔥"]

export default function RecognitionPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [recognitions, setRecognitions] = useState<Recognition[]>(MOCK_RECOGNITIONS)
  const [userReactions, setUserReactions] = useState<Record<string, string>>({})

  function handleReaction(recId: string, emoji: string) {
    const current = userReactions[recId]
    setUserReactions((prev) => {
      const next = { ...prev }
      if (current === emoji) {
        delete next[recId]
      } else {
        next[recId] = emoji
      }
      return next
    })
  }

  function isOwnRecognition(rec: Recognition) {
    return rec.fromId === user?.id || rec.toId === user?.id
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center">
        <h1 className="text-base font-semibold text-gray-900">Reconocimientos</h1>
      </header>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 px-4 py-4"
      >
        {/* Banner */}
        <motion.div
          variants={cardVariant}
          className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 p-4 flex items-center gap-4"
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl">
            🏆
          </div>
          <div>
            <p className="text-white/75 text-xs font-medium">Este mes</p>
            <p className="text-white font-bold text-base">{recognitions.length} reconocimientos</p>
            <p className="text-white/60 text-xs">en toda la empresa</p>
          </div>
        </motion.div>

        {recognitions.length === 0 ? (
          <motion.div
            variants={cardVariant}
            className="flex flex-col items-center justify-center py-16 text-center gap-4"
          >
            <div className="text-6xl">🏅</div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Sin reconocimientos aún</h3>
              <p className="text-sm text-gray-500 mt-1">¡Sé el primero en reconocer a alguien!</p>
            </div>
          </motion.div>
        ) : (
          recognitions.map((rec) => (
            <motion.div
              key={rec.id}
              variants={cardVariant}
              className={cn(
                "rounded-2xl bg-white border shadow-sm overflow-hidden",
                isOwnRecognition(rec) ? "border-[#0c365c]/30 ring-1 ring-[#0c365c]/20" : "border-gray-100"
              )}
            >
              {isOwnRecognition(rec) && (
                <div className="bg-[#0c365c]/5 border-b border-[#0c365c]/10 px-4 py-2">
                  <p className="text-[10px] font-semibold text-[#0c365c]">
                    {rec.fromId === user?.id ? "✨ Enviaste este reconocimiento" : "🎉 Te reconocieron"}
                  </p>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <img src={rec.fromAvatar} alt={rec.fromName} className="h-10 w-10 rounded-full bg-gray-100" />
                    <img
                      src={rec.toAvatar}
                      alt={rec.toName}
                      className="h-7 w-7 rounded-full bg-gray-100 absolute -bottom-1 -right-1 border-2 border-white"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap text-xs">
                      <span className="font-semibold text-gray-900">{rec.fromName.split(" ")[0]}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-semibold text-[#0c365c]">{rec.toName.split(" ")[0]}</span>
                      <span className="text-[10px] text-gray-400 ml-auto flex-shrink-0">
                        {formatDistanceToNow(new Date(rec.createdAt), { addSuffix: true, locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-lg">{rec.badgeIcon}</span>
                      <span
                        className="text-[10px] font-bold rounded-full px-2.5 py-1"
                        style={{ background: `${rec.badgeColor}18`, color: rec.badgeColor }}
                      >
                        {rec.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{rec.message}</p>
                  </div>
                </div>

                {/* Reactions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                  {REACTIONS.map((emoji) => {
                    const existingReaction = rec.reactions.find((r) => r.emoji === emoji)
                    const count = existingReaction?.count ?? 0
                    const isActive = userReactions[rec.id] === emoji
                    return (
                      <motion.button
                        key={emoji}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => handleReaction(rec.id, emoji)}
                        className={cn(
                          "flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                          isActive
                            ? "bg-[#0c365c]/15 text-[#0c365c] ring-1 ring-[#0c365c]/30"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        <span>{emoji}</span>
                        <span>{count + (isActive ? 1 : 0)}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          ))
        )}

        <div className="h-20" />
      </motion.div>

      {/* FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push("/employee/recognition/new")}
        className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-full bg-[#0c365c] px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#0c365c]/40"
      >
        <Plus size={18} />
        Reconocer
      </motion.button>
    </div>
  )
}
