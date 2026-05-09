"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Building2, Shield, CreditCard, Plug, Check, X,
  Copy, RefreshCw, Eye, EyeOff, Globe, Zap, Plus, Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { slideUp, staggerContainer, cardVariant } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const SIDEBAR_ITEMS = [
  { href: "/admin/settings/general", label: "General", icon: <Building2 className="h-4 w-4" />, active: false },
  { href: "/admin/settings/security", label: "Seguridad", icon: <Shield className="h-4 w-4" />, active: false },
  { href: "/admin/settings/billing", label: "Facturación", icon: <CreditCard className="h-4 w-4" />, active: false },
  { href: "/admin/settings/integrations", label: "Integraciones", icon: <Plug className="h-4 w-4" />, active: true },
]

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  color: string
  connected: boolean
  category: string
}

const INTEGRATIONS: Integration[] = [
  { id: "slack", name: "Slack", description: "Envía notificaciones y pulsos directamente al workspace de Slack.", icon: "💬", color: "#4A154B", connected: true, category: "Comunicación" },
  { id: "whatsapp", name: "WhatsApp Business", description: "Llega a tus empleados por WhatsApp para mayor participación.", icon: "📱", color: "#25D366", connected: false, category: "Comunicación" },
  { id: "teams", name: "Microsoft Teams", description: "Integra CLIMA AI con tu entorno de trabajo en Teams.", icon: "🟣", color: "#464EB8", connected: false, category: "Comunicación" },
  { id: "google", name: "Google Workspace", description: "Sincroniza empleados y calendario con Google Workspace.", icon: "🌐", color: "#4285F4", connected: true, category: "Productividad" },
  { id: "workday", name: "Workday HRIS", description: "Sincroniza automáticamente la información de empleados con Workday.", icon: "👤", color: "#F6993F", connected: false, category: "HRIS" },
  { id: "bamboohr", name: "BambooHR", description: "Conecta tu base de empleados de BambooHR con CLIMA AI.", icon: "🎋", color: "#73C41D", connected: false, category: "HRIS" },
  { id: "salesforce", name: "Salesforce", description: "Correlaciona el engagement del equipo de ventas con métricas de CRM.", icon: "☁️", color: "#00A1E0", connected: false, category: "CRM" },
  { id: "hubspot", name: "HubSpot", description: "Conecta datos de RRHH con tus procesos de HubSpot.", icon: "🟠", color: "#FF7A59", connected: false, category: "CRM" },
]

const WEBHOOK_EVENTS = [
  "pulse.completed", "insight.created", "recognition.sent",
  "employee.risk_level_changed", "announcement.published"
]

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS)
  const [showApiKey, setShowApiKey] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["pulse.completed", "insight.created"])
  const [apiKey] = useState("ca_live_xK9mP2rQ8vT4nW6yU1sB3jF5hL0dE7aI")

  function toggleIntegration(id: string) {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, connected: !i.connected }
          : i
      )
    )
    const int = integrations.find((i) => i.id === id)
    if (int) toast.success(int.connected ? `${int.name} desconectado.` : `${int.name} conectado exitosamente.`)
  }

  function copyApiKey() {
    navigator.clipboard.writeText(apiKey)
    toast.success("API Key copiada al portapapeles.")
  }

  function toggleEvent(event: string) {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    )
  }

  const categories = Array.from(new Set(INTEGRATIONS.map((i) => i.category)))

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
            {/* Integration cards by category */}
            {categories.map((category) => (
              <motion.div key={category} variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">{category}</h2>
                <div className="space-y-3">
                  {integrations.filter((i) => i.category === category).map((int) => (
                    <div key={int.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                          style={{ backgroundColor: int.color + "20" }}
                        >
                          {int.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">{int.name}</p>
                            {int.connected && (
                              <span className="flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                <Check className="h-3 w-3" />
                                Conectado
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 max-w-sm">{int.description}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={int.connected ? "outline" : "default"}
                        className={cn("shrink-0 rounded-xl text-xs", int.connected ? "border-red-200 text-red-600 hover:bg-red-50" : "bg-[#0c365c] text-white hover:bg-[#0a2d4e]")}
                        onClick={() => toggleIntegration(int.id)}
                      >
                        {int.connected ? "Desconectar" : "Conectar"}
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* API Keys */}
            <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#0c365c]" />
                API Keys
              </h2>
              <div>
                <Label className="text-sm font-medium text-gray-700">API Key de producción</Label>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      className="pr-10 rounded-xl border-gray-200 font-mono text-sm bg-gray-50"
                      value={apiKey}
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5 rounded-xl shrink-0" onClick={copyApiKey}>
                    <Copy className="h-3.5 w-3.5" />
                    Copiar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5 rounded-xl shrink-0 text-amber-600 border-amber-200 hover:bg-amber-50" onClick={() => toast.success("API Key regenerada. Actualiza tus integraciones.")}>
                    <RefreshCw className="h-3.5 w-3.5" />
                    Regenerar
                  </Button>
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  Mantén tu API Key segura. No la compartas en repositorios públicos.
                </p>
              </div>
            </motion.div>

            {/* Webhooks */}
            <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-gray-900 flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#0c365c]" />
                Webhooks
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">URL del webhook</Label>
                  <Input
                    className="mt-1.5 rounded-xl border-gray-200"
                    placeholder="https://tu-servidor.com/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium text-gray-700">Eventos a escuchar</Label>
                  <div className="flex flex-wrap gap-2">
                    {WEBHOOK_EVENTS.map((event) => (
                      <button
                        key={event}
                        onClick={() => toggleEvent(event)}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs font-mono font-medium transition-all",
                          selectedEvents.includes(event)
                            ? "border-[#0c365c] bg-[#0c365c] text-white"
                            : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                        )}
                      >
                        {event}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  className="gap-2 bg-[#0c365c] text-white rounded-xl"
                  onClick={() => {
                    if (!webhookUrl) { toast.error("Ingresa la URL del webhook."); return }
                    toast.success("Webhook guardado y verificado.")
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Guardar webhook
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
