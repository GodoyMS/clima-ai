"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ChevronLeft, Download, FileText, TrendingUp, Users, BarChart3, Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell
} from "recharts"
import { slideUp, staggerContainer, cardVariant } from "@/lib/motion"
import { MOCK_ENGAGEMENT_DATA, MOCK_DEPARTMENT_ENGAGEMENT } from "@/lib/mock-data"
import { toast } from "sonner"

const DEPT_COLORS = ["#0c365c", "#167fd0", "#10b981", "#8b5cf6", "#f97316", "#f59e0b"]

const KEY_INSIGHTS = [
  "El equipo de Marketing lidera el engagement con 88/100, tercer mes consecutivo.",
  "La tasa de participación en pulsos aumentó 7 puntos porcentuales desde febrero.",
  "El equipo de Ventas presenta el engagement más bajo (62) y requiere atención prioritaria.",
  "El programa de reconocimiento lanzado en abril correlaciona con +4pts de engagement general.",
]

export default function EngagementReportPage() {
  const [dateFrom, setDateFrom] = useState("2025-05-01")
  const [dateTo, setDateTo] = useState("2026-04-30")

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
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-[#0c365c]" />
                Reporte de Compromiso
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">Análisis completo del nivel de engagement.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 rounded-xl text-sm" onClick={() => toast.success("Exportando como PDF...")}>
              <FileText className="h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" className="gap-2 rounded-xl text-sm" onClick={() => toast.success("Exportando como CSV...")}>
              <Download className="h-4 w-4" />
              CSV
            </Button>
          </div>
        </motion.div>

        {/* Date range */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <span className="text-sm font-medium text-gray-600">Período:</span>
          <div className="flex items-center gap-2">
            <Input type="date" className="rounded-xl border-gray-200 w-40 text-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <span className="text-gray-400">—</span>
            <Input type="date" className="rounded-xl border-gray-200 w-40 text-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <Button size="sm" className="bg-[#0c365c] text-white rounded-xl ml-auto">Aplicar</Button>
        </motion.div>

        {/* Summary KPIs */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { label: "Score de engagement", value: "74", unit: "/100", color: "#0c365c", icon: <Activity className="h-4 w-4" /> },
            { label: "Participación en pulsos", value: "81", unit: "%", color: "#10b981", icon: <BarChart3 className="h-4 w-4" /> },
            { label: "Empleados activos", value: "18", unit: "/20", color: "#167fd0", icon: <Users className="h-4 w-4" /> },
            { label: "Variación anual", value: "+12", unit: "pts", color: "#f59e0b", icon: <TrendingUp className="h-4 w-4" /> },
          ].map((kpi) => (
            <motion.div key={kpi.label} variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2" style={{ color: kpi.color }}>
                {kpi.icon}
                <span className="text-xs font-medium text-gray-500">{kpi.label}</span>
              </div>
              <p className="text-2xl font-black text-gray-900">
                {kpi.value}<span className="text-sm font-medium text-gray-400">{kpi.unit}</span>
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Engagement over time */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Engagement a lo largo del tiempo</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MOCK_ENGAGEMENT_DATA}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0c365c" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0c365c" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorParticipation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[50, 100]} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Legend />
              <Area type="monotone" dataKey="score" name="Score Engagement" stroke="#0c365c" strokeWidth={2} fill="url(#colorScore)" />
              <Area type="monotone" dataKey="participation" name="Participación" stroke="#10b981" strokeWidth={2} fill="url(#colorParticipation)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department breakdown */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Engagement por departamento</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_DEPARTMENT_ENGAGEMENT} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <YAxis type="category" dataKey="department" tick={{ fontSize: 11 }} width={110} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Bar dataKey="score" name="Score" radius={[0, 6, 6, 0]}>
                {MOCK_DEPARTMENT_ENGAGEMENT.map((entry, i) => (
                  <Cell key={entry.department} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Key insights */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#0c365c]" />
            Insights clave del período
          </h2>
          <ul className="space-y-3">
            {KEY_INSIGHTS.map((insight, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0c365c]/10 text-[#0c365c] text-xs font-bold">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700">{insight}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
