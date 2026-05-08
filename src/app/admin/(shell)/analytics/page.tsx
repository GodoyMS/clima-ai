"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3, TrendingUp, Activity, Filter, Users, Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts"
import { staggerContainer, cardVariant, slideUp } from "@/lib/motion"
import { cn } from "@/lib/utils"
import {
  MOCK_ENGAGEMENT_DATA,
  MOCK_DEPARTMENT_ENGAGEMENT,
  MOCK_EMPLOYEES
} from "@/lib/mock-data"

const MONTHS = ["May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr"]
const DEPARTMENTS = ["Ingeniería", "Marketing", "Ventas", "RRHH", "Producto", "Éxito Cliente"]

// Heatmap data: department x month engagement
const HEATMAP_DATA: Record<string, number[]> = {
  "Ingeniería": [70, 71, 69, 72, 74, 72, 75, 71, 73, 75, 76, 76],
  "Marketing": [82, 84, 83, 85, 86, 85, 87, 84, 86, 87, 88, 88],
  "Ventas": [68, 70, 67, 65, 63, 61, 62, 58, 60, 61, 62, 62],
  "RRHH": [78, 79, 80, 81, 82, 80, 82, 79, 81, 82, 83, 83],
  "Producto": [74, 75, 73, 76, 75, 74, 76, 73, 75, 76, 77, 77],
  "Éxito Cliente": [76, 77, 75, 78, 77, 76, 78, 75, 77, 78, 79, 79],
}

function heatColor(value: number) {
  if (value >= 85) return { bg: "#0c365c", text: "text-white" }
  if (value >= 80) return { bg: "#167fd0", text: "text-white" }
  if (value >= 75) return { bg: "#60a5fa", text: "text-white" }
  if (value >= 70) return { bg: "#bfdbfe", text: "text-blue-900" }
  if (value >= 65) return { bg: "#fde68a", text: "text-amber-900" }
  if (value >= 60) return { bg: "#fca5a5", text: "text-red-900" }
  return { bg: "#ef4444", text: "text-white" }
}

const PULSE_PARTICIPATION = [
  { month: "Nov 2025", tasa: 72 },
  { month: "Dic 2025", tasa: 68 },
  { month: "Ene 2026", tasa: 74 },
  { month: "Feb 2026", tasa: 76 },
  { month: "Mar 2026", tasa: 79 },
  { month: "Abr 2026", tasa: 81 },
]

const RISK_DIST = [
  { name: "Bajo", value: 11, color: "#10b981" },
  { name: "Medio", value: 5, color: "#f59e0b" },
  { name: "Alto", value: 3, color: "#f97316" },
  { name: "Crítico", value: 1, color: "#ef4444" },
]

const FILTERS = [
  { id: "all", label: "Todo el tiempo" },
  { id: "q1", label: "Q1 2026" },
  { id: "q2", label: "Q2 2026" },
  { id: "year", label: "Último año" },
] as const

type FilterId = (typeof FILTERS)[number]["id"]

export default function AnalyticsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("year")
  const [deptFilter, setDeptFilter] = useState("Todos")

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
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">
              Visualizaciones avanzadas de los indicadores de tu organización.
            </p>
          </div>
          <Button variant="outline" className="gap-2 rounded-xl text-sm">
            <Filter className="h-4 w-4" />
            Filtros avanzados
          </Button>
        </motion.div>

        {/* Time range selector */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm font-medium transition-all",
                  activeFilter === f.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 ml-auto">
            {["Todos", ...DEPARTMENTS.slice(0, 4)].map((d) => (
              <button
                key={d}
                onClick={() => setDeptFilter(d)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                  deptFilter === d
                    ? "border-[#0c365c] bg-[#0c365c] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { label: "Engagement General", value: "74%", delta: "+12%", up: true, color: "#0c365c" },
            { label: "eNPS", value: "42", delta: "+14pts", up: true, color: "#8b5cf6" },
            { label: "Participación Pulsos", value: "81%", delta: "+9%", up: true, color: "#10b981" },
            { label: "Empleados en Riesgo", value: "4", delta: "-2", up: true, color: "#ef4444" },
          ].map((m) => (
            <motion.div
              key={m.label}
              variants={cardVariant}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <p className="text-xs text-gray-500 mb-1">{m.label}</p>
              <p className="text-2xl font-black" style={{ color: m.color }}>{m.value}</p>
              <span className={cn(
                "mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold",
                m.up ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              )}>
                {m.delta} anual
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Engagement trend + Pulse participation */}
        <div className="mb-5 grid gap-5 sm:grid-cols-2">
          <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#0c365c]" />
              Tendencia de engagement
            </h2>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={MOCK_ENGAGEMENT_DATA.slice(-6)}>
                <defs>
                  <linearGradient id="gradEng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0c365c" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0c365c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[60, 80]} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                <Area type="monotone" dataKey="score" name="Engagement" stroke="#0c365c" strokeWidth={2} fill="url(#gradEng)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#10b981]" />
              Participación en pulsos
            </h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={PULSE_PARTICIPATION} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[60, 90]} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} formatter={(v) => [`${v}%`, "Participación"]} />
                <Bar dataKey="tasa" name="Participación" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Heatmap */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#0c365c]" />
              Mapa de calor: Engagement por departamento y mes
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Últimos 12 meses. Color más intenso = mayor engagement.</p>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="w-32 text-left text-xs font-medium text-gray-500 pb-2">Departamento</th>
                  {MONTHS.map((m) => (
                    <th key={m} className="text-center text-xs font-medium text-gray-500 pb-2 min-w-[44px]">
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="space-y-1">
                {DEPARTMENTS.map((dept) => (
                  <tr key={dept}>
                    <td className="pr-3 py-1">
                      <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{dept}</span>
                    </td>
                    {(HEATMAP_DATA[dept] ?? []).map((val, i) => {
                      const { bg, text } = heatColor(val)
                      return (
                        <td key={i} className="py-1 px-0.5">
                          <div
                            className={cn("h-9 w-full rounded-lg flex items-center justify-center text-xs font-bold", text)}
                            style={{ backgroundColor: bg }}
                            title={`${dept} - ${MONTHS[i]}: ${val}`}
                          >
                            {val}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-2 px-6 pb-4">
            <span className="text-xs text-gray-400">Bajo</span>
            {["#ef4444", "#fca5a5", "#fde68a", "#bfdbfe", "#60a5fa", "#167fd0", "#0c365c"].map((c) => (
              <div key={c} className="h-4 w-7 rounded" style={{ backgroundColor: c }} />
            ))}
            <span className="text-xs text-gray-400">Alto</span>
          </div>
        </motion.div>

        {/* Dept comparison + Risk dist */}
        <div className="grid gap-5 sm:grid-cols-2">
          <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#167fd0]" />
              Comparativa por departamento
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MOCK_DEPARTMENT_ENGAGEMENT} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, 100]} />
                <YAxis type="category" dataKey="department" tick={{ fontSize: 10 }} width={100} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                <Bar dataKey="score" name="Engagement" fill="#167fd0" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#ef4444]" />
              Distribución de riesgo
            </h2>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={RISK_DIST} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value">
                    {RISK_DIST.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {RISK_DIST.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-gray-700 flex-1">{d.name}</span>
                    <span className="text-xs font-bold text-gray-900">{d.value} emp.</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
