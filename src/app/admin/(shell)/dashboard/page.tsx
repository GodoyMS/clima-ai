"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Brain,
  Plus,
  Send,
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
  Award,
  RefreshCw,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { KpiCard } from "@/components/shared/kpi-card"
import { SkeletonCard } from "@/components/shared/skeleton-card"
import { RiskBadge } from "@/components/shared/risk-badge"
import { SectionHeader } from "@/components/shared/section-header"
import { useDashboardKpis, useEngagementData, useDepartmentEngagement } from "@/hooks/use-dashboard"
import { useAuthStore } from "@/store/auth-store"
import { staggerContainer, slideUp, cardVariant } from "@/lib/motion"
import { MOCK_INSIGHTS, MOCK_RECOGNITIONS, MOCK_ANNOUNCEMENTS, MOCK_EMPLOYEES, MOCK_PULSES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const RISK_COLORS: Record<string, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
}

const PIE_COLORS = ["#10b981", "#f59e0b", "#f97316", "#ef4444"]

function formatDate(date: Date) {
  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function timeAgo(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(hours / 24)
  if (days > 0) return `hace ${days}d`
  if (hours > 0) return `hace ${hours}h`
  return "hace poco"
}

const severityConfig = {
  critical: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-500", label: "Crítico" },
  warning: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500", label: "Advertencia" },
  info: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500", label: "Info" },
}

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { data: kpis, isLoading: kpisLoading } = useDashboardKpis()
  const { data: engagementData, isLoading: engLoading } = useEngagementData()
  const { data: departmentData, isLoading: deptLoading } = useDepartmentEngagement()

  const kpiIcons = [
    <Activity key="a" className="h-5 w-5" />,
    <TrendingUp key="t" className="h-5 w-5" />,
    <Users key="u" className="h-5 w-5" />,
    <BarChart3 key="b" className="h-5 w-5" />,
  ]

  // Risk distribution for pie chart
  const riskDistribution = [
    { name: "Bajo", value: MOCK_EMPLOYEES.filter((e) => e.riskLevel === "low").length },
    { name: "Medio", value: MOCK_EMPLOYEES.filter((e) => e.riskLevel === "medium").length },
    { name: "Alto", value: MOCK_EMPLOYEES.filter((e) => e.riskLevel === "high").length },
    { name: "Crítico", value: MOCK_EMPLOYEES.filter((e) => e.riskLevel === "critical").length },
  ]

  const topInsights = MOCK_INSIGHTS.filter((i) => !i.isRead).slice(0, 3)
  const recentRecognitions = MOCK_RECOGNITIONS.slice(0, 4)
  const recentAnnouncements = MOCK_ANNOUNCEMENTS.slice(0, 3)
  const highRiskEmployees = MOCK_EMPLOYEES.filter((e) => e.riskLevel === "high" || e.riskLevel === "critical").slice(0, 5)
  const recentPulses = MOCK_PULSES.slice(0, 4)

  const firstName = user?.name?.split(" ")[0] ?? "Admin"

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      {/* Header */}
      <motion.div variants={slideUp} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenida, {firstName} 👋
          </h1>
          <p className="mt-0.5 text-sm capitalize text-gray-500">{formatDate(new Date())}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push("/admin/pulses")}
            className="flex items-center gap-2 rounded-xl bg-[#0c365c] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0c365c]/90 hover:shadow-md active:scale-95"
          >
            <Send className="h-4 w-4" />
            Lanzar Pulso
          </button>
          <button
            onClick={() => router.push("/admin/employees/new")}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
            Nuevo Empleado
          </button>
          <button
            onClick={() => router.push("/admin/recognition")}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            <Award className="h-4 w-4" />
            Reconocer
          </button>
        </div>
      </motion.div>

      {/* KPI row */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpisLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : kpis?.slice(0, 4).map((kpi, i) => (
              <motion.div key={kpi.id} variants={cardVariant}>
                <KpiCard
                  title={kpi.label}
                  value={kpi.value}
                  unit={kpi.unit || undefined}
                  trend={kpi.trend}
                  trendValue={kpi.trendValue}
                  icon={kpiIcons[i] ?? <Activity className="h-5 w-5" />}
                  color={kpi.color}
                />
              </motion.div>
            ))}
      </motion.div>

      {/* Charts row */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Engagement trend */}
        <motion.div variants={cardVariant} className="xl:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Tendencia de Compromiso"
            description="Últimos 12 meses — Compromiso, Participación y eNPS"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <div className="mt-5 h-56">
            {engLoading ? (
              <div className="flex h-full items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-300" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} domain={[20, 100]} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #f0f0f0", fontSize: 12 }}
                    labelStyle={{ fontWeight: 600, color: "#111" }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="score" name="Compromiso" stroke="#0c365c" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="participation" name="Participación" stroke="#167fd0" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                  <Line type="monotone" dataKey="enps" name="eNPS" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="2 2" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Risk distribution */}
        <motion.div variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Distribución de Riesgo"
            description="Empleados por nivel de riesgo"
            icon={<AlertTriangle className="h-4 w-4" />}
          />
          <div className="mt-5 flex flex-col items-center">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                    {riskDistribution.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #f0f0f0", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid w-full grid-cols-2 gap-2">
              {riskDistribution.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-xs text-gray-500">{item.name}</span>
                  <span className="ml-auto text-xs font-semibold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Insights + Activity */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* AI Insights */}
        <motion.div variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Insights de IA"
            description="Alertas y recomendaciones prioritarias"
            icon={<Brain className="h-4 w-4" />}
            action={
              <button
                onClick={() => router.push("/admin/insights")}
                className="text-xs font-semibold text-[#0c365c] hover:underline"
              >
                Ver todos
              </button>
            }
          />
          <div className="mt-4 space-y-3">
            {topInsights.map((insight) => {
              const cfg = severityConfig[insight.severity]
              return (
                <div
                  key={insight.id}
                  className={cn("rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm", cfg.bg, cfg.border)}
                  onClick={() => router.push("/admin/insights")}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("mt-0.5 h-2 w-2 flex-shrink-0 rounded-full", cfg.dot)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={cn("text-sm font-semibold", cfg.text)}>{insight.title}</p>
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", cfg.bg, cfg.text)}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{insight.description}</p>
                      <p className="mt-1.5 text-xs font-medium text-gray-400">
                        {insight.affectedEmployees} empleados · {timeAgo(insight.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Activity feed */}
        <motion.div variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Actividad Reciente"
            description="Reconocimientos y anuncios"
            icon={<Activity className="h-4 w-4" />}
          />
          <div className="mt-4 space-y-4">
            {recentRecognitions.slice(0, 3).map((rec) => (
              <div key={rec.id} className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <img src={rec.fromAvatar} alt={rec.fromName} className="h-8 w-8 rounded-full" />
                  <span className="absolute -bottom-0.5 -right-0.5 text-xs">{rec.badgeIcon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">{rec.fromName.split(" ")[0]}</span>
                    {" reconoció a "}
                    <span className="font-semibold">{rec.toName.split(" ")[0]}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">{rec.message}</p>
                  <p className="mt-0.5 text-[10px] text-gray-300">{timeAgo(rec.createdAt)}</p>
                </div>
              </div>
            ))}
            <div className="my-2 border-t border-gray-50" />
            {recentAnnouncements.slice(0, 2).map((ann) => (
              <div key={ann.id} className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0c365c]/10">
                  <span className="text-sm">📢</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-700 line-clamp-1">{ann.title}</p>
                  <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">{ann.authorName.split(" ")[0]}</p>
                  <p className="mt-0.5 text-[10px] text-gray-300">{timeAgo(ann.publishedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Department engagement + High risk table */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Department bar chart */}
        <motion.div variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Compromiso por Departamento"
            description="Puntaje actual de engagement"
            icon={<BarChart3 className="h-4 w-4" />}
          />
          <div className="mt-5 h-56">
            {deptLoading ? (
              <div className="flex h-full items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-300" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <YAxis
                    type="category"
                    dataKey="department"
                    tick={{ fontSize: 10, fill: "#6b7280" }}
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #f0f0f0", fontSize: 12 }} />
                  <Bar dataKey="score" name="Compromiso" fill="#0c365c" radius={[0, 6, 6, 0]}>
                    {departmentData?.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.score >= 80 ? "#10b981" : entry.score >= 70 ? "#0c365c" : entry.score >= 60 ? "#f59e0b" : "#ef4444"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* High risk employees table */}
        <motion.div variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Empleados en Riesgo"
            description="Requieren atención inmediata"
            icon={<AlertTriangle className="h-4 w-4" />}
            action={
              <button onClick={() => router.push("/admin/retention-risk")} className="text-xs font-semibold text-[#0c365c] hover:underline">
                Ver todos
              </button>
            }
          />
          <div className="mt-4 space-y-3">
            {highRiskEmployees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => router.push(`/admin/employees/${emp.id}`)}
                className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-gray-50"
              >
                <img src={emp.avatar} alt={emp.name} className="h-8 w-8 flex-shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800">{emp.name}</p>
                  <p className="truncate text-xs text-gray-400">{emp.department}</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-700">{emp.engagementScore}</p>
                    <p className="text-[10px] text-gray-400">score</p>
                  </div>
                  <RiskBadge level={emp.riskLevel} />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Quick actions + Recent pulses */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Quick actions */}
        <motion.div variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <SectionHeader title="Acciones Rápidas" icon={<Activity className="h-4 w-4" />} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "Ver Empleados", icon: Users, href: "/admin/employees", color: "#0c365c" },
              { label: "Crear Pulso", icon: Send, href: "/admin/pulses", color: "#167fd0" },
              { label: "Ver Insights", icon: Brain, href: "/admin/insights", color: "#8b5cf6" },
              { label: "Reconocer", icon: Award, href: "/admin/recognition", color: "#f59e0b" },
              { label: "Reportes", icon: BarChart3, href: "/admin/reports", color: "#10b981" },
              { label: "Analíticas", icon: TrendingUp, href: "/admin/analytics", color: "#f97316" },
            ].map((action) => (
              <button
                key={action.href}
                onClick={() => router.push(action.href)}
                className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50 p-3 text-left transition-all hover:border-gray-200 hover:bg-white hover:shadow-sm"
              >
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: action.color }}
                >
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent pulses */}
        <motion.div variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Pulsos Recientes"
            description="Estado de encuestas activas y recientes"
            icon={<Activity className="h-4 w-4" />}
            action={
              <button onClick={() => router.push("/admin/pulses")} className="text-xs font-semibold text-[#0c365c] hover:underline">
                Ver todos
              </button>
            }
          />
          <div className="mt-4 space-y-3">
            {recentPulses.map((pulse) => {
              const statusConfig = {
                active: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Activo" },
                completed: { bg: "bg-gray-100", text: "text-gray-600", label: "Completado" },
                scheduled: { bg: "bg-blue-100", text: "text-blue-700", label: "Programado" },
                draft: { bg: "bg-amber-100", text: "text-amber-700", label: "Borrador" },
              }[pulse.status]

              return (
                <div key={pulse.id} className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-gray-50">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800">{pulse.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-[#0c365c] transition-all"
                          style={{ width: `${pulse.participationRate}%` }}
                        />
                      </div>
                      <span className="flex-shrink-0 text-xs font-medium text-gray-500">{pulse.participationRate}%</span>
                    </div>
                  </div>
                  <span className={cn("flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold", statusConfig.bg, statusConfig.text)}>
                    {statusConfig.label}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
