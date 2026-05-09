"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Building2, Shield, CreditCard, Plug, Eye, EyeOff,
  Smartphone, AlertTriangle, Clock, MapPin, Monitor
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { slideUp } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const SIDEBAR_ITEMS = [
  { href: "/admin/settings/general", label: "General", icon: <Building2 className="h-4 w-4" />, active: false },
  { href: "/admin/settings/security", label: "Seguridad", icon: <Shield className="h-4 w-4" />, active: true },
  { href: "/admin/settings/billing", label: "Facturación", icon: <CreditCard className="h-4 w-4" />, active: false },
  { href: "/admin/settings/integrations", label: "Integraciones", icon: <Plug className="h-4 w-4" />, active: false },
]

const ACTIVE_SESSIONS = [
  { id: 1, device: "MacBook Pro", browser: "Chrome 124", location: "Lima, PE", lastActive: "Ahora mismo", current: true },
  { id: 2, device: "iPhone 15", browser: "Safari Mobile", location: "Lima, PE", lastActive: "hace 2 horas", current: false },
  { id: 3, device: "iPad Pro", browser: "Safari", location: "Arequipa, PE", lastActive: "hace 1 día", current: false },
]

const LOGIN_HISTORY = [
  { date: "2026-05-07 14:30", device: "Chrome · Mac", location: "Lima, PE", status: "success" },
  { date: "2026-05-06 09:15", device: "Safari · iPhone", location: "Lima, PE", status: "success" },
  { date: "2026-05-05 18:45", device: "Chrome · Mac", location: "Lima, PE", status: "success" },
  { date: "2026-05-04 07:20", device: "Chrome · Mac", location: "Trujillo, PE", status: "success" },
  { date: "2026-05-03 13:00", device: "Chrome · Windows", location: "Desconocido", status: "failed" },
]

export default function SecuritySettingsPage() {
  const [currentPwd, setCurrentPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [twoFA, setTwoFA] = useState(false)

  function handlePasswordChange() {
    if (!currentPwd || !newPwd || !confirmPwd) { toast.error("Completa todos los campos."); return }
    if (newPwd !== confirmPwd) { toast.error("Las contraseñas no coinciden."); return }
    if (newPwd.length < 8) { toast.error("La contraseña debe tener al menos 8 caracteres."); return }
    toast.success("Contraseña actualizada exitosamente.")
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona las preferencias de tu organización.</p>
        </motion.div>

        <div className="flex flex-col gap-8 md:flex-row md:gap-6">
          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="w-full shrink-0 md:w-48">
            <nav className="space-y-1">
              {SIDEBAR_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all", item.active ? "bg-[#0c365c] text-white" : "text-gray-600 hover:bg-gray-100")}>
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          <div className="flex-1 space-y-5">
            {/* Password change */}
            <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#0c365c]" />
                Cambiar contraseña
              </h2>
              <div className="space-y-4 max-w-md">
                {[
                  { label: "Contraseña actual", value: currentPwd, setter: setCurrentPwd, show: showCurrent, toggleShow: () => setShowCurrent(!showCurrent) },
                  { label: "Nueva contraseña", value: newPwd, setter: setNewPwd, show: showNew, toggleShow: () => setShowNew(!showNew) },
                  { label: "Confirmar nueva contraseña", value: confirmPwd, setter: setConfirmPwd, show: showConfirm, toggleShow: () => setShowConfirm(!showConfirm) },
                ].map((field) => (
                  <div key={field.label}>
                    <Label className="text-sm font-medium text-gray-700">{field.label}</Label>
                    <div className="relative mt-1.5">
                      <Input
                        type={field.show ? "text" : "password"}
                        className="pr-10 rounded-xl border-gray-200"
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={field.toggleShow}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                {newPwd && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Seguridad de la contraseña</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={cn("h-1.5 flex-1 rounded-full", newPwd.length >= i * 3 ? (i <= 2 ? "bg-red-400" : i === 3 ? "bg-amber-400" : "bg-emerald-500") : "bg-gray-200")} />
                      ))}
                    </div>
                  </div>
                )}
                <Button className="gap-2 bg-[#0c365c] text-white rounded-xl" onClick={handlePasswordChange}>
                  Actualizar contraseña
                </Button>
              </div>
            </motion.div>

            {/* 2FA */}
            <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c365c]/10 text-[#0c365c]">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Autenticación de dos factores</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Agrega una capa adicional de seguridad a tu cuenta con un código de verificación.
                    </p>
                    <span className={cn("mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", twoFA ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600")}>
                      {twoFA ? "Activado" : "Desactivado"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { setTwoFA(!twoFA); toast.success(twoFA ? "2FA desactivado." : "2FA activado exitosamente.") }}
                  className={cn("relative h-6 w-11 rounded-full transition-colors", twoFA ? "bg-[#0c365c]" : "bg-gray-200")}
                >
                  <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform", twoFA ? "translate-x-5" : "translate-x-1")} />
                </button>
              </div>
            </motion.div>

            {/* Active sessions */}
            <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-gray-900 flex items-center gap-2">
                <Monitor className="h-4 w-4 text-[#0c365c]" />
                Sesiones activas
              </h2>
              <div className="space-y-3">
                {ACTIVE_SESSIONS.map((session) => (
                  <div key={session.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                        <Monitor className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{session.device}</p>
                        <p className="text-xs text-gray-500">{session.browser} · {session.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.current ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Actual</span>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-xs rounded-lg text-red-500 hover:bg-red-50" onClick={() => toast.success("Sesión cerrada.")}>
                          Cerrar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Login history */}
            <motion.div variants={slideUp} initial="hidden" animate="visible" className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#0c365c]" />
                  Historial de accesos
                </h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Fecha y hora</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Dispositivo</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Ubicación</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {LOGIN_HISTORY.map((entry, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 text-xs text-gray-600 font-mono">{entry.date}</td>
                      <td className="px-5 py-3 text-xs text-gray-600">{entry.device}</td>
                      <td className="px-5 py-3 text-xs text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {entry.location}
                      </td>
                      <td className="px-5 py-3">
                        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", entry.status === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                          {entry.status === "success" ? "Exitoso" : "Fallido"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
