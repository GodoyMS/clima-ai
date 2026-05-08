"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Building2, Shield, CreditCard, Plug, Bell, Globe, Clock,
  Upload, Save, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { slideUp, staggerContainer, cardVariant } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ClimaLogo } from "@/components/shared/clima-logo"

const SIDEBAR_ITEMS = [
  { href: "/admin/settings/general", label: "General", icon: <Building2 className="h-4 w-4" />, active: true },
  { href: "/admin/settings/security", label: "Seguridad", icon: <Shield className="h-4 w-4" />, active: false },
  { href: "/admin/settings/billing", label: "Facturación", icon: <CreditCard className="h-4 w-4" />, active: false },
  { href: "/admin/settings/integrations", label: "Integraciones", icon: <Plug className="h-4 w-4" />, active: false },
]

const INDUSTRIES = [
  "Tecnología", "Manufactura", "Retail", "Servicios Financieros",
  "Salud", "Educación", "Consultoría", "Medios y Comunicación", "Otro"
]

const COMPANY_SIZES = [
  "1-10", "11-50", "51-200", "201-500", "501-1,000", "1,001-5,000", "+5,000"
]

const TIMEZONES = [
  "America/Mexico_City", "America/Monterrey", "America/Bogota",
  "America/Lima", "America/Santiago", "America/Buenos_Aires", "America/New_York"
]

export default function GeneralSettingsPage() {
  const [companyName, setCompanyName] = useState("CLIMA AI")
  const [industry, setIndustry] = useState("Tecnología")
  const [size, setSize] = useState("11-50")
  const [timezone, setTimezone] = useState("America/Mexico_City")
  const [language, setLanguage] = useState("es")
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifSlack, setNotifSlack] = useState(true)
  const [notifSms, setNotifSms] = useState(false)
  const [notifWeekly, setNotifWeekly] = useState(true)
  const [notifAlerts, setNotifAlerts] = useState(true)

  function handleSave() {
    toast.success("Configuración guardada exitosamente.")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona las preferencias de tu organización.</p>
        </motion.div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-48 shrink-0"
          >
            <nav className="space-y-1">
              {SIDEBAR_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    item.active
                      ? "bg-[#0c365c] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Main content */}
          <div className="flex-1 space-y-5">
            {/* Company info */}
            <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#0c365c]" />
                Información de la empresa
              </h2>

              {/* Logo upload */}
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-zinc-950 p-1.5">
                  <ClimaLogo size="sm" className="max-h-12 object-contain" />
                </div>
                <div>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                    <Upload className="h-3.5 w-3.5" />
                    Subir logo
                  </Button>
                  <p className="mt-1 text-xs text-gray-400">PNG o JPG. Máx 2MB. Recomendado 200x200px.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nombre de la empresa</Label>
                  <Input className="mt-1.5 rounded-xl border-gray-200" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Industria</Label>
                  <select className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Tamaño de empresa</Label>
                  <select className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" value={size} onChange={(e) => setSize(e.target.value)}>
                    {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s} empleados</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Zona horaria</Label>
                  <select className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                    {TIMEZONES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Idioma de la plataforma</Label>
                  <select className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Notification preferences */}
            <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#0c365c]" />
                Preferencias de notificación
              </h2>
              <div className="space-y-3">
                {[
                  { id: "email", label: "Notificaciones por correo", desc: "Recibe alertas e informes por email", value: notifEmail, setter: setNotifEmail },
                  { id: "slack", label: "Integración con Slack", desc: "Envía notificaciones al canal configurado", value: notifSlack, setter: setNotifSlack },
                  { id: "sms", label: "Notificaciones por SMS", desc: "Alertas críticas por mensaje de texto", value: notifSms, setter: setNotifSms },
                  { id: "weekly", label: "Resumen semanal", desc: "Reporte automático cada lunes a las 9am", value: notifWeekly, setter: setNotifWeekly },
                  { id: "alerts", label: "Alertas de IA", desc: "Notificaciones inmediatas de insights críticos", value: notifAlerts, setter: setNotifAlerts },
                ].map((n) => (
                  <label key={n.id} className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{n.label}</p>
                      <p className="text-xs text-gray-500">{n.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => n.setter(!n.value)}
                      className={cn("relative h-5 w-9 rounded-full transition-colors", n.value ? "bg-[#0c365c]" : "bg-gray-200")}
                    >
                      <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform", n.value ? "translate-x-4" : "translate-x-0.5")} />
                    </button>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Save */}
            <div className="flex justify-end">
              <Button
                className="gap-2 bg-[#0c365c] hover:bg-[#0a2d4e] text-white rounded-xl px-6"
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
                Guardar cambios
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
