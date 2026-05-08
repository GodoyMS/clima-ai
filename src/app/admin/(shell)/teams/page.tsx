"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Search, UsersRound, TrendingUp, AlertTriangle } from "lucide-react"
import { RiskBadge } from "@/components/shared/risk-badge"
import { SectionHeader } from "@/components/shared/section-header"
import { staggerContainer, slideUp, cardVariant } from "@/lib/motion"
import { MOCK_TEAMS, MOCK_EMPLOYEES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { Team } from "@/lib/types"

function EngagementRing({ value, color }: { value: number; color: string }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg width="72" height="72" className="-rotate-90">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-gray-800">{value}</span>
        <span className="text-[9px] font-medium text-gray-400">score</span>
      </div>
    </div>
  )
}

function TeamCard({ team, memberCount, onClick }: { team: Team; memberCount: number; onClick: () => void }) {
  const riskLevel = team.riskScore >= 50 ? "high" : team.riskScore >= 30 ? "medium" : "low"

  return (
    <motion.div
      variants={cardVariant}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
    >
      {/* Team color accent */}
      <div
        className="mb-4 h-1.5 w-full rounded-full opacity-60"
        style={{ backgroundColor: team.color }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: team.color }}
            >
              <UsersRound className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-gray-900">{team.name}</h3>
              <p className="truncate text-xs text-gray-400">{team.department}</p>
            </div>
          </div>
        </div>
        <EngagementRing value={team.engagementScore} color={team.color} />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Manager</span>
          <span className="font-medium text-gray-700 truncate max-w-32">{team.managerName.split(" ").slice(0, 2).join(" ")}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Miembros</span>
          <div className="flex items-center gap-1">
            <UsersRound className="h-3 w-3 text-gray-400" />
            <span className="font-medium text-gray-700">{memberCount}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Riesgo</span>
          <RiskBadge level={riskLevel} />
        </div>
      </div>

      <div className="mt-4 border-t border-gray-50 pt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Engagement</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${team.engagementScore}%`, backgroundColor: team.color }}
              />
            </div>
            <span className="font-semibold text-gray-700">{team.engagementScore}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TeamsPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    if (!search.trim()) return MOCK_TEAMS
    const q = search.toLowerCase()
    return MOCK_TEAMS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.managerName.toLowerCase().includes(q)
    )
  }, [search])

  const memberCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    MOCK_EMPLOYEES.forEach((e) => {
      counts[e.teamId] = (counts[e.teamId] ?? 0) + 1
    })
    return counts
  }, [])

  const avgEngagement = Math.round(MOCK_TEAMS.reduce((s, t) => s + t.engagementScore, 0) / MOCK_TEAMS.length)
  const highRiskTeams = MOCK_TEAMS.filter((t) => t.riskScore >= 50).length

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      {/* Header */}
      <motion.div variants={slideUp} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SectionHeader
          title="Equipos"
          description={`${MOCK_TEAMS.length} equipos registrados en la plataforma`}
          icon={<UsersRound className="h-4 w-4" />}
        />
        <button
          onClick={() => {}}
          className="flex items-center gap-2 rounded-xl bg-[#0c365c] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0c365c]/90 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Nuevo Equipo
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Equipos", value: MOCK_TEAMS.length, icon: UsersRound, color: "#0c365c" },
          { label: "Engagement Promedio", value: `${avgEngagement}%`, icon: TrendingUp, color: "#167fd0" },
          { label: "Equipos en Alto Riesgo", value: highRiskTeams, icon: AlertTriangle, color: "#ef4444" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={cardVariant}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: stat.color }}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div variants={slideUp} className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar equipos..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#0c365c] focus:bg-white focus:ring-2 focus:ring-[#0c365c]/10"
        />
      </motion.div>

      {/* Teams grid */}
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-16 text-center">
          <div>
            <UsersRound className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 font-semibold text-gray-500">Sin resultados</p>
            <p className="mt-1 text-sm text-gray-400">Prueba con otro término de búsqueda</p>
          </div>
        </div>
      ) : (
        <motion.div variants={staggerContainer} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              memberCount={memberCounts[team.id] ?? team.memberCount}
              onClick={() => router.push(`/admin/teams/${team.id}`)}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
