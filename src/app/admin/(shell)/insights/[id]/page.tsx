"use client"

import { use } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ChevronLeft, AlertCircle, AlertTriangle, Info, Users, Target,
  TrendingUp, TrendingDown, CheckCircle2, Share2, Archive, Zap,
  Brain, Calendar
} from "lucide-react"
import { useInsight, useMarkInsightRead } from "@/hooks/use-insights"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"
import { staggerContainer, cardVariant, slideUp } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { MOCK_EMPLOYEES, MOCK_TEAMS } from "@/lib/mock-data"
import { toast } from "sonner"

const SEVERITY_CONFIG = {
  critical: {
    label: "Crítico",
    icon: <AlertCircle className="h-5 w-5" />,
    class: "bg-red-100 text-red-700 border-red-200",
    headerBg: "from-red-50 to-red-100/50",
    color: "#ef4444",
  },
  warning: {
    label: "Advertencia",
    icon: <AlertTriangle className="h-5 w-5" />,
    class: "bg-amber-100 text-amber-700 border-amber-200",
    headerBg: "from-amber-50 to-amber-100/50",
    color: "#f59e0b",
  },
  info: {
    label: "Informativo",
    icon: <Info className="h-5 w-5" />,
    class: "bg-blue-100 text-blue-700 border-blue-200",
    headerBg: "from-blue-50 to-blue-100/50",
    color: "#167fd0",
  },
}

const TREND_DATA = [
  { week: "Sem 1", score: 78 },
  { week: "Sem 2", score: 74 },
  { week: "Sem 3", score: 69 },
  { week: "Sem 4", score: 65 },
  { week: "Sem 5", score: 61 },
  { week: "Sem 6", score: 58 },
]

const ACTION_STEPS = [
  "Programar reunión 1:1 con los empleados afectados esta semana",
  "Revisar carga de trabajo y redistribuir tareas críticas",
  "Compartir el insight con el manager del equipo",
  "Establecer métricas de seguimiento en 30 días",
  "Considerar sesión de team building para fortalecer cohesión",
]

export default function InsightDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: insight, isLoading } = useInsight(id)
  const { mutate: markRead } = useMarkInsightRead()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!insight) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Insight no encontrado.</p>
          <Link href="/admin/insights">
            <Button className="mt-4">Volver a Insights</Button>
          </Link>
        </div>
      </div>
    )
  }

  const cfg = SEVERITY_CONFIG[insight.severity]
  const affectedTeams = insight.affectedTeams
    .map((tid) => MOCK_TEAMS.find((t) => t.id === tid)?.name ?? tid)
    .join(", ")

  const affectedEmployeesList = MOCK_EMPLOYEES.filter((e) =>
    insight.affectedTeams.includes(e.teamId)
  ).slice(0, insight.affectedEmployees)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <Link href="/admin/insights">
            <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl text-gray-600">
              <ChevronLeft className="h-4 w-4" />
              Volver a Insights
            </Button>
          </Link>
        </motion.div>

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "mb-5 rounded-2xl border border-gray-100 bg-linear-to-br p-6 shadow-sm",
            cfg.headerBg
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border",
                cfg.class
              )}
            >
              {cfg.icon}
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2 flex-wrap">
                <span className={cn("inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold", cfg.class)}>
                  {cfg.icon}
                  {cfg.label}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(insight.createdAt).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{insight.title}</h1>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                {insight.description}
              </p>
            </div>
          </div>

          {/* Meta */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white/60 p-3">
              <p className="text-xs text-gray-500">Empleados afectados</p>
              <p className="mt-0.5 text-xl font-bold text-gray-900 flex items-center gap-1">
                <Users className="h-4 w-4 text-gray-400" />
                {insight.affectedEmployees}
              </p>
            </div>
            <div className="rounded-xl bg-white/60 p-3">
              <p className="text-xs text-gray-500">Equipos</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900 truncate">{affectedTeams}</p>
            </div>
            <div className="rounded-xl bg-white/60 p-3">
              <p className="text-xs text-gray-500">Confianza IA</p>
              <div className="mt-1 flex items-center gap-2">
                <Progress value={insight.confidence} className="h-1.5 flex-1 bg-gray-200" />
                <span className="text-sm font-bold text-gray-900">{insight.confidence}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Affected employees */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="mb-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <Users className="h-4 w-4 text-[#0c365c]" />
            Empleados afectados
          </h2>
          <div className="space-y-3">
            {affectedEmployeesList.map((emp) => (
              <div key={emp.id} className="flex items-center gap-3">
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="h-8 w-8 rounded-full bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.department} · {emp.role}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">Riesgo</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      emp.riskLevel === "critical" ? "bg-red-100 text-red-700" :
                      emp.riskLevel === "high" ? "bg-orange-100 text-orange-700" :
                      emp.riskLevel === "medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    )}
                  >
                    {emp.riskScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trend mini chart */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="mb-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <TrendingDown className="h-4 w-4 text-red-500" />
            Tendencia (últimas 6 semanas)
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[40, 100]} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke={cfg.color}
                strokeWidth={2.5}
                dot={{ r: 4, fill: cfg.color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="mb-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
            <Brain className="h-4 w-4 text-[#0c365c]" />
            Recomendación de IA
          </h2>
          <div className="rounded-xl bg-[#0c365c]/5 border border-[#0c365c]/10 p-4 text-sm text-gray-700 leading-relaxed">
            {insight.recommendation}
          </div>

          <h3 className="mt-5 mb-3 font-semibold text-gray-800 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Plan de acción sugerido
          </h3>
          <div className="space-y-2">
            {ACTION_STEPS.map((step, i) => (
              <label key={i} className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded accent-[#0c365c]" />
                <span className="text-sm text-gray-700">{step}</span>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-3"
        >
          <Button
            className="gap-2 bg-[#0c365c] hover:bg-[#0a2d4e] text-white rounded-xl"
            onClick={() => {
              markRead(insight.id)
              toast.success("Acción registrada. El insight ha sido marcado como leído.")
            }}
          >
            <CheckCircle2 className="h-4 w-4" />
            Tomar acción
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-xl"
            onClick={() => toast.info("Enlace copiado al portapapeles.")}
          >
            <Share2 className="h-4 w-4" />
            Compartir
          </Button>
          <Button
            variant="ghost"
            className="gap-2 rounded-xl text-gray-500 hover:text-red-500"
            onClick={() => toast.success("Insight archivado.")}
          >
            <Archive className="h-4 w-4" />
            Archivar
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
