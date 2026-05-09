"use client"

import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  UsersRound,
  Activity,
  Sparkles,
  AlertTriangle,
  Award,
  BarChart3,
  TrendingUp,
  Megaphone,
  MessageSquare,
  Settings,
  User,
  Plus,
  Search,
  X,
} from "lucide-react"
import { useAdminStore } from "@/store/admin-store"
import { MOCK_EMPLOYEES } from "@/lib/mock-data"
import { modalOverlay, modalContent } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface CommandItem {
  id: string
  label: string
  sublabel?: string
  icon: React.ElementType
  href?: string
  action?: () => void
  group: "navigation" | "employees" | "actions"
}

const navItems: CommandItem[] = [
  { id: "nav-dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard", group: "navigation" },
  { id: "nav-employees", label: "Empleados", icon: Users, href: "/admin/employees", group: "navigation" },
  { id: "nav-teams", label: "Equipos", icon: UsersRound, href: "/admin/teams", group: "navigation" },
  { id: "nav-pulses", label: "Pulsos", icon: Activity, href: "/admin/pulses", group: "navigation" },
  { id: "nav-insights", label: "Insights IA", icon: Sparkles, href: "/admin/insights", group: "navigation" },
  { id: "nav-risk", label: "Riesgo de Retención", icon: AlertTriangle, href: "/admin/retention-risk", group: "navigation" },
  { id: "nav-recognition", label: "Reconocimiento", icon: Award, href: "/admin/recognition", group: "navigation" },
  { id: "nav-reports", label: "Reportes", icon: BarChart3, href: "/admin/reports", group: "navigation" },
  { id: "nav-analytics", label: "Analíticas", icon: TrendingUp, href: "/admin/analytics", group: "navigation" },
  { id: "nav-announcements", label: "Anuncios", icon: Megaphone, href: "/admin/announcements", group: "navigation" },
  { id: "nav-messages", label: "Mensajes", icon: MessageSquare, href: "/admin/messages", group: "navigation" },
  { id: "nav-settings", label: "Configuración", icon: Settings, href: "/admin/settings/general", group: "navigation" },
  { id: "nav-account", label: "Cuenta", icon: User, href: "/admin/account", group: "navigation" },
]

const actionItems: CommandItem[] = [
  { id: "action-new-employee", label: "Nuevo Empleado", sublabel: "Crear un nuevo empleado", icon: Plus, href: "/admin/employees/new", group: "actions" },
  { id: "action-new-pulse", label: "Crear Pulso", sublabel: "Lanzar una nueva encuesta", icon: Activity, href: "/admin/pulses", group: "actions" },
  { id: "action-new-announcement", label: "Nuevo Anuncio", sublabel: "Publicar un anuncio a todos", icon: Megaphone, href: "/admin/announcements", group: "actions" },
]

const groupLabels: Record<string, string> = {
  navigation: "Navegación",
  employees: "Empleados",
  actions: "Acciones rápidas",
}

export function CommandPalette() {
  const router = useRouter()
  const { commandPaletteOpen, setCommandPaletteOpen } = useAdminStore()
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Ctrl+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [setCommandPaletteOpen])

  const employeeItems: CommandItem[] = MOCK_EMPLOYEES.slice(0, 8).map((emp) => ({
    id: `emp-${emp.id}`,
    label: emp.name,
    sublabel: `${emp.role} · ${emp.department}`,
    icon: User,
    href: `/admin/employees/${emp.id}`,
    group: "employees" as const,
  }))

  const allItems = [...navItems, ...employeeItems, ...actionItems]

  const filtered = query.trim()
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.sublabel?.toLowerCase().includes(query.toLowerCase())
      )
    : allItems

  // Group results
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  const flatFiltered = Object.values(grouped).flat()

  const handleSelect = useCallback((item: CommandItem) => {
    setCommandPaletteOpen(false)
    setQuery("")
    if (item.action) {
      item.action()
    } else if (item.href) {
      router.push(item.href)
    }
  }, [router, setCommandPaletteOpen])

  // Keyboard nav
  useEffect(() => {
    if (!commandPaletteOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCommandPaletteOpen(false)
        setQuery("")
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, flatFiltered.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter") {
        const item = flatFiltered[selectedIndex]
        if (item) handleSelect(item)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [commandPaletteOpen, flatFiltered, selectedIndex, handleSelect, setCommandPaletteOpen])

  // Reset selection on query change
  useEffect(() => { setSelectedIndex(0) }, [query])

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
            onClick={() => { setCommandPaletteOpen(false); setQuery("") }}
          />

          {/* Palette */}
          <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              variants={modalContent}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                <Search className="h-5 w-5 flex-shrink-0 text-gray-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar páginas, empleados, acciones..."
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {flatFiltered.length === 0 ? (
                  <div className="py-10 text-center text-sm text-gray-400">
                    Sin resultados para &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  Object.entries(grouped).map(([group, items]) => (
                    <div key={group}>
                      <div className="px-4 py-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                          {groupLabels[group] ?? group}
                        </p>
                      </div>
                      {items.map((item) => {
                        const globalIndex = flatFiltered.indexOf(item)
                        const isSelected = globalIndex === selectedIndex
                        return (
                          <button
                            key={item.id}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            onClick={() => handleSelect(item)}
                            className={cn(
                              "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                              isSelected ? "bg-[#0c365c] text-white" : "text-gray-700 hover:bg-gray-50"
                            )}
                          >
                            <div className={cn(
                              "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
                              isSelected ? "bg-white/20" : "bg-gray-100"
                            )}>
                              <item.icon className={cn("h-4 w-4", isSelected ? "text-white" : "text-gray-500")} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={cn("truncate text-sm font-medium", isSelected ? "text-white" : "text-gray-800")}>
                                {item.label}
                              </p>
                              {item.sublabel && (
                                <p className={cn("truncate text-xs", isSelected ? "text-white/70" : "text-gray-400")}>
                                  {item.sublabel}
                                </p>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 border-t border-gray-100 bg-gray-50 px-4 py-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <kbd className="rounded border border-gray-200 bg-white px-1 py-0.5 text-[9px] font-medium">↑↓</kbd>
                  <span>Navegar</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <kbd className="rounded border border-gray-200 bg-white px-1 py-0.5 text-[9px] font-medium">↵</kbd>
                  <span>Seleccionar</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <kbd className="rounded border border-gray-200 bg-white px-1 py-0.5 text-[9px] font-medium">ESC</kbd>
                  <span>Cerrar</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
