"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ChevronLeft, Download, TrendingDown, TrendingUp, Users, RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { slideUp, staggerContainer, cardVariant } from "@/lib/motion"
import { MOCK_EMPLOYEES } from "@/lib/mock-data"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const MONTHLY_TURNOVER = [
  { month: "May 2025", rate: 1.2, voluntary: 1, involuntary: 0.2 },
  { month: "Jun 2025", rate: 0.8, voluntary: 0.8, involuntary: 0 },
  { month: "Jul 2025", rate: 1.5, voluntary: 1.2, involuntary: 0.3 },
  { month: "Ago 2025", rate: 0.9, voluntary: 0.6, involuntary: 0.3 },
  { month: "Sep 2025", rate: 1.1, voluntary: 0.8, involuntary: 0.3 },
  { month: "Oct 2025", rate: 1.3, voluntary: 1.0, involuntary: 0.3 },
  { month: "Nov 2025", rate: 0.7, voluntary: 0.7, involuntary: 0 },
  { month: "Dic 2025", rate: 0.6, voluntary: 0.6, involuntary: 0 },
  { month: "Ene 2026", rate: 0.8, voluntary: 0.5, involuntary: 0.3 },
  { month: "Feb 2026", rate: 0.9, voluntary: 0.9, involuntary: 0 },
  { month: "Mar 2026", rate: 0.5, voluntary: 0.5, involuntary: 0 },
  { month: "Abr 2026", rate: 0.5, voluntary: 0.5, involuntary: 0 },
]

const DEPT_TURNOVER = [
  { department: "Ventas", rate: 18.5 },
  { department: "Ingeniería", rate: 6.2 },
  { department: "Marketing", rate: 4.5 },
  { department: "Éxito Cliente", rate: 5.1 },
  { department: "Producto", rate: 3.8 },
  { department: "RRHH", rate: 0 },
]

const VOLUNTARY_PCT = 78
const INVOLUNTARY_PCT = 22

const TYPE_DATA = [
  { name: "Voluntaria", value: VOLUNTARY_PCT, color: "#f97316" },
  { name: "Involuntaria", value: INVOLUNTARY_PCT, color: "#6366f1" },
]

const RETENTION_METRICS = [
  { label: "Retención general", value: "91.7%", icon: "✅" },
  { label: "Tiempo promedio en empresa", value: "2.4 años", icon: "📅" },
  { label: "Costo por reemplazo estimado", value: "$180,000 MXN", icon: "💰" },
  { label: "Tasa vs. industria", value: "-2.4pts mejor", icon: "📊" },
]

export default function TurnoverReportPage() {
  const annualRate = 8.3

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
              <h1 className="text-2xl font-bold text-gray-900">Reporte de Rotación</h1>
              <p className="mt-0.5 text-sm text-gray-500">Análisis de turnover y retención.</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2 rounded-xl text-sm" onClick={() => toast.success("Exportando reporte...")}>
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </motion.div>

        {/* Main turnover rate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm text-center"
        >
          <p className="text-sm font-medium text-gray-500 mb-2">Tasa de rotación anual 2026</p>
          <p className="text-8xl font-black text-[#0c365c]">{annualRate}<span className="text-3xl text-gray-400">%</span></p>
          <p className="text-sm text-gray-500 mt-2">Sobre un total de 20 empleados</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            <TrendingDown className="h-4 w-4" />
            -2.9pts vs. año anterior
          </div>
        </motion.div>

        {/* Retention metrics */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {RETENTION_METRICS.map((m) => (
            <motion.div key={m.label} variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-xl mb-1">{m.icon}</p>
              <p className="text-lg font-bold text-gray-900">{m.value}</p>
              <p className="text-xs text-gray-500">{m.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Monthly chart */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Rotación mensual (últimos 12 meses)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_TURNOVER} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Legend />
              <Bar dataKey="voluntary" name="Voluntaria" stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} />
              <Bar dataKey="involuntary" name="Involuntaria" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="mb-5 grid gap-5 sm:grid-cols-2">
          {/* Department turnover */}
          <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-900">Rotación por departamento</h2>
            <div className="space-y-3">
              {DEPT_TURNOVER.sort((a, b) => b.rate - a.rate).map((dept) => (
                <div key={dept.department}>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="text-gray-600">{dept.department}</span>
                    <span className={cn(
                      "font-semibold",
                      dept.rate > 15 ? "text-red-600" :
                      dept.rate > 8 ? "text-amber-600" : "text-emerald-600"
                    )}>{dept.rate}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(dept.rate / 20) * 100}%`,
                        backgroundColor: dept.rate > 15 ? "#ef4444" : dept.rate > 8 ? "#f59e0b" : "#10b981"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Voluntary vs involuntary */}
          <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-900">Voluntaria vs. Involuntaria</h2>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={TYPE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                    {TYPE_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, ""]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2">
              {TYPE_DATA.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-sm text-gray-700 flex-1">{d.name}</span>
                  <span className="text-sm font-bold text-gray-900">{d.value}%</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500">
              La rotación voluntaria dominante sugiere revisar propuesta de valor al empleado y compensación.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
