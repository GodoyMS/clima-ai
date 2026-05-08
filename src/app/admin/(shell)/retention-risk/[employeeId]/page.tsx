"use client"

import { use } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ChevronLeft, AlertCircle, AlertTriangle, ShieldAlert, ShieldCheck,
  TrendingDown, TrendingUp, Brain, CheckSquare, Calendar, Mail, Phone,
  MapPin, Clock, Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts"
import { staggerContainer, cardVariant, slideUp } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { MOCK_EMPLOYEES } from "@/lib/mock-data"
import { toast } from "sonner"

const RISK_CONFIG = {
  critical: { label: "Crítico", color: "#ef4444", bg: "bg-red-100", text: "text-red-700", icon: <AlertCircle className="h-4 w-4" /> },
  high: { label: "Alto", color: "#f97316", bg: "bg-orange-100", text: "text-orange-700", icon: <AlertTriangle className="h-4 w-4" /> },
  medium: { label: "Medio", color: "#f59e0b", bg: "bg-yellow-100", text: "text-yellow-700", icon: <ShieldAlert className="h-4 w-4" /> },
  low: { label: "Bajo", color: "#10b981", bg: "bg-green-100", text: "text-green-700", icon: <ShieldCheck className="h-4 w-4" /> },
}

const TREND_90D = [
  { day: "Día 1", score: 72 },
  { day: "Día 15", score: 70 },
  { day: "Día 30", score: 67 },
  { day: "Día 45", score: 63 },
  { day: "Día 60", score: 59 },
  { day: "Día 75", score: 55 },
  { day: "Día 90", score: 52 },
]

const RISK_FACTORS_DATA = [
  { factor: "Participación pulsos", weight: 35, value: 28 },
  { factor: "Score de bienestar", weight: 25, value: 18 },
  { factor: "Reconocimientos", weight: 20, value: 8 },
  { factor: "Tiempo en empresa", weight: 10, value: 5 },
  { factor: "Actividad horaria", weight: 10, value: 9 },
]

const TIMELINE_EVENTS = [
  { date: "2026-05-01", event: "Baja participación detectada en pulso semanal", type: "warning" },
  { date: "2026-04-22", event: "Score de engagement cayó por debajo de 60", type: "critical" },
  { date: "2026-04-15", event: "Sin reconocimientos recibidos en 30 días", type: "warning" },
  { date: "2026-04-08", event: "Patrón de trabajo nocturno detectado", type: "info" },
  { date: "2026-03-25", event: "Primera señal de distanciamiento en reuniones", type: "info" },
]

const ACTION_PLAN = [
  "Reunión 1:1 de carrera con manager directo (esta semana)",
  "Revisar y ajustar carga de trabajo actual",
  "Ofrecer oportunidad de mentoría o proyecto especial",
  "Revisar compensación vs. mercado (RRHH)",
  "Check-in semanal de bienestar durante próximas 4 semanas",
  "Conectar con HR Business Partner asignado",
]

export default function EmployeeRetentionRiskPage({ params }: { params: Promise<{ employeeId: string }> }) {
  const { employeeId } = use(params)
  const employee = MOCK_EMPLOYEES.find((e) => e.id === employeeId)

  if (!employee) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Empleado no encontrado.</p>
          <Link href="/admin/retention-risk">
            <Button className="mt-4">Volver</Button>
          </Link>
        </div>
      </div>
    )
  }

  const cfg = RISK_CONFIG[employee.riskLevel]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <Link href="/admin/retention-risk">
            <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl text-gray-600">
              <ChevronLeft className="h-4 w-4" />
              Riesgo de Retención
            </Button>
          </Link>
        </motion.div>

        {/* Employee profile */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start gap-5">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="h-16 w-16 rounded-2xl bg-gray-100"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{employee.name}</h1>
                  <p className="text-sm text-gray-500">{employee.role} · {employee.department}</p>
                </div>
                <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold", cfg.bg, cfg.text)}>
                  {cfg.icon}
                  Riesgo {cfg.label}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{employee.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{employee.phone}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{employee.location}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Desde {new Date(employee.startDate).toLocaleDateString("es-MX", { month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          {/* Key metrics */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Score de riesgo", value: `${employee.riskScore}/100`, color: cfg.color },
              { label: "Engagement", value: `${employee.engagementScore}/100`, color: "#10b981" },
              { label: "Racha de pulsos", value: `${employee.streakDays} días`, color: "#167fd0" },
              { label: "Insignias", value: employee.badges.length.toString(), color: "#f59e0b" },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-xs text-gray-500">{m.label}</p>
                <p className="mt-1 text-lg font-bold" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risk score gauge */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="mb-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 font-semibold text-gray-900">Score de riesgo</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="mb-2 flex justify-between text-xs text-gray-500">
                <span>Bajo riesgo</span>
                <span>Alto riesgo</span>
              </div>
              <div className="relative h-4 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                  style={{
                    width: `${employee.riskScore}%`,
                    background: `linear-gradient(to right, #10b981, #f59e0b, ${cfg.color})`,
                  }}
                />
                <div
                  className="absolute top-0 h-4 w-1 bg-gray-900 rounded-full"
                  style={{ left: `calc(${employee.riskScore}% - 2px)` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-emerald-600">0</span>
                <span className="text-amber-600">50</span>
                <span className="text-red-600">100</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black" style={{ color: cfg.color }}>{employee.riskScore}</p>
              <p className="text-xs text-gray-500">{cfg.label}</p>
            </div>
          </div>
        </motion.div>

        <div className="mb-5 grid gap-5 sm:grid-cols-2">
          {/* Risk factors breakdown */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <h2 className="mb-4 font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#0c365c]" />
              Factores de riesgo
            </h2>
            <div className="space-y-3">
              {RISK_FACTORS_DATA.map((f) => (
                <div key={f.factor}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-gray-600">{f.factor}</span>
                    <span className="font-medium text-gray-900">{f.value}/{f.weight}pts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={(f.value / f.weight) * 100} className="h-1.5 flex-1 bg-gray-100" />
                    <span className="text-xs text-gray-400 w-8 text-right">
                      {Math.round((f.value / f.weight) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 90-day trend */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <h2 className="mb-4 font-semibold text-gray-900 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Tendencia 90 días
            </h2>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={TREND_90D}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[40, 80]} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 11 }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={cfg.color}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: cfg.color }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Action plan */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="mb-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-1 font-semibold text-gray-900 flex items-center gap-2">
            <Brain className="h-4 w-4 text-[#0c365c]" />
            Plan de intervención de IA
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            Acciones recomendadas para reducir el riesgo de rotación de {employee.name.split(" ")[0]}.
          </p>
          <div className="space-y-2">
            {ACTION_PLAN.map((action, i) => (
              <label
                key={i}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded accent-[#0c365c]" />
                <span className="text-sm text-gray-700">{action}</span>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            Línea de tiempo de eventos
          </h2>
          <div className="relative space-y-4 pl-4">
            <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gray-100" />
            {TIMELINE_EVENTS.map((ev, i) => (
              <div key={i} className="relative flex gap-4">
                <div
            className={cn(
                      "absolute left-[-5px] mt-1 h-2.5 w-2.5 rounded-full border-2 border-white",
                    ev.type === "critical" ? "bg-red-500" :
                    ev.type === "warning" ? "bg-amber-500" : "bg-blue-400"
                  )}
                />
                <div className="flex-1">
                  <p className="text-xs text-gray-400">
                    {new Date(ev.date).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                  </p>
                  <p className="text-sm text-gray-700">{ev.event}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="flex flex-wrap gap-3">
          <Button
            className="gap-2 bg-[#0c365c] hover:bg-[#0a2d4e] text-white rounded-xl"
            onClick={() => toast.success(`Reunión 1:1 agendada con ${employee.name.split(" ")[0]}`)}
          >
            <CheckSquare className="h-4 w-4" />
            Agendar 1:1 ahora
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-xl"
            onClick={() => toast.info("Notificación enviada al manager directo.")}
          >
            Notificar al manager
          </Button>
        </div>
      </div>
    </div>
  )
}
