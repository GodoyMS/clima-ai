"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ChevronLeft, Download, TrendingUp, TrendingDown, Minus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Tooltip as RechartTooltip
} from "recharts"
import { slideUp, staggerContainer, cardVariant } from "@/lib/motion"
import { MOCK_ENGAGEMENT_DATA, MOCK_DEPARTMENT_ENGAGEMENT } from "@/lib/mock-data"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const ENPS_SCORE = 42
const PROMOTERS = { count: 8, pct: 57 }
const PASSIVES = { count: 5, pct: 36 }
const DETRACTORS = { count: 1, pct: 7 }

const DONUT_DATA = [
  { name: "Promotores", value: PROMOTERS.pct, color: "#10b981" },
  { name: "Pasivos", value: PASSIVES.pct, color: "#f59e0b" },
  { name: "Detractores", value: DETRACTORS.pct, color: "#ef4444" },
]

const TREND_DATA = MOCK_ENGAGEMENT_DATA.map((d) => ({ date: d.date, enps: d.enps }))

const DEPT_ENPS = [
  { department: "Marketing", enps: 68 },
  { department: "RRHH", enps: 58 },
  { department: "Éxito Cliente", enps: 48 },
  { department: "Producto", enps: 45 },
  { department: "Ingeniería", enps: 40 },
  { department: "Ventas", enps: 12 },
]

const BENCHMARK = {
  industry: 35,
  topPerformers: 55,
  company: ENPS_SCORE,
}

function ScoreColor(score: number) {
  if (score >= 50) return "text-emerald-600"
  if (score >= 20) return "text-amber-600"
  return "text-red-600"
}

export default function ENPSReportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Link href="/admin/reports">
              <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl">
                <ChevronLeft className="h-4 w-4" />
                Reportes
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reporte eNPS</h1>
              <p className="mt-0.5 text-sm text-gray-500">Employee Net Promoter Score</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2 rounded-xl text-sm" onClick={() => toast.success("Exportando reporte eNPS...")}>
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </motion.div>

        {/* Main score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm text-center"
        >
          <p className="text-sm font-medium text-gray-500 mb-2">Score eNPS actual — Mayo 2026</p>
          <p className={cn("text-8xl font-black", ScoreColor(ENPS_SCORE))}>
            {ENPS_SCORE}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Basado en {PROMOTERS.count + PASSIVES.count + DETRACTORS.count} respuestas de 20 empleados
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            <TrendingUp className="h-4 w-4" />
            +4 puntos vs. mes anterior
          </div>
        </motion.div>

        {/* Breakdown + Donut */}
        <div className="mb-5 grid gap-5 sm:grid-cols-2">
          {/* Donut chart */}
          <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-900">Distribución de respuestas</h2>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={DONUT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    dataKey="value"
                    strokeWidth={2}
                  >
                    {DONUT_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, ""]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {[
                  { ...PROMOTERS, label: "Promotores (9-10)", color: "#10b981", bg: "bg-emerald-100" },
                  { ...PASSIVES, label: "Pasivos (7-8)", color: "#f59e0b", bg: "bg-amber-100" },
                  { ...DETRACTORS, label: "Detractores (0-6)", color: "#ef4444", bg: "bg-red-100" },
                ].map((g) => (
                  <div key={g.label} className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                    <div>
                      <p className="text-xs font-medium text-gray-700">{g.label}</p>
                      <p className="text-xs text-gray-500">{g.count} empleados ({g.pct}%)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Benchmark */}
          <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-900">Comparación con benchmarks</h2>
            <div className="space-y-4">
              {[
                { label: "Tu empresa", value: BENCHMARK.company, color: "#0c365c" },
                { label: "Promedio industria", value: BENCHMARK.industry, color: "#9ca3af" },
                { label: "Top performers", value: BENCHMARK.topPerformers, color: "#10b981" },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="text-gray-600">{b.label}</span>
                    <span className="font-bold" style={{ color: b.color }}>{b.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${((b.value + 100) / 200) * 100}%`,
                        backgroundColor: b.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-400">
              * El eNPS va de -100 a +100. Escala del 0% al 100% en el gráfico.
            </p>
          </motion.div>
        </div>

        {/* Trend over time */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Evolución del eNPS (últimos 12 meses)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[20, 50]} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Line type="monotone" dataKey="enps" name="eNPS" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: "#8b5cf6" }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department eNPS comparison */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">eNPS por departamento</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DEPT_ENPS} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 80]} />
              <YAxis type="category" dataKey="department" tick={{ fontSize: 11 }} width={110} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Bar dataKey="enps" name="eNPS" radius={[0, 6, 6, 0]}>
                {DEPT_ENPS.map((entry) => (
                  <Cell
                    key={entry.department}
                    fill={entry.enps >= 50 ? "#10b981" : entry.enps >= 25 ? "#8b5cf6" : "#f59e0b"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
