"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  Users,
  AlertTriangle,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
} from "lucide-react"
import { RiskBadge } from "@/components/shared/risk-badge"
import { SkeletonCard } from "@/components/shared/skeleton-card"
import { SectionHeader } from "@/components/shared/section-header"
import { useEmployees } from "@/hooks/use-employees"
import { staggerContainer, slideUp, cardVariant } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { Employee } from "@/lib/types"

type FilterType = "all" | "high-risk" | "active" | "inactive"

const ITEMS_PER_PAGE = 10

function EngagementBar({ value }: { value: number }) {
  const color = value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-red-500"
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} />
      </div>
      <span className="w-8 text-right text-xs font-semibold text-gray-700">{value}</span>
    </div>
  )
}

export default function EmployeesPage() {
  const router = useRouter()
  const { data: employees, isLoading, error } = useEmployees()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [view, setView] = useState<"table" | "grid">("table")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!employees) return []
    let list = employees
    if (filter === "high-risk") list = list.filter((e) => e.riskLevel === "high" || e.riskLevel === "critical")
    else if (filter === "active") list = list.filter((e) => e.status === "active")
    else if (filter === "inactive") list = list.filter((e) => e.status === "inactive")
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q)
      )
    }
    return list
  }, [employees, filter, search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const avgEngagement = employees
    ? Math.round(employees.reduce((s, e) => s + e.engagementScore, 0) / employees.length)
    : 0
  const highRiskCount = employees?.filter((e) => e.riskLevel === "high" || e.riskLevel === "critical").length ?? 0

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "high-risk", label: "Alto Riesgo" },
    { key: "active", label: "Activos" },
    { key: "inactive", label: "Inactivos" },
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      {/* Header */}
      <motion.div variants={slideUp} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SectionHeader
          title="Empleados"
          description={`${employees?.length ?? 0} colaboradores registrados en la plataforma`}
          icon={<Users className="h-4 w-4" />}
        />
        <button
          onClick={() => router.push("/admin/employees/new")}
          className="flex items-center gap-2 rounded-xl bg-[#0c365c] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0c365c]/90 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Nuevo Empleado
        </button>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Empleados", value: employees?.length ?? 0, icon: Users, color: "#0c365c", sub: "colaboradores activos" },
          { label: "Engagement Promedio", value: `${avgEngagement}%`, icon: Users, color: "#167fd0", sub: "puntuación media" },
          { label: "En Alto Riesgo", value: highRiskCount, icon: AlertTriangle, color: "#ef4444", sub: "requieren atención" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={cardVariant}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: stat.color }}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters + search */}
      <motion.div variants={slideUp} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {filterButtons.map((f) => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setPage(1) }}
              className={cn(
                "rounded-xl px-3.5 py-2 text-sm font-medium transition-all",
                filter === f.key
                  ? "bg-[#0c365c] text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Buscar empleados..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#0c365c] focus:bg-white focus:ring-2 focus:ring-[#0c365c]/10"
            />
          </div>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setView("table")}
              className={cn("px-3 py-2 transition-colors", view === "table" ? "bg-[#0c365c] text-white" : "bg-white text-gray-400 hover:bg-gray-50")}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("grid")}
              className={cn("px-3 py-2 transition-colors", view === "grid" ? "bg-[#0c365c] text-white" : "bg-white text-gray-400 hover:bg-gray-50")}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="flex items-center justify-center rounded-2xl border border-red-100 bg-red-50 p-12 text-center">
          <div>
            <AlertTriangle className="mx-auto h-10 w-10 text-red-400" />
            <p className="mt-3 font-semibold text-red-600">Error al cargar empleados</p>
            <p className="mt-1 text-sm text-red-400">Intenta recargar la página</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-16 text-center">
          <div>
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 font-semibold text-gray-500">Sin resultados</p>
            <p className="mt-1 text-sm text-gray-400">Intenta con otros filtros o términos de búsqueda</p>
          </div>
        </div>
      ) : view === "table" ? (
        <motion.div variants={cardVariant} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Empleado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Departamento</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 md:table-cell">Equipo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Compromiso</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Riesgo</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 lg:table-cell">Último Pulso</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((emp) => (
                  <EmployeeRow key={emp.id} employee={emp} onView={() => router.push(`/admin/employees/${emp.id}`)} />
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={staggerContainer} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {paginated.map((emp) => (
            <motion.div key={emp.id} variants={cardVariant}>
              <EmployeeCard employee={emp} onView={() => router.push(`/admin/employees/${emp.id}`)} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={slideUp} className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:border-gray-300 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all",
                  p === page ? "bg-[#0c365c] text-white" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:border-gray-300 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

function EmployeeRow({ employee: emp, onView }: { employee: Employee; onView: () => void }) {
  const statusConfig = {
    active: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Activo" },
    inactive: { bg: "bg-gray-100", text: "text-gray-500", label: "Inactivo" },
    onboarding: { bg: "bg-blue-100", text: "text-blue-700", label: "Onboarding" },
  }[emp.status]

  return (
    <tr
      className="group cursor-pointer transition-colors hover:bg-gray-50/80"
      onClick={onView}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img src={emp.avatar} alt={emp.name} className="h-8 w-8 flex-shrink-0 rounded-full" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">{emp.name}</p>
            <p className="truncate text-xs text-gray-400">{emp.email}</p>
          </div>
          <span className={cn("flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold", statusConfig.bg, statusConfig.text)}>
            {statusConfig.label}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-gray-600">{emp.department}</p>
        <p className="text-xs text-gray-400">{emp.role}</p>
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <p className="text-sm text-gray-600">{emp.team}</p>
      </td>
      <td className="px-4 py-3">
        <EngagementBar value={emp.engagementScore} />
      </td>
      <td className="px-4 py-3">
        <RiskBadge level={emp.riskLevel} />
      </td>
      <td className="hidden px-4 py-3 lg:table-cell">
        <p className="text-xs text-gray-500">{emp.lastPulse || "—"}</p>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={(e) => { e.stopPropagation(); onView() }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:bg-gray-50"
        >
          <Eye className="h-3.5 w-3.5" />
          Ver
        </button>
      </td>
    </tr>
  )
}

function EmployeeCard({ employee: emp, onView }: { employee: Employee; onView: () => void }) {
  return (
    <div
      onClick={onView}
      className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img src={emp.avatar} alt={emp.name} className="h-10 w-10 rounded-full ring-2 ring-gray-100" />
          <div>
            <p className="font-semibold text-gray-800">{emp.name}</p>
            <p className="text-xs text-gray-400">{emp.role}</p>
          </div>
        </div>
        <button className="rounded-lg p-1.5 text-gray-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Departamento</span>
          <span className="font-medium text-gray-700">{emp.department}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Compromiso</span>
          <EngagementBar value={emp.engagementScore} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Riesgo</span>
          <RiskBadge level={emp.riskLevel} />
        </div>
      </div>
    </div>
  )
}
