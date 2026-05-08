"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Flame,
  Brain,
  AlertTriangle,
  Award,
  TrendingUp,
  Users,
  Activity,
  CheckCircle,
  Shield,
  Clock,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts"
import { useEmployee } from "@/hooks/use-employees"
import { RiskBadge } from "@/components/shared/risk-badge"
import { SkeletonCard } from "@/components/shared/skeleton-card"
import { staggerContainer, slideUp, cardVariant } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { MOCK_RECOGNITIONS } from "@/lib/mock-data"

const SENTIMENT_DATA = [
  { month: "Nov", score: 68 },
  { month: "Dic", score: 65 },
  { month: "Ene", score: 70 },
  { month: "Feb", score: 73 },
  { month: "Mar", score: 75 },
  { month: "Abr", score: 72 },
  { month: "May", score: 74 },
]

type Tab = "resumen" | "pulsos" | "reconocimientos" | "riesgo" | "historial"

const TABS: { key: Tab; label: string }[] = [
  { key: "resumen", label: "Resumen" },
  { key: "pulsos", label: "Pulsos" },
  { key: "reconocimientos", label: "Reconocimientos" },
  { key: "riesgo", label: "Riesgo" },
  { key: "historial", label: "Historial" },
]

const riskFactors = [
  { icon: Activity, label: "Baja participación en pulsos", weight: "alto" },
  { icon: Clock, label: "Ausencias frecuentes en reuniones voluntarias", weight: "medio" },
  { icon: TrendingUp, label: "Caída en engagement últimas 4 semanas", weight: "alto" },
  { icon: Users, label: "Interacción reducida con el equipo", weight: "bajo" },
]

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("resumen")
  const { data: employee, isLoading, error } = useEmployee(id)

  const employeeRecognitions = MOCK_RECOGNITIONS.filter(
    (r) => r.toId === id || r.fromId === id
  ).slice(0, 5)

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 w-32 rounded-xl bg-gray-200" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  if (error || !employee) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
          <p className="mt-3 font-semibold text-gray-700">Empleado no encontrado</p>
          <button onClick={() => router.back()} className="mt-4 text-sm font-medium text-[#0c365c] hover:underline">
            Volver
          </button>
        </div>
      </div>
    )
  }

  const statusConfig = {
    active: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Activo" },
    inactive: { bg: "bg-gray-100", text: "text-gray-500", label: "Inactivo" },
    onboarding: { bg: "bg-blue-100", text: "text-blue-700", label: "Onboarding" },
  }[employee.status]

  const riskGaugeData = [
    { name: "Riesgo", value: employee.riskScore, fill: employee.riskLevel === "critical" ? "#ef4444" : employee.riskLevel === "high" ? "#f97316" : employee.riskLevel === "medium" ? "#f59e0b" : "#10b981" },
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      {/* Back button */}
      <motion.button
        variants={slideUp}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#0c365c]"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Empleados
      </motion.button>

      {/* Profile header */}
      <motion.div variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="relative flex-shrink-0">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="h-20 w-20 rounded-2xl object-cover ring-4 ring-gray-100"
            />
            <span className={cn("absolute -bottom-1.5 -right-1.5 rounded-full px-2 py-0.5 text-xs font-semibold", statusConfig.bg, statusConfig.text)}>
              {statusConfig.label}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
                <p className="mt-0.5 text-sm font-medium text-gray-500">{employee.role}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-[#0c365c]/10 px-2.5 py-1 text-xs font-semibold text-[#0c365c]">
                    {employee.department}
                  </span>
                  <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {employee.team}
                  </span>
                </div>
              </div>
              <RiskBadge level={employee.riskLevel} className="flex-shrink-0" />
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              {[
                { icon: Mail, value: employee.email },
                { icon: Phone, value: employee.phone },
                { icon: MapPin, value: employee.location },
                { icon: Calendar, value: `Desde ${new Date(employee.startDate).getFullYear()}` },
              ].map(({ icon: Icon, value }) => (
                <div key={value} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Icon className="h-3.5 w-3.5 text-gray-400" />
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Badges */}
        {employee.badges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-50 pt-4">
            {employee.badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5"
                title={badge.description}
              >
                <span className="text-sm">{badge.icon}</span>
                <span className="text-xs font-medium text-gray-700">{badge.name}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={slideUp} className="flex gap-1 rounded-xl border border-gray-100 bg-white p-1 shadow-sm overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeTab === tab.key ? "bg-[#0c365c] text-white shadow-sm" : "text-gray-500 hover:text-gray-800"
            )}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "resumen" && (
            <div className="space-y-6">
              {/* Stats row */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: "Score de Compromiso", value: employee.engagementScore, unit: "%", icon: TrendingUp, color: "#0c365c" },
                  { label: "Score de Riesgo", value: employee.riskScore, unit: "%", icon: AlertTriangle, color: "#ef4444" },
                  { label: "Racha Activa", value: employee.streakDays, unit: "días", icon: Flame, color: "#f97316" },
                  { label: "Insignias", value: employee.badges.length, unit: "", icon: Award, color: "#f59e0b" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                        style={{ backgroundColor: stat.color }}
                      >
                        <stat.icon className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-gray-900">
                      {stat.value}{stat.unit}
                    </p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Sentiment chart + AI recommendations */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-800">Tendencia de Bienestar</h3>
                  <p className="mt-0.5 text-xs text-gray-400">Últimos 7 meses</p>
                  <div className="mt-4 h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={SENTIMENT_DATA} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} domain={[50, 100]} />
                        <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: "1px solid #f0f0f0" }} />
                        <Line type="monotone" dataKey="score" stroke="#0c365c" strokeWidth={2.5} dot={{ fill: "#0c365c", r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AI recommendations */}
                <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-blue-50 p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0c365c]">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">Recomendaciones IA</h3>
                      <p className="text-xs text-gray-400">Basadas en patrones de comportamiento</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      "Programar una conversación 1:1 sobre desarrollo profesional en los próximos 7 días",
                      "Revisar la carga de trabajo actual — los indicadores sugieren posible sobrecarga",
                      "Considerar nominación al programa de reconocimiento mensual",
                      `El manager ${employee.manager ? employee.manager.split(" ")[0] : "directo"} debería hacer check-in esta semana`,
                    ].map((rec, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#0c365c]" />
                        <p className="text-xs text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent recognitions */}
              {employeeRecognitions.length > 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-800">Reconocimientos Recientes</h3>
                  <div className="mt-4 space-y-4">
                    {employeeRecognitions.slice(0, 3).map((rec) => (
                      <div key={rec.id} className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          <img src={rec.fromAvatar} alt={rec.fromName} className="h-8 w-8 rounded-full" />
                          <span className="absolute -bottom-0.5 -right-0.5 text-xs">{rec.badgeIcon}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-700">
                            {rec.fromId === id ? `Reconoció a ${rec.toName.split(" ")[0]}` : `Reconocimiento de ${rec.fromName.split(" ")[0]}`}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{rec.message}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span
                              className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                              style={{ backgroundColor: rec.badgeColor }}
                            >
                              {rec.badge}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "reconocimientos" && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-800">Todos los Reconocimientos</h3>
              {employeeRecognitions.length === 0 ? (
                <div className="py-12 text-center">
                  <Award className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-3 text-sm text-gray-400">Sin reconocimientos aún</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {employeeRecognitions.map((rec) => (
                    <div key={rec.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-start gap-3">
                        <img src={rec.fromAvatar} alt={rec.fromName} className="h-9 w-9 flex-shrink-0 rounded-full" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <p className="text-sm font-semibold text-gray-800">
                              {rec.fromId === id ? `→ ${rec.toName}` : `← ${rec.fromName}`}
                            </p>
                            <span
                              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
                              style={{ backgroundColor: rec.badgeColor }}
                            >
                              {rec.badgeIcon} {rec.badge}
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{rec.message}</p>
                          <div className="mt-2 flex items-center gap-3">
                            {rec.reactions.map((r) => (
                              <span key={r.emoji} className="text-xs text-gray-400">{r.emoji} {r.count}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "riesgo" && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Risk gauge */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-800">Score de Riesgo</h3>
                  <div className="mt-4 flex flex-col items-center">
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="60%" innerRadius="60%" outerRadius="90%" data={riskGaugeData} startAngle={180} endAngle={0}>
                          <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#f3f4f6" }} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="-mt-8 text-center">
                      <p className="text-4xl font-bold text-gray-900">{employee.riskScore}</p>
                      <p className="text-sm text-gray-400">/ 100</p>
                      <div className="mt-2">
                        <RiskBadge level={employee.riskLevel} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk factors */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-800">Factores de Riesgo</h3>
                  <div className="mt-4 space-y-3">
                    {riskFactors.map((factor) => {
                      const weightConfigs: Record<string, { bg: string; text: string; label: string }> = {
                        alto: { bg: "bg-red-50", text: "text-red-600", label: "Alto" },
                        medio: { bg: "bg-amber-50", text: "text-amber-600", label: "Medio" },
                        bajo: { bg: "bg-blue-50", text: "text-blue-600", label: "Bajo" },
                      }
                      const weightConfig = weightConfigs[factor.weight] ?? weightConfigs.medio
                      return (
                        <div key={factor.label} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#0c365c]/10">
                            <factor.icon className="h-4 w-4 text-[#0c365c]" />
                          </div>
                          <p className="flex-1 text-xs text-gray-700">{factor.label}</p>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", weightConfig.bg, weightConfig.text)}>
                            {weightConfig.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Retention recommendations */}
              <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-amber-600" />
                  <h3 className="text-sm font-semibold text-gray-800">Recomendaciones de Retención</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { icon: "🗣️", text: "Conversación 1:1 urgente con foco en motivación y expectativas" },
                    { icon: "🎯", text: "Revisar y clarificar el plan de carrera y crecimiento profesional" },
                    { icon: "💰", text: "Evaluar si la compensación está alineada con el mercado actual" },
                    { icon: "🤝", text: "Asignar un buddy o mentor del equipo para fortalecer vínculos" },
                  ].map((r) => (
                    <div key={r.text} className="flex items-start gap-2.5 rounded-xl bg-white/70 p-3">
                      <span className="text-lg leading-none">{r.icon}</span>
                      <p className="text-xs text-gray-700">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(activeTab === "pulsos" || activeTab === "historial") && (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
              <Activity className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-3 font-semibold text-gray-500">
                {activeTab === "pulsos" ? "Historial de pulsos" : "Historial de actividad"}
              </p>
              <p className="mt-1 text-sm text-gray-400">Esta funcionalidad estará disponible próximamente</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
