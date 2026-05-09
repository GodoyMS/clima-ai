"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
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
  HelpCircle,
  ChevronLeft,
  LogOut,
} from "lucide-react"
import { ClimaLogo } from "@/components/shared/clima-logo"
import { cn } from "@/lib/utils"
import { useAdminStore } from "@/store/admin-store"
import { useAuthStore } from "@/store/auth-store"
import { sidebarVariant, sidebarLabel } from "@/lib/motion"
import { logout } from "@/lib/fake-api"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"

interface NavItem {
  label: string
  icon: React.ElementType
  href: string
  badge?: number
}

interface NavSection {
  items: NavItem[]
  divider?: boolean
}

const navSections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
      { label: "Empleados", icon: Users, href: "/admin/employees" },
      { label: "Equipos", icon: UsersRound, href: "/admin/teams" },
      { label: "Pulsos", icon: Activity, href: "/admin/pulses" },
      { label: "Insights IA", icon: Sparkles, href: "/admin/insights", badge: 3 },
      { label: "Riesgo de Retención", icon: AlertTriangle, href: "/admin/retention-risk" },
      { label: "Reconocimiento", icon: Award, href: "/admin/recognition" },
      { label: "Reportes", icon: BarChart3, href: "/admin/reports" },
      { label: "Analíticas", icon: TrendingUp, href: "/admin/analytics" },
      { label: "Anuncios", icon: Megaphone, href: "/admin/announcements" },
      { label: "Mensajes", icon: MessageSquare, href: "/admin/messages", badge: 2 },
    ],
  },
  {
    divider: true,
    items: [
      { label: "Configuración", icon: Settings, href: "/admin/settings/general" },
      { label: "Cuenta", icon: User, href: "/admin/account" },
      { label: "Ayuda", icon: HelpCircle, href: "/admin/help" },
    ],
  },
]

function useIsActive() {
  const pathname = usePathname()
  return (href: string) => {
    if (href === "/admin/dashboard") return pathname === href
    return pathname.startsWith(href)
  }
}

function SidebarNavBody({
  sidebarOpen,
  onNavigate,
}: {
  sidebarOpen: boolean
  onNavigate?: () => void
}) {
  const isActive = useIsActive()

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-4">
      {navSections.map((section, si) => (
        <div key={si}>
          {section.divider && <div className="my-3 border-t border-gray-100" />}
          {section.items.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onNavigate?.()}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-[#0c365c] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    active ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                  )}
                />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      variants={sidebarLabel}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="flex-1 truncate whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge && item.badge > 0 && (
                  <AnimatePresence>
                    {sidebarOpen ? (
                      <motion.span
                        variants={sidebarLabel}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className={cn(
                          "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                          active ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                        )}
                      >
                        {item.badge}
                      </motion.span>
                    ) : (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-500"
                      />
                    )}
                  </AnimatePresence>
                )}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

function SidebarUserSection({
  sidebarOpen,
  onNavigate,
}: {
  sidebarOpen: boolean
  onNavigate?: () => void
}) {
  const router = useRouter()
  const { user, logout: storeLogout } = useAuthStore()

  const handleLogout = async () => {
    onNavigate?.()
    try {
      await logout()
      storeLogout()
      router.push("/admin/login")
      toast.success("Sesión cerrada correctamente")
    } catch {
      storeLogout()
      router.push("/admin/login")
    }
  }

  return (
    <div className="flex-shrink-0 border-t border-gray-100 p-3">
      <div className={cn("flex items-center gap-3 rounded-xl p-2", sidebarOpen ? "" : "justify-center")}>
        <img
          src={user?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
          alt={user?.name ?? "Usuario"}
          className="h-8 w-8 flex-shrink-0 rounded-full object-cover ring-2 ring-gray-100"
        />
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              variants={sidebarLabel}
              initial="closed"
              animate="open"
              exit="closed"
              className="min-w-0 flex-1 overflow-hidden"
            >
              <p className="truncate text-sm font-semibold text-gray-800">{user?.name ?? "Admin"}</p>
              <p className="truncate text-xs text-gray-400">{user?.email ?? ""}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.button
              variants={sidebarLabel}
              initial="closed"
              animate="open"
              exit="closed"
              type="button"
              onClick={handleLogout}
              className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SidebarChrome({
  sidebarOpen,
  onNavigate,
  collapseToggle,
}: {
  sidebarOpen: boolean
  onNavigate?: () => void
  collapseToggle?: React.ReactNode
}) {
  return (
    <>
      <Link
        href="/admin/dashboard"
        onClick={() => onNavigate?.()}
        className={cn(
          "flex h-16 flex-shrink-0 items-center border-b border-gray-100 px-3 transition-colors hover:bg-gray-50/80",
          sidebarOpen ? "justify-start gap-2" : "justify-center px-2"
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-xl  p-1.5 ",
            sidebarOpen ? "min-h-10 px-2" : "h-10 w-10 px-1"
          )}
        >
          <ClimaLogo size={sidebarOpen ? "sm" : "2xs"} priority className="object-contain" />
        </div>
      </Link>

      <SidebarNavBody sidebarOpen={sidebarOpen} onNavigate={onNavigate} />
      <SidebarUserSection sidebarOpen={sidebarOpen} onNavigate={onNavigate} />
      {collapseToggle}
    </>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useAdminStore()

  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [pathname, setMobileSidebarOpen])

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)")
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileSidebarOpen(false)
    }
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [setMobileSidebarOpen])

  return (
    <>
      {/* Desktop / tablet: collapsible rail */}
      <motion.aside
        initial={false}
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariant}
        className="relative hidden h-full flex-shrink-0 flex-col overflow-hidden border-r border-gray-100 bg-white shadow-sm md:flex"
      >
        <SidebarChrome
          sidebarOpen={sidebarOpen}
          collapseToggle={
            <button
              type="button"
              onClick={toggleSidebar}
              className="absolute top-20 -right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-colors hover:text-gray-600"
              aria-label={sidebarOpen ? "Contraer menú lateral" : "Expandir menú lateral"}
            >
              <motion.div
                animate={{ rotate: sidebarOpen ? 0 : 180 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </motion.div>
            </button>
          }
        />
      </motion.aside>

      {/* Mobile: sheet drawer (shadcn Sidebar mobile pattern) */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="flex h-[100dvh] w-[min(18rem,calc(100vw-2rem))] max-w-[18rem] flex-col gap-0 overflow-hidden border-gray-100 bg-white p-0 sm:max-w-[18rem]"
        >
          <SheetTitle className="sr-only">Navegación principal</SheetTitle>
          <div className="flex min-h-0 flex-1 flex-col">
            <SidebarChrome
              sidebarOpen
              onNavigate={() => setMobileSidebarOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
