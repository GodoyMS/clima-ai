"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ChevronLeft, Download, TrendingUp, Users, BarChart3,
  Calendar, CheckCircle2, Search
} from "lucide-react"
import { usePulses } from "@/hooks/use-pulses"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"
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

function formatDate(isoString?: string) {
  if (!isoString) return "—"
  return new Date(isoString).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function PulseHistoryPage() {
  const { data: pulses, isLoading } = usePulses()
  const [search, setSearch] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const completed = (pulses ?? [])
    .filter((p) => p.status === "completed")
    .filter((p) => {
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase())
      const date = new Date(p.completedAt ?? p.createdAt)
      const matchesFrom = !dateFrom || date >= new Date(dateFrom)
      const matchesTo = !dateTo || date <= new Date(dateTo)
      return matchesSearch && matchesFrom && matchesTo
    })
    .sort((a, b) => new Date(b.completedAt ?? b.createdAt).getTime() - new Date(a.completedAt ?? a.createdAt).getTime())

  const chartData = [...completed].reverse().map((p) => ({
    name: p.title.substring(0, 18) + "...",
    participacion: p.participationRate,
    respuestas: p.responses,
  }))

  const avgParticipation =
    completed.length > 0
      ? Math.round(completed.reduce((acc, p) => acc + p.participationRate, 0) / completed.length)
      : 0

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
          <div className="flex items-center gap-3">
            <Link href="/admin/pulses">
              <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl">
                <ChevronLeft className="h-4 w-4" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Historial de Pulsos</h1>
              <p className="mt-0.5 text-sm text-gray-500">
                {completed.length} pulsos completados
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="gap-2 rounded-xl"
            onClick={() => alert("Exportando datos...")}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-6 grid gap-4 sm:grid-cols-3"
        >
          {[
            { label: "Total completados", value: completed.length, icon: <CheckCircle2 className="h-5 w-5" />, color: "#0c365c" },
            { label: "Participación promedio", value: `${avgParticipation}%`, icon: <Users className="h-5 w-5" />, color: "#10b981" },
            { label: "Total respuestas", value: completed.reduce((a, p) => a + p.responses, 0), icon: <BarChart3 className="h-5 w-5" />, color: "#167fd0" },
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

        {/* Trend chart */}
        {chartData.length > 1 && (
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-base font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#0c365c]" />
              Tendencia de participación
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0c365c" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0c365c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Participación"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }}
                />
                <Area
                  type="monotone"
                  dataKey="participacion"
                  stroke="#0c365c"
                  strokeWidth={2}
                  fill="url(#colorPart)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 rounded-xl border-gray-200 bg-white"
              placeholder="Buscar por título..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Input
                type="date"
                className="rounded-xl border-gray-200 bg-white w-40"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <span className="self-center text-gray-400">—</span>
            <Input
              type="date"
              className="rounded-xl border-gray-200 bg-white w-40"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </motion.div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl border border-gray-100 bg-white animate-pulse" />
            ))}
          </div>
        ) : completed.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
            <CheckCircle2 className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="text-base font-semibold text-gray-500">No hay pulsos completados</h3>
            <p className="mt-1 text-sm text-gray-400">Los pulsos completados aparecerán aquí.</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {completed.map((pulse) => (
              <motion.div
                key={pulse.id}
                variants={cardVariant}
                className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", TYPE_COLORS[pulse.type])}>
                      {TYPE_LABELS[pulse.type]}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(pulse.completedAt)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{pulse.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {pulse.questions.length} preguntas · {pulse.responses} respuestas de {pulse.totalEmployees}
                  </p>
                </div>
                <div className="w-40 hidden sm:block">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Participación</span>
                    <span className="text-xs font-bold text-gray-900">{pulse.participationRate}%</span>
                  </div>
                  <Progress value={pulse.participationRate} className="h-1.5 bg-gray-100" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 gap-1.5 rounded-xl text-xs text-[#0c365c] hover:bg-blue-50"
                >
                  Ver resultados
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
