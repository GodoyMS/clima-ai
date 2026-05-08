"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Loader2 } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { MOCK_EMPLOYEES } from "@/lib/mock-data"
import { MobileHeader } from "@/components/employee/mobile-header"
import { delay } from "@/lib/fake-api"
import { staggerContainer, slideUp } from "@/lib/motion"
import { cn } from "@/lib/utils"

const notificationTypes = [
  { id: "recognition", label: "Reconocimientos", description: "Cuando alguien te reconozca", defaultOn: true },
  { id: "pulse", label: "Pulsos", description: "Recordatorios de responder pulsos", defaultOn: true },
  { id: "announcement", label: "Anuncios", description: "Comunicados de la empresa", defaultOn: true },
  { id: "achievement", label: "Logros", description: "Cuando desbloquees insignias", defaultOn: true },
  { id: "streak", label: "Racha", description: "Alertas de tu racha diaria", defaultOn: false },
]

type Language = "es" | "en"

export default function ProfileSettingsPage() {
  const { user } = useAuthStore()
  const employee = MOCK_EMPLOYEES.find((e) => e.id === user?.id) ?? MOCK_EMPLOYEES[0]

  const [name, setName] = useState(employee.name)
  const [email, setEmail] = useState(employee.email)
  const [phone, setPhone] = useState(employee.phone)
  const [language, setLanguage] = useState<Language>("es")
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationTypes.map((n) => [n.id, n.defaultOn]))
  )
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  function toggleNotification(id: string) {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    await delay(1100)
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="flex flex-col min-h-full">
      <MobileHeader title="Configuración" showBack />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-5 px-4 py-4"
      >
        {/* Profile info */}
        <motion.div variants={slideUp}>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Información personal
          </h2>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 p-4 border-b border-gray-50">
              <img src={employee.avatar} alt={employee.name} className="h-14 w-14 rounded-2xl flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{employee.name}</p>
                <p className="text-xs text-gray-500">{employee.role}</p>
                <p className="text-xs text-gray-400">{employee.department}</p>
              </div>
            </div>
            <form onSubmit={handleSave} className="p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Nombre completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none focus:border-[#0c365c] focus:ring-2 focus:ring-[#0c365c]/15"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none focus:border-[#0c365c] focus:ring-2 focus:ring-[#0c365c]/15"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Teléfono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none focus:border-[#0c365c] focus:ring-2 focus:ring-[#0c365c]/15"
                />
              </div>
            </form>
          </div>
        </motion.div>

        {/* Language */}
        <motion.div variants={slideUp}>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Idioma
          </h2>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
            <div className="flex gap-3">
              {[
                { value: "es", label: "🇲🇽 Español", flag: "es" },
                { value: "en", label: "🇺🇸 English", flag: "en" },
              ].map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => setLanguage(lang.value as Language)}
                  className={cn(
                    "flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all border",
                    language === lang.value
                      ? "bg-[#0c365c]/10 border-[#0c365c] text-[#0c365c]"
                      : "bg-gray-50 border-gray-100 text-gray-600"
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notification preferences */}
        <motion.div variants={slideUp}>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Preferencias de notificación
          </h2>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm divide-y divide-gray-50">
            {notificationTypes.map((notif) => (
              <div key={notif.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{notif.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{notif.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotification(notif.id)}
                  className={cn(
                    "relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors",
                    notifications[notif.id] ? "bg-[#0c365c]" : "bg-gray-200"
                  )}
                >
                  <motion.div
                    animate={{ x: notifications[notif.id] ? 22 : 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="h-5 w-5 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save button */}
        <motion.div variants={slideUp}>
          <AnimatePresence mode="wait">
            {saveSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex h-13 items-center justify-center gap-2 rounded-xl bg-green-500 text-sm font-semibold text-white"
              >
                <CheckCircle2 size={16} />
                ¡Cambios guardados!
              </motion.div>
            ) : (
              <motion.button
                key="save"
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={isSaving}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#0c365c] text-sm font-semibold text-white shadow-lg shadow-[#0c365c]/30 disabled:opacity-80"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="h-4" />
      </motion.div>
    </div>
  )
}
