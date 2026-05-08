"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  User, Upload, Bell, Palette, Save, Moon, Sun,
  Phone, Mail, Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { slideUp } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const NOTIFICATION_PREFS = [
  { id: "new_insight", label: "Nuevos insights de IA", desc: "Cuando se detecta un patrón nuevo" },
  { id: "pulse_results", label: "Resultados de pulso", desc: "Al completarse un pulso activo" },
  { id: "recognition", label: "Reconocimientos enviados", desc: "Cuando alguien de tu equipo recibe o envía uno" },
  { id: "high_risk", label: "Empleados en riesgo crítico", desc: "Alertas inmediatas de riesgo de retención alto" },
  { id: "weekly_digest", label: "Resumen semanal", desc: "Informe ejecutivo cada lunes a las 9am" },
  { id: "announcements", label: "Nuevos anuncios", desc: "Cuando se publica un anuncio para toda la empresa" },
]

export default function AccountPage() {
  const [name, setName] = useState("Patricia Flores Ríos")
  const [email, setEmail] = useState("patricia.flores@climaai.mx")
  const [phone, setPhone] = useState("+52 55 1234-5608")
  const [role, setRole] = useState("Directora de RRHH")
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_PREFS.map((n) => [n.id, true]))
  )

  function toggleNotif(id: string) {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function handleSave() {
    toast.success("Perfil actualizado exitosamente.")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Mi cuenta</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona tu información personal y preferencias.</p>
        </motion.div>

        <div className="space-y-5">
          {/* Profile picture + personal info */}
          <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-base font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-4 w-4 text-[#0c365c]" />
              Información personal
            </h2>

            {/* Avatar upload */}
            <div className="mb-6 flex items-center gap-5">
              <div className="relative">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia"
                  alt="Avatar"
                  className="h-20 w-20 rounded-2xl bg-gray-100 border-4 border-white shadow-md"
                />
                <button
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#0c365c] text-white shadow-sm"
                  onClick={() => toast.info("Selecciona una imagen desde tu dispositivo.")}
                >
                  <Upload className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{name}</p>
                <p className="text-sm text-gray-500">{role}</p>
                <p className="mt-1 text-xs text-gray-400">PNG, JPG. Máx 2MB.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-gray-700">Nombre completo</Label>
                <Input className="mt-1.5 rounded-xl border-gray-200" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Rol en la empresa</Label>
                <Input className="mt-1.5 rounded-xl border-gray-200" value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  Correo electrónico
                </Label>
                <Input type="email" className="mt-1.5 rounded-xl border-gray-200" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  Teléfono
                </Label>
                <Input type="tel" className="mt-1.5 rounded-xl border-gray-200" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Rol de acceso</span>
                </div>
                <span className="rounded-full bg-[#0c365c]/10 px-3 py-1 text-xs font-semibold text-[#0c365c]">
                  Administrador
                </span>
              </div>
            </div>
          </motion.div>

          {/* Notification preferences */}
          <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-base font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#0c365c]" />
              Preferencias de notificación
            </h2>
            <div className="space-y-2">
              {NOTIFICATION_PREFS.map((notif) => (
                <label key={notif.id} className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{notif.label}</p>
                    <p className="text-xs text-gray-500">{notif.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotif(notif.id)}
                    className={cn("relative h-5 w-9 rounded-full transition-colors", notifications[notif.id] ? "bg-[#0c365c]" : "bg-gray-200")}
                  >
                    <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform", notifications[notif.id] ? "translate-x-4" : "translate-x-0.5")} />
                  </button>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-base font-semibold text-gray-900 flex items-center gap-2">
              <Palette className="h-4 w-4 text-[#0c365c]" />
              Apariencia
            </h2>
            <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="h-5 w-5 text-[#0c365c]" /> : <Sun className="h-5 w-5 text-amber-500" />}
                <div>
                  <p className="text-sm font-medium text-gray-800">Modo oscuro</p>
                  <p className="text-xs text-gray-500">{darkMode ? "Tema oscuro activo" : "Tema claro activo"}</p>
                </div>
              </div>
              <button
                onClick={() => { setDarkMode(!darkMode); toast.info("Tema actualizado.") }}
                className={cn("relative h-5 w-9 rounded-full transition-colors", darkMode ? "bg-[#0c365c]" : "bg-gray-200")}
              >
                <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform", darkMode ? "translate-x-4" : "translate-x-0.5")} />
              </button>
            </div>
          </motion.div>

          {/* Save */}
          <div className="flex justify-end pb-4">
            <Button className="gap-2 bg-[#0c365c] hover:bg-[#0a2d4e] text-white rounded-xl px-6" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Guardar cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
