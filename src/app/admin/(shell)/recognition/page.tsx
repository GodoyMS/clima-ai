"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Trophy, Users, Star, Filter, Award,
  Heart, Clock, ChevronRight, Search
} from "lucide-react"
import { useRecognitions } from "@/hooks/use-recognition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { staggerContainer, cardVariant, slideUp } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { MOCK_RECOGNITIONS } from "@/lib/mock-data"

function timeAgo(isoString: string) {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `hace ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `hace ${days}d`
}

function RecognitionSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm animate-pulse">
      <div className="flex gap-4">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-16 bg-gray-200 rounded w-full" />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-16" />
            <div className="h-6 bg-gray-200 rounded-full w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

const DEPARTMENTS = ["Todos", "Ingeniería", "Marketing", "Ventas", "Recursos Humanos", "Producto", "Éxito del Cliente", "Dirección General"]

export default function RecognitionPage() {
  const { data: recognitions, isLoading } = useRecognitions()
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState("Todos")

  const filtered = (recognitions ?? []).filter((r) => {
    const matchesDept = deptFilter === "Todos" || r.department === deptFilter
    const matchesSearch =
      search === "" ||
      r.fromName.toLowerCase().includes(search.toLowerCase()) ||
      r.toName.toLowerCase().includes(search.toLowerCase()) ||
      r.message.toLowerCase().includes(search.toLowerCase()) ||
      r.badge.toLowerCase().includes(search.toLowerCase())
    return matchesDept && matchesSearch
  })

  const thisMonth = (recognitions ?? []).filter((r) => {
    const d = new Date(r.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  // Top recognizer
  const recognizerCount: Record<string, number> = {}
  ;(recognitions ?? []).forEach((r) => {
    recognizerCount[r.fromName] = (recognizerCount[r.fromName] ?? 0) + 1
  })
  const topRecognizer = Object.entries(recognizerCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"

  // Top recipient
  const recipientCount: Record<string, number> = {}
  ;(recognitions ?? []).forEach((r) => {
    recipientCount[r.toName] = (recipientCount[r.toName] ?? 0) + 1
  })
  const topRecipient = Object.entries(recipientCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reconocimientos</h1>
            <p className="mt-1 text-sm text-gray-500">
              Celebra y visibiliza los logros de tu equipo.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/recognition/leaderboard">
              <Button variant="outline" className="gap-2 rounded-xl">
                <Trophy className="h-4 w-4" />
                Ranking
              </Button>
            </Link>
            <Button className="gap-2 bg-[#0c365c] hover:bg-[#0a2d4e] text-white rounded-xl">
              <Plus className="h-4 w-4" />
              Crear Reconocimiento
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-6 grid grid-cols-3 gap-3"
        >
          {[
            { label: "Este mes", value: thisMonth.length, icon: <Star className="h-4 w-4" />, color: "#f59e0b" },
            { label: "Reconocedor más activo", value: topRecognizer.split(" ")[0], icon: <Award className="h-4 w-4" />, color: "#0c365c" },
            { label: "Más reconocido", value: topRecipient.split(" ")[0], icon: <Trophy className="h-4 w-4" />, color: "#167fd0" },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={cardVariant}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color: s.color }}>{s.icon}</span>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
              <p className="text-lg font-bold text-gray-900 truncate">{s.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 rounded-xl border-gray-200 bg-white"
              placeholder="Buscar por persona, mensaje o insignia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Department filter */}
        <div className="mb-5 flex gap-1.5 flex-wrap">
          {DEPARTMENTS.slice(0, 6).map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                deptFilter === dept
                  ? "border-[#0c365c] bg-[#0c365c] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              )}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Feed */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <RecognitionSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
            <Award className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="text-base font-semibold text-gray-500">Sin reconocimientos</h3>
            <p className="mt-1 text-sm text-gray-400">Sé el primero en reconocer a alguien hoy.</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <AnimatePresence>
              {filtered.map((rec) => (
                <motion.div
                  key={rec.id}
                  variants={cardVariant}
                  layout
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    {/* From avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={rec.fromAvatar}
                        alt={rec.fromName}
                        className="h-10 w-10 rounded-full bg-gray-100"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="mb-2 flex items-center justify-between flex-wrap gap-1">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-gray-900">{rec.fromName}</span>
                          {" reconoció a "}
                          <span className="font-semibold text-[#0c365c]">{rec.toName}</span>
                        </p>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {timeAgo(rec.createdAt)}
                        </span>
                      </div>

                      {/* Badge */}
                      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: rec.badgeColor }}>
                        <span>{rec.badgeIcon}</span>
                        {rec.badge}
                      </div>

                      {/* Message */}
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        {rec.message}
                      </p>

                      {/* Recipient avatar */}
                      <div className="mb-3 flex items-center gap-2">
                        <img
                          src={rec.toAvatar}
                          alt={rec.toName}
                          className="h-6 w-6 rounded-full bg-gray-100"
                        />
                        <span className="text-xs text-gray-500">{rec.toName} · {rec.department}</span>
                        {!rec.isPublic && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Privado</span>
                        )}
                      </div>

                      {/* Reactions */}
                      <div className="flex flex-wrap gap-1.5">
                        {rec.reactions.map((reaction) => (
                          <button
                            key={reaction.emoji}
                            className={cn(
                              "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all",
                              reaction.userReacted
                                ? "border-[#0c365c]/30 bg-[#0c365c]/10 text-[#0c365c]"
                                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                            )}
                          >
                            {reaction.emoji} {reaction.count}
                          </button>
                        ))}
                        <button className="flex items-center gap-1 rounded-full border border-dashed border-gray-200 px-2.5 py-1 text-xs text-gray-400 hover:border-gray-300 transition-all">
                          <Heart className="h-3 w-3" />
                          Reaccionar
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
