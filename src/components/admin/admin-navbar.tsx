"use client"

import { usePathname, useRouter } from "next/navigation"
import { Bell, Search, Menu, ChevronRight, LogOut, User, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAdminStore } from "@/store/admin-store"
import { useAuthStore } from "@/store/auth-store"
import { logout } from "@/lib/fake-api"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const routeLabels: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/employees": "Empleados",
  "/admin/teams": "Equipos",
  "/admin/pulses": "Pulsos",
  "/admin/insights": "Insights IA",
  "/admin/retention-risk": "Riesgo de Retención",
  "/admin/recognition": "Reconocimiento",
  "/admin/reports": "Reportes",
  "/admin/analytics": "Analíticas",
  "/admin/announcements": "Anuncios",
  "/admin/messages": "Mensajes",
  "/admin/settings/general": "Configuración",
  "/admin/account": "Cuenta",
  "/admin/help": "Ayuda",
  "/admin/employees/new": "Nuevo Empleado",
}

function getBreadcrumb(pathname: string): { label: string; href?: string }[] {
  if (pathname.startsWith("/admin/employees/") && pathname !== "/admin/employees/new") {
    return [
      { label: "Empleados", href: "/admin/employees" },
      { label: "Detalle" },
    ]
  }
  if (pathname.startsWith("/admin/teams/") && !pathname.endsWith("/teams")) {
    return [
      { label: "Equipos", href: "/admin/teams" },
      { label: "Detalle" },
    ]
  }
  const label = routeLabels[pathname]
  if (!label) return [{ label: "Admin" }]
  return [{ label }]
}

export function AdminNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toggleSidebar, setMobileSidebarOpen, unreadCount, setCommandPaletteOpen } = useAdminStore()
  const { user, logout: storeLogout } = useAuthStore()
  const breadcrumb = getBreadcrumb(pathname)

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      storeLogout()
      router.push("/admin/login")
      toast.success("Sesión cerrada correctamente")
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 flex-shrink-0 items-center gap-2 border-b border-gray-100 bg-white px-3 shadow-sm sm:h-16 sm:gap-4 sm:px-4">
      {/* Mobile: open navigation sheet */}
      <button
        type="button"
        onClick={() => setMobileSidebarOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 md:hidden"
        aria-label="Abrir menú de navegación"
      >
        <Menu className="h-5 w-5" />
      </button>
      {/* Desktop: collapse sidebar rail */}
      <button
        type="button"
        onClick={toggleSidebar}
        className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 md:flex"
        aria-label="Contraer o expandir menú lateral"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb */}
      <nav aria-label="Ruta" className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden text-sm sm:gap-1.5">
        <span className="hidden shrink-0 text-xs font-medium text-gray-400 sm:inline">Admin</span>
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex min-w-0 items-center gap-1 sm:gap-1.5">
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 shrink-0 text-gray-300",
                i === 0 ? "hidden sm:block" : "block"
              )}
            />
            {crumb.href ? (
              <a
                href={crumb.href}
                className="truncate font-medium text-gray-500 transition-colors hover:text-[#0c365c]"
              >
                {crumb.label}
              </a>
            ) : (
              <span className="truncate font-semibold text-gray-800">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {/* Search */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-400 transition-colors hover:border-gray-300 hover:bg-white hover:text-gray-600 sm:w-auto sm:gap-2 sm:px-3"
          aria-label="Buscar"
        >
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Buscar...</span>
          <kbd className="hidden rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 lg:inline">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notificaciones</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                  {unreadCount} nuevas
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <NotificationList />
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl ring-2 ring-gray-100 transition-all hover:ring-[#0c365c]/30">
              <img
                src={user?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                alt={user?.name ?? "Usuario"}
                className="h-full w-full object-cover"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-semibold text-gray-800">{user?.name ?? "Admin"}</p>
                <p className="text-xs font-normal text-gray-400">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin/account")} className="gap-2">
              <User className="h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/settings/general")} className="gap-2">
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="gap-2 text-red-500 focus:text-red-500">
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function NotificationList() {
  const { notifications, markNotificationRead } = useAdminStore()
  const recent = notifications.slice(0, 5)

  if (recent.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-gray-400">
        No hay notificaciones
      </div>
    )
  }

  return (
    <div className="max-h-72 overflow-y-auto">
      {recent.map((n) => (
        <button
          key={n.id}
          onClick={() => markNotificationRead(n.id)}
          className={cn(
            "flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-gray-50",
            !n.isRead && "bg-blue-50/50"
          )}
        >
          <span className="text-xl leading-none mt-0.5">{n.icon}</span>
          <div className="min-w-0 flex-1">
            <p className={cn("truncate text-xs font-semibold", !n.isRead ? "text-gray-900" : "text-gray-600")}>
              {n.title}
            </p>
            <p className="mt-0.5 text-xs text-gray-400 line-clamp-2">{n.message}</p>
          </div>
          {!n.isRead && (
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
          )}
        </button>
      ))}
    </div>
  )
}
