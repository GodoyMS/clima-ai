"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  BarChart3, TrendingUp, Users, Award, Activity,
  Download, ChevronRight, Calendar, RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { staggerContainer, cardVariant } from "@/lib/motion"
import { cn } from "@/lib/utils"

const REPORT_CATEGORIES = [
  {
    id: "engagement",
    title: "Compromiso",
    description: "Análisis completo del engagement y satisfacción laboral de tu equipo.",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "#0c365c",
    bg: "bg-blue-50",
    lastGenerated: "hace 2 días",
    href: "/admin/reports/engagement",
    stats: [
      { label: "Score actual", value: "74%" },
      { label: "vs. mes anterior", value: "+6pts" },
    ],
  },
  {
    id: "enps",
    title: "eNPS",
    description: "Net Promoter Score de empleados: promotores, pasivos y detractores.",
    icon: <BarChart3 className="h-6 w-6" />,
    color: "#8b5cf6",
    bg: "bg-purple-50",
    lastGenerated: "hace 1 semana",
    href: "/admin/reports/eNPS",
    stats: [
      { label: "Score eNPS", value: "42" },
      { label: "Promotores", value: "57%" },
    ],
  },
  {
    id: "turnover",
    title: "Rotación",
    description: "Tasas de rotación, análisis de causas y métricas de retención.",
    icon: <RefreshCw className="h-6 w-6" />,
    color: "#ef4444",
    bg: "bg-red-50",
    lastGenerated: "hace 3 días",
    href: "/admin/reports/turnover",
    stats: [
      { label: "Tasa actual", value: "8.3%" },
      { label: "vs. industria", value: "-2.4pts" },
    ],
  },
  {
    id: "recognition",
    title: "Reconocimiento",
    description: "Análisis del programa de reconocimiento entre pares y su impacto.",
    icon: <Award className="h-6 w-6" />,
    color: "#f59e0b",
    bg: "bg-amber-50",
    lastGenerated: "hace 1 día",
    href: "/admin/recognition",
    stats: [
      { label: "Este mes", value: "30 rec." },
      { label: "Crecimiento", value: "+35%" },
    ],
  },
  {
    id: "pulses",
    title: "Pulsos",
    description: "Resultados de encuestas, participación y tendencias de respuesta.",
    icon: <Activity className="h-6 w-6" />,
    color: "#10b981",
    bg: "bg-emerald-50",
    lastGenerated: "hace 5 horas",
    href: "/admin/pulses/history",
    stats: [
      { label: "Participación", value: "81%" },
      { label: "Completados", value: "8" },
    ],
  },
  {
    id: "workforce",
    title: "Fuerza laboral",
    description: "Demografía, distribución por departamentos y métricas de plantilla.",
    icon: <Users className="h-6 w-6" />,
    color: "#167fd0",
    bg: "bg-sky-50",
    lastGenerated: "hace 1 semana",
    href: "/admin/analytics",
    stats: [
      { label: "Total empleados", value: "20" },
      { label: "Activos", value: "18" },
    ],
  },
]

const QUICK_STATS = [
  { label: "Engagement general", value: "74%", change: "+6%", positive: true },
  { label: "eNPS", value: "42", change: "+4pts", positive: true },
  { label: "Participación pulsos", value: "81%", change: "+7%", positive: true },
  { label: "Tasa de rotación", value: "8.3%", change: "-2.9%", positive: true },
]

export default function ReportsPage() {
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
            <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Analiza los indicadores clave de tu organización.
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2 rounded-xl"
            onClick={() => alert("Exportando todos los reportes...")}
          >
            <Download className="h-4 w-4" />
            Exportar todo
          </Button>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-700">Resumen Mayo 2026</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {QUICK_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                <span
                  className={cn(
                    "mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold",
                    stat.positive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  )}
                >
                  {stat.change}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Report categories grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {REPORT_CATEGORIES.map((cat) => (
            <motion.div key={cat.id} variants={cardVariant}>
              <Link href={cat.href} className="block group">
                <div className="h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={cn("flex h-12 w-12 items-center justify-center rounded-xl", cat.bg)}
                      style={{ color: cat.color }}
                    >
                      {cat.icon}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {cat.lastGenerated}
                    </span>
                  </div>

                  <h3 className="mb-1 font-semibold text-gray-900">{cat.title}</h3>
                  <p className="mb-4 text-sm text-gray-500 line-clamp-2">{cat.description}</p>

                  {/* Mini stats */}
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    {cat.stats.map((stat) => (
                      <div key={stat.label} className="rounded-lg bg-gray-50 p-2">
                        <p className="text-xs text-gray-500">{stat.label}</p>
                        <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-medium group-hover:underline"
                      style={{ color: cat.color }}
                    >
                      Ver reporte
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
