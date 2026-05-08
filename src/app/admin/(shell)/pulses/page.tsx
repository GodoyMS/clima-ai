"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Search, Activity, Users, CheckCircle2, BarChart3,
  Play, Archive, Eye, Clock, Calendar, ChevronRight, Filter
} from "lucide-react"
import { usePulses } from "@/hooks/use-pulses"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { staggerContainer, cardVariant, slideUp } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { Pulse } from "@/lib/types"

const TYPE_LABELS: Record<Pulse["type"], string> = {
  mood: "Bienestar",
  engagement: "Compromiso",
  enps: "eNPS",
  custom: "Personalizado",
}

const TYPE_COLORS: Record<Pulse["type"], string> = {
  mood: "bg-pink-100 text-pink-700",
  engagement: "bg-blue-100 text-blue-700",
  enps: "bg-purple-100 text-purple-700",
  custom: "bg-orange-100 text-orange-700",
}

const STATUS_CONFIG = {
  active: { label: "Activo", class: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  scheduled: { label: "Programado", class: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  completed: { label: "Completado", class: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
  draft: { label: "Borrador", class: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
}

const TABS = [
  { id: "all", label: "Todos" },
  { id: "active", label: "Activos" },
  { id: "scheduled", label: "Programados" },
  { id: "completed", label: "Completados" },
  { id: "draft", label: "Borradores" },
] as const

type Tab = (typeof TABS)[number]["id"]

function PulseCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

function formatDate(isoString?: string) {
  if (!isoString) return "—"
  return new Date(isoString).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function PulsesPage() {
  const { data: pulses, isLoading } = usePulses()
  const [activeTab, setActiveTab] = useState<Tab>("all")
  const [search, setSearch] = useState("")

  const filtered = (pulses ?? []).filter((p) => {
    const matchesTab = activeTab === "all" || p.status === activeTab
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  const stats = {
    active: (pulses ?? []).filter((p) => p.status === "active").length,
    avgParticipation:
      (pulses ?? []).length > 0
        ? Math.round(
            (pulses ?? []).reduce((acc, p) => acc + p.participationRate, 0) /
              (pulses ?? []).length
          )
        : 0,
    completionRate:
      (pulses ?? []).length > 0
        ? Math.round(
            ((pulses ?? []).filter((p) => p.status === "completed").length /
              (pulses ?? []).length) *
              100
          )
        : 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pulsos y Encuestas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Crea y gestiona encuestas de bienestar y compromiso para tu equipo.
            </p>
          </div>
          <Link href="/admin/pulses/new">
            <Button className="gap-2 bg-[#0c365c] hover:bg-[#0a2d4e] text-white rounded-xl px-5">
              <Plus className="h-4 w-4" />
              Nuevo Pulso
            </Button>
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            {
              label: "Pulsos activos",
              value: stats.active,
              icon: <Activity className="h-5 w-5" />,
              color: "#0c365c",
            },
            {
              label: "Participación promedio",
              value: `${stats.avgParticipation}%`,
              icon: <Users className="h-5 w-5" />,
              color: "#167fd0",
            },
            {
              label: "Tasa de completación",
              value: `${stats.completionRate}%`,
              icon: <CheckCircle2 className="h-5 w-5" />,
              color: "#10b981",
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={cardVariant}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: stat.color }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search + Filter */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 rounded-xl border-gray-200 bg-white"
              placeholder="Buscar pulsos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
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

        {/* Pulse Cards */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <PulseCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center"
          >
            <BarChart3 className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="text-base font-semibold text-gray-500">No hay pulsos aquí</h3>
            <p className="mt-1 text-sm text-gray-400">
              {search ? "Intenta con otro término de búsqueda." : "Crea tu primer pulso para comenzar."}
            </p>
            {!search && (
              <Link href="/admin/pulses/new">
                <Button className="mt-4 gap-2 bg-[#0c365c] text-white rounded-xl">
                  <Plus className="h-4 w-4" />
                  Nuevo Pulso
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-2"
          >
            <AnimatePresence>
              {filtered.map((pulse) => (
                <motion.div
                  key={pulse.id}
                  variants={cardVariant}
                  layout
                  className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                            TYPE_COLORS[pulse.type]
                          )}
                        >
                          {TYPE_LABELS[pulse.type]}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                            STATUS_CONFIG[pulse.status].class
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              STATUS_CONFIG[pulse.status].dot
                            )}
                          />
                          {STATUS_CONFIG[pulse.status].label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 truncate">{pulse.title}</h3>
                      <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">
                        {pulse.description}
                      </p>
                    </div>
                  </div>

                  {/* Participation */}
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium">Participación</span>
                      <span className="font-semibold text-gray-700">
                        {pulse.responses}/{pulse.totalEmployees} ({pulse.participationRate}%)
                      </span>
                    </div>
                    <Progress value={pulse.participationRate} className="h-2 bg-gray-100" />
                  </div>

                  {/* Meta */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(pulse.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-3.5 w-3.5" />
                      {pulse.questions.length} preguntas
                    </span>
                    {pulse.scheduledAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(pulse.scheduledAt)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-2 border-t border-gray-50 pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-xs rounded-lg text-gray-600 hover:text-[#0c365c] hover:bg-blue-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Ver resultados
                    </Button>
                    {pulse.status === "draft" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Activar
                      </Button>
                    )}
                    {pulse.status !== "completed" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 ml-auto"
                      >
                        <Archive className="h-3.5 w-3.5" />
                        Archivar
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Quick links */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-8 grid gap-3 sm:grid-cols-2"
        >
          {[
            { href: "/admin/pulses/history", label: "Ver historial completo", icon: <Clock className="h-4 w-4" /> },
            { href: "/admin/pulses/templates", label: "Plantillas de pulsos", icon: <Filter className="h-4 w-4" /> },
          ].map((link) => (
            <motion.div key={link.href} variants={cardVariant}>
              <Link
                href={link.href}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:shadow-md hover:text-[#0c365c]"
              >
                <span className="flex items-center gap-2">
                  {link.icon}
                  {link.label}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
