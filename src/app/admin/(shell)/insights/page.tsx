"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertTriangle, AlertCircle, Info, CheckCircle,
  Users, Target, TrendingUp, ChevronRight, Eye, BookOpen, Sparkles
} from "lucide-react"
import { useInsights, useMarkInsightRead } from "@/hooks/use-insights"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { staggerContainer, cardVariant, slideUp } from "@/lib/motion"
import { ClimaLogo } from "@/components/shared/clima-logo"
import { cn } from "@/lib/utils"
import type { Insight } from "@/lib/types"

const SEVERITY_CONFIG = {
  critical: {
    label: "Crítico",
    icon: <AlertCircle className="h-4 w-4" />,
    class: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
    border: "border-l-red-500",
    bg: "bg-red-50/40",
  },
  warning: {
    label: "Advertencia",
    icon: <AlertTriangle className="h-4 w-4" />,
    class: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    border: "border-l-amber-500",
    bg: "bg-amber-50/40",
  },
  info: {
    label: "Informativo",
    icon: <Info className="h-4 w-4" />,
    class: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    border: "border-l-blue-500",
    bg: "bg-blue-50/40",
  },
}

const TYPE_LABELS: Record<Insight["type"], string> = {
  burnout: "Agotamiento",
  morale: "Moral",
  engagement: "Compromiso",
  retention: "Retención",
  recognition: "Reconocimiento",
}

const TABS = [
  { id: "all", label: "Todos" },
  { id: "critical", label: "Críticos" },
  { id: "warning", label: "Advertencias" },
  { id: "info", label: "Informativos" },
] as const

type Tab = (typeof TABS)[number]["id"]

function InsightSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}

function formatTimeAgo(isoString: string) {
  const diff = Date.now() - new Date(isoString).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `hace ${days}d`
}

export default function InsightsPage() {
  const { data: insights, isLoading } = useInsights()
  const { mutate: markRead } = useMarkInsightRead()
  const [activeTab, setActiveTab] = useState<Tab>("all")

  const filtered = (insights ?? []).filter(
    (i) => activeTab === "all" || i.severity === activeTab
  )

  const unread = (insights ?? []).filter((i) => !i.isRead).length
  const critical = (insights ?? []).filter((i) => i.severity === "critical").length
  const warnings = (insights ?? []).filter((i) => i.severity === "warning").length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zinc-950 px-2 py-1 ring-1 ring-black/5">
              <ClimaLogo size="2xs" className="max-w-[72px]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Insights de IA</h1>
            {unread > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                {unread} nuevos
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Análisis inteligente del clima organizacional de tu empresa.
          </p>
        </motion.div>

        {/* AI Summary Banner */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="mb-6 rounded-2xl border border-[#0c365c]/20 bg-gradient-to-r from-[#0c365c]/5 to-[#167fd0]/5 p-5"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0c365c] text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold text-[#0c365c]">Resumen de IA — {new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Tu empresa tiene <strong>{critical} insight{critical !== 1 ? "s" : ""} crítico{critical !== 1 ? "s" : ""}</strong> que requieren atención inmediata,
                principalmente en el equipo de <strong>Ventas</strong> donde se detectan señales de agotamiento y riesgo de rotación.
                El equipo de <strong>Marketing</strong> destaca positivamente con métricas de engagement en máximo histórico.
                Se recomienda priorizar acciones de retención en el departamento de Ventas esta semana.
              </p>
            </div>
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
            { label: "Total insights", value: (insights ?? []).length, color: "#0c365c" },
            { label: "Críticos", value: critical, color: "#ef4444" },
            { label: "Advertencias", value: warnings, color: "#f59e0b" },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={cardVariant}
              className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm"
            >
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="mb-5 flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-lg px-4 py-1.5 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Insights list */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <InsightSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
            <CheckCircle className="mb-4 h-12 w-12 text-emerald-300" />
            <h3 className="text-base font-semibold text-gray-500">Sin insights en esta categoría</h3>
            <p className="mt-1 text-sm text-gray-400">¡Todo parece estar bien aquí!</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence>
              {filtered.map((insight) => {
                const cfg = SEVERITY_CONFIG[insight.severity]
                return (
                  <motion.div
                    key={insight.id}
                    variants={cardVariant}
                    layout
                    className={cn(
                      "rounded-2xl border border-gray-100 bg-white shadow-sm border-l-4 transition-all",
                      cfg.border,
                      !insight.isRead && "shadow-md"
                    )}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border", cfg.class)}>
                          {cfg.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-1.5 flex items-center gap-2 flex-wrap">
                            <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold", cfg.class)}>
                              {cfg.icon}
                              {cfg.label}
                            </span>
                            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                              {TYPE_LABELS[insight.type]}
                            </span>
                            {!insight.isRead && (
                              <span className="h-2 w-2 rounded-full bg-[#0c365c]" />
                            )}
                            <span className="ml-auto text-xs text-gray-400">
                              {formatTimeAgo(insight.createdAt)}
                            </span>
                          </div>

                          <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                          <p className="mt-1 text-sm text-gray-600 leading-relaxed line-clamp-2">
                            {insight.description}
                          </p>

                          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {insight.affectedEmployees} empleados afectados
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-3.5 w-3.5" />
                              Confianza: {insight.confidence}%
                            </span>
                          </div>

                          <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Recomendación: </span>
                            {insight.recommendation}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 border-t border-gray-50 pt-3">
                        <Link href={`/admin/insights/${insight.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-xs rounded-lg text-[#0c365c] hover:bg-blue-50"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Ver detalles
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </Link>
                        {!insight.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markRead(insight.id)}
                            className="gap-1.5 text-xs rounded-lg text-gray-500 hover:bg-gray-100 ml-auto"
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            Marcar como leído
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
