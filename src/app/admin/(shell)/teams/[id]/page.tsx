"use client"

import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  UsersRound,
  TrendingUp,
  AlertTriangle,
  Brain,
  User,
  Activity,
  CheckCircle,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { RiskBadge } from "@/components/shared/risk-badge"
import { SectionHeader } from "@/components/shared/section-header"
import { staggerContainer, slideUp, cardVariant } from "@/lib/motion"
import { MOCK_TEAMS, MOCK_EMPLOYEES, MOCK_INSIGHTS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const TEAM_TREND_DATA = [
  { month: "Nov", score: 74 },
  { month: "Dic", score: 71 },
  { month: "Ene", score: 75 },
  { month: "Feb", score: 78 },
  { month: "Mar", score: 76 },
  { month: "Abr", score: 79 },
  { month: "May", score: 77 },
]

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const team = MOCK_TEAMS.find((t) => t.id === id)
  const members = MOCK_EMPLOYEES.filter((e) => e.teamId === id)
  const teamInsights = MOCK_INSIGHTS.filter((i) => i.affectedTeams.includes(id)).slice(0, 3)

  if (!team) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
          <p className="mt-3 font-semibold text-gray-700">Equipo no encontrado</p>
          <button onClick={() => router.back()} className="mt-4 text-sm font-medium text-[#0c365c] hover:underline">
            Volver
          </button>
        </div>
      </div>
    )
  }

  const avgEngagement = members.length
    ? Math.round(members.reduce((s, e) => s + e.engagementScore, 0) / members.length)
    : team.engagementScore

  const riskLevel = team.riskScore >= 50 ? "high" as const : team.riskScore >= 30 ? "medium" as const : "low" as const

  const severityConfig = {
    critical: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", label: "Crítico" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", label: "Advertencia" },
    info: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", label: "Info" },
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      {/* Back */}
      <motion.button
        variants={slideUp}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#0c365c]"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Equipos
      </motion.button>

      {/* Team header */}
      <motion.div variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div
          className="mb-5 h-1.5 w-full rounded-full opacity-70"
          style={{ backgroundColor: team.color }}
        />
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
              style={{ backgroundColor: team.color }}
            >
              <UsersRound className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
              <p className="text-sm text-gray-500">{team.department}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-3 w-3 text-gray-500" />
                </div>
                <span className="text-sm text-gray-600">
                  Manager: <span className="font-medium">{team.managerName}</span>
                </span>
              </div>
            </div>
          </div>
          <RiskBadge level={riskLevel} className="flex-shrink-0 self-start" />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Miembros", value: members.length, icon: UsersRound, color: "#0c365c" },
          { label: "Eng. Promedio", value: `${avgEngagement}%`, icon: TrendingUp, color: "#167fd0" },
          { label: "Score de Riesgo", value: `${team.riskScore}%`, icon: AlertTriangle, color: team.riskScore >= 50 ? "#ef4444" : team.riskScore >= 30 ? "#f59e0b" : "#10b981" },
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

      {/* Chart + Insights */}
      <motion.div variants={staggerContainer} className="grid gap-6 xl:grid-cols-2">
        {/* Engagement trend mini chart */}
        <motion.div variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Tendencia de Engagement"
            description="Últimos 7 meses del equipo"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <div className="mt-5 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TEAM_TREND_DATA} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} domain={[50, 100]} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: "1px solid #f0f0f0" }} />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Engagement"
                  stroke={team.color}
                  strokeWidth={2.5}
                  dot={{ fill: team.color, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Insights for this team */}
        <motion.div variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Insights del Equipo"
            description="Alertas y recomendaciones de IA"
            icon={<Brain className="h-4 w-4" />}
          />
          <div className="mt-4 space-y-3">
            {teamInsights.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle className="mx-auto h-8 w-8 text-emerald-400" />
                <p className="mt-2 text-sm font-medium text-emerald-600">Sin alertas activas</p>
                <p className="mt-0.5 text-xs text-gray-400">El equipo está en buen estado</p>
              </div>
            ) : (
              teamInsights.map((insight) => {
                const cfg = severityConfig[insight.severity]
                return (
                  <div key={insight.id} className={cn("rounded-xl border p-4", cfg.bg, cfg.border)}>
                    <p className={cn("text-sm font-semibold", cfg.text)}>{insight.title}</p>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{insight.description}</p>
                    <p className="mt-1.5 text-xs text-gray-400">{insight.affectedEmployees} empleados afectados</p>
                  </div>
                )
              })
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Members table */}
      <motion.div variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <SectionHeader
            title="Miembros del Equipo"
            description={`${members.length} colaboradores en este equipo`}
            icon={<UsersRound className="h-4 w-4" />}
          />
        </div>
        {members.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-center">
            <div>
              <UsersRound className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-3 text-sm text-gray-400">Sin miembros asignados</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Empleado</th>
                  <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 md:table-cell">Cargo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Riesgo</th>
                  <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 lg:table-cell">Último Pulso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {members.map((emp) => (
                  <tr
                    key={emp.id}
                    className="cursor-pointer transition-colors hover:bg-gray-50"
                    onClick={() => router.push(`/admin/employees/${emp.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={emp.avatar} alt={emp.name} className="h-8 w-8 flex-shrink-0 rounded-full" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-800">{emp.name}</p>
                          <p className="truncate text-xs text-gray-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 md:table-cell">
                      <p className="text-sm text-gray-600">{emp.role}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              emp.engagementScore >= 80 ? "bg-emerald-500" : emp.engagementScore >= 60 ? "bg-amber-500" : "bg-red-500"
                            )}
                            style={{ width: `${emp.engagementScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{emp.engagementScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge level={emp.riskLevel} />
                    </td>
                    <td className="hidden px-6 py-4 lg:table-cell">
                      <p className="text-xs text-gray-500">{emp.lastPulse || "—"}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
