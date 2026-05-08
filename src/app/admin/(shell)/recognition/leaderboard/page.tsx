"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ChevronLeft, Trophy, Medal, Award, Star, Crown, ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { staggerContainer, cardVariant, slideUp, scaleInBounce } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { MOCK_RECOGNITIONS, MOCK_EMPLOYEES } from "@/lib/mock-data"

const PERIODS = [
  { id: "week", label: "Semana" },
  { id: "month", label: "Mes" },
  { id: "quarter", label: "Trimestre" },
  { id: "year", label: "Año" },
] as const

type Period = (typeof PERIODS)[number]["id"]

const BADGE_COLLECTION = [
  { icon: "💡", name: "Innovador", count: 4 },
  { icon: "🤝", name: "Colaborador", count: 7 },
  { icon: "⭐", name: "Estrella", count: 3 },
  { icon: "🏆", name: "Líder", count: 5 },
  { icon: "🎨", name: "Creativo", count: 6 },
  { icon: "💻", name: "Técnico", count: 8 },
  { icon: "🎓", name: "Mentor", count: 4 },
  { icon: "🚀", name: "Visionario", count: 3 },
]

function buildLeaderboard(period: Period) {
  // For demo, use all recognitions (in real app, filter by period)
  const given: Record<string, number> = {}
  const received: Record<string, number> = {}

  MOCK_RECOGNITIONS.forEach((r) => {
    given[r.fromId] = (given[r.fromId] ?? 0) + 1
    received[r.toId] = (received[r.toId] ?? 0) + 1
  })

  return MOCK_EMPLOYEES
    .map((emp) => ({
      ...emp,
      given: given[emp.id] ?? 0,
      received: received[emp.id] ?? 0,
      total: (given[emp.id] ?? 0) + (received[emp.id] ?? 0),
    }))
    .sort((a, b) => b.received - a.received)
    .slice(0, 10)
}

export default function RecognitionLeaderboardPage() {
  const [period, setPeriod] = useState<Period>("month")
  const leaderboard = buildLeaderboard(period)
  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean)
  const podiumHeights = [80, 112, 64]
  const podiumIcons = [<Medal className="h-5 w-5" />, <Trophy className="h-5 w-5" />, <Award className="h-5 w-5" />]
  const podiumColors = ["#9ca3af", "#f59e0b", "#cd7f32"]
  const podiumRanks = [2, 1, 3]

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
          <div className="flex items-center gap-3">
            <Link href="/admin/recognition">
              <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl">
                <ChevronLeft className="h-4 w-4" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-amber-500" />
                Ranking de Reconocimientos
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">Los campeones del reconocimiento en tu empresa.</p>
            </div>
          </div>
        </motion.div>

        {/* Period selector */}
        <div className="mb-8 flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                "rounded-lg px-5 py-1.5 text-sm font-medium transition-all",
                period === p.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Podium */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex items-end justify-center gap-4"
        >
          {podiumOrder.map((emp, i) => {
            if (!emp) return null
            const rank = podiumRanks[i]
            const height = podiumHeights[i]
            const icon = podiumIcons[i]
            const color = podiumColors[i]

            return (
              <motion.div
                key={emp.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
                className="flex flex-col items-center"
              >
                {rank === 1 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                    className="mb-1"
                  >
                    <Crown className="h-6 w-6 text-amber-500" />
                  </motion.div>
                )}
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className={cn(
                    "rounded-full bg-gray-100 border-4 border-white shadow-lg",
                    rank === 1 ? "h-16 w-16" : "h-12 w-12"
                  )}
                />
                <p className="mt-1.5 text-xs font-semibold text-gray-800 text-center max-w-[90px] truncate">
                  {emp.name.split(" ")[0]}
                </p>
                <p className="text-xs text-gray-500">{emp.received} recibidos</p>
                <div
                  className="mt-2 w-20 rounded-t-xl flex flex-col items-center justify-end pb-2"
                  style={{ height, backgroundColor: color + "30", border: `2px solid ${color}` }}
                >
                  <span className="text-lg font-black" style={{ color }}>#{rank}</span>
                  <span style={{ color }}>{icon}</span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Full leaderboard table */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="border-b border-gray-100 px-5 py-3">
            <h2 className="font-semibold text-gray-900">Clasificación completa</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {leaderboard.map((emp, i) => (
              <div
                key={emp.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    i === 0 ? "bg-amber-100 text-amber-700" :
                    i === 1 ? "bg-gray-100 text-gray-600" :
                    i === 2 ? "bg-orange-100 text-orange-600" :
                    "bg-gray-50 text-gray-400"
                  )}
                >
                  {i + 1}
                </span>
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="h-9 w-9 rounded-full bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.department}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-[#0c365c]">{emp.given}</p>
                    <p className="text-xs text-gray-400">Enviados</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-emerald-600">{emp.received}</p>
                    <p className="text-xs text-gray-400">Recibidos</p>
                  </div>
                  <div className="flex gap-1">
                    {emp.badges.slice(0, 3).map((b) => (
                      <span key={b.id} title={b.name} className="text-base">{b.icon}</span>
                    ))}
                    {emp.badges.length > 3 && (
                      <span className="text-xs text-gray-400">+{emp.badges.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Badge collection */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 font-semibold text-gray-900 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            Insignias más entregadas
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BADGE_COLLECTION.map((badge) => (
              <div
                key={badge.name}
                className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
              >
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{badge.name}</p>
                  <p className="text-xs text-gray-500">{badge.count} veces</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
