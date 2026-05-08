"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  AlertCircle, AlertTriangle, ShieldAlert, ShieldCheck,
  Users, Filter, ChevronRight, TrendingUp, ArrowUpDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts"
import { staggerContainer, cardVariant, slideUp } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { MOCK_EMPLOYEES } from "@/lib/mock-data"
import type { Employee } from "@/lib/types"

const RISK_CONFIG = {
  critical: { label: "Crítico", color: "#ef4444", bg: "bg-red-100", text: "text-red-700", icon: <AlertCircle className="h-4 w-4" /> },
  high: { label: "Alto", color: "#f97316", bg: "bg-orange-100", text: "text-orange-700", icon: <AlertTriangle className="h-4 w-4" /> },
  medium: { label: "Medio", color: "#f59e0b", bg: "bg-yellow-100", text: "text-yellow-700", icon: <ShieldAlert className="h-4 w-4" /> },
  low: { label: "Bajo", color: "#10b981", bg: "bg-green-100", text: "text-green-700", icon: <ShieldCheck className="h-4 w-4" /> },
}

const RISK_FACTORS: Record<string, string[]> = {
  "emp-003": ["Baja participación en pulsos", "Score de engagement < 60", "Pocas respuestas recientes"],
  "emp-013": ["Engagement en descenso", "Sin reconocimientos recibidos en 30d", "Poca interacción en pulsos"],
  "emp-017": ["Onboarding en riesgo", "Baja participación (1 streak)", "Score crítico de engagement"],
  "emp-011": ["Trabajo fuera de horario", "Caída de engagement en Q2", "Carga alta autoreportada"],
  "emp-015": ["Posible estancamiento de carrera", "18+ meses sin cambio de rol"],
  "emp-009": ["Carga de trabajo alta detectada", "Score de bienestar < 70"],
  "emp-019": ["Actividad irregular en pulsos", "Carga autoreportada alta"],
  "emp-005": ["Onboarding reciente - monitoreo activo"],
  "emp-016": ["Sin alertas activas", "Participación regular"],
  "emp-020": ["Sin alertas activas"],
}

const PREDICTED_DEPARTURE: Record<string, string> = {
  "emp-017": "30-60 días",
  "emp-003": "60-90 días",
  "emp-013": "60-90 días",
  "emp-011": "90-120 días",
  "emp-015": "90-120 días",
  "emp-009": "120-180 días",
  "emp-019": "120-180 días",
}

type SortKey = "riskScore" | "name" | "department"

export default function RetentionRiskPage() {
  const [departmentFilter, setDepartmentFilter] = useState("Todos")
  const [riskFilter, setRiskFilter] = useState("Todos")
  const [sortKey, setSortKey] = useState<SortKey>("riskScore")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const departments = ["Todos", ...Array.from(new Set(MOCK_EMPLOYEES.map((e) => e.department)))]
  const riskLevels = ["Todos", "critical", "high", "medium", "low"]

  const filtered = MOCK_EMPLOYEES
    .filter((e) => departmentFilter === "Todos" || e.department === departmentFilter)
    .filter((e) => riskFilter === "Todos" || e.riskLevel === riskFilter)
    .sort((a, b) => {
      let diff = 0
      if (sortKey === "riskScore") diff = a.riskScore - b.riskScore
      else if (sortKey === "name") diff = a.name.localeCompare(b.name)
      else if (sortKey === "department") diff = a.department.localeCompare(b.department)
      return sortDir === "desc" ? -diff : diff
    })

  const counts = {
    critical: MOCK_EMPLOYEES.filter((e) => e.riskLevel === "critical").length,
    high: MOCK_EMPLOYEES.filter((e) => e.riskLevel === "high").length,
    medium: MOCK_EMPLOYEES.filter((e) => e.riskLevel === "medium").length,
    low: MOCK_EMPLOYEES.filter((e) => e.riskLevel === "low").length,
  }

  const chartData = [
    { name: "Crítico", count: counts.critical, color: "#ef4444" },
    { name: "Alto", count: counts.high, color: "#f97316" },
    { name: "Medio", count: counts.medium, color: "#f59e0b" },
    { name: "Bajo", count: counts.low, color: "#10b981" },
  ]

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("desc") }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900">Riesgo de Retención</h1>
          <p className="mt-1 text-sm text-gray-500">
            Identifica y actúa sobre empleados con mayor probabilidad de abandono.
          </p>
        </motion.div>

        {/* Summary cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {(["critical", "high", "medium", "low"] as const).map((level) => {
            const cfg = RISK_CONFIG[level]
            return (
              <motion.div
                key={level}
                variants={cardVariant}
                className={cn(
                  "cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md",
                  riskFilter === level && "ring-2 ring-[#0c365c]"
                )}
                onClick={() => setRiskFilter(riskFilter === level ? "Todos" : level)}
              >
                <div className={cn("mb-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", cfg.bg, cfg.text)}>
                  {cfg.icon}
                  {cfg.label}
                </div>
                <p className="text-3xl font-bold text-gray-900">{counts[level]}</p>
                <p className="text-xs text-gray-500">empleados</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Chart */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <TrendingUp className="h-4 w-4 text-[#0c365c]" />
            Distribución de riesgo por nivel
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={48}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Filters */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-5 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Departamento:</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {departments.slice(0, 5).map((dept) => (
              <button
                key={dept}
                onClick={() => setDepartmentFilter(dept)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                  departmentFilter === dept
                    ? "border-[#0c365c] bg-[#0c365c] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                )}
              >
                {dept}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Employee table */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-left font-medium text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-700" onClick={() => toggleSort("name")}>
                      Empleado <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-700" onClick={() => toggleSort("department")}>
                      Departamento <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-700" onClick={() => toggleSort("riskScore")}>
                      Score de riesgo <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </th>
                  <th className="hidden md:table-cell px-5 py-3 text-left font-medium text-gray-500">Factores clave</th>
                  <th className="hidden lg:table-cell px-5 py-3 text-left font-medium text-gray-500">Salida estimada</th>
                  <th className="px-5 py-3 text-right font-medium text-gray-500">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((emp) => {
                  const cfg = RISK_CONFIG[emp.riskLevel]
                  const factors = RISK_FACTORS[emp.id] ?? ["Sin factores detectados"]
                  const departure = PREDICTED_DEPARTURE[emp.id]
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="h-8 w-8 rounded-full bg-gray-100"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{emp.name}</p>
                            <p className="text-xs text-gray-500">{emp.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 text-xs">{emp.department}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Progress
                            value={emp.riskScore}
                            className="h-1.5 flex-1 bg-gray-100"
                          />
                          <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-bold", cfg.bg, cfg.text)}>
                            {emp.riskScore}
                          </span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {factors.slice(0, 2).map((f, i) => (
                            <span key={i} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                              {f}
                            </span>
                          ))}
                          {factors.length > 2 && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
                              +{factors.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="hidden lg:table-cell px-5 py-3.5 text-xs text-gray-500">
                        {departure ?? "Sin predicción"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link href={`/admin/retention-risk/${emp.id}`}>
                          <Button
                            size="sm"
                            className="gap-1.5 bg-[#0c365c] hover:bg-[#0a2d4e] text-white rounded-xl text-xs"
                          >
                            Tomar acción
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
