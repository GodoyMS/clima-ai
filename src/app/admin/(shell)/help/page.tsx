"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  HelpCircle, Mail, MessageCircle, BookOpen, Play, ChevronDown,
  ChevronUp, ExternalLink, Send, Search, Zap, FileText, Video
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { slideUp, staggerContainer, cardVariant } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const FAQ = [
  {
    q: "¿Cómo funciona el sistema de Insights de IA?",
    a: "El motor de IA de CLIMA AI analiza continuamente los patrones de respuesta de los pulsos, niveles de participación, comportamientos de reconocimiento y otras señales para generar insights accionables. Utiliza modelos de machine learning entrenados con millones de puntos de datos de engagement laboral para detectar tendencias antes de que se conviertan en problemas."
  },
  {
    q: "¿Qué tan segura es la información de mis empleados?",
    a: "CLIMA AI está diseñado con privacidad como prioridad. Toda la información está cifrada en tránsito y en reposo (AES-256). Los pulsos pueden configurarse como anónimos, y los resultados individuales solo se muestran a los administradores autorizados. Cumplimos con GDPR, la Ley N.º 29733 y su Reglamento (protección de datos personales, Perú) y SOC 2 Type II."
  },
  {
    q: "¿Cómo configuro un pulso recurrente?",
    a: "Al crear un nuevo pulso, en el paso 3 (Configuración) puedes seleccionar la opción 'Programar' e indicar una fecha y hora de envío. Para pulsos recurrentes (semanal, quincenal, mensual), ve a la sección de Pulsos > Plantillas y usa la funcionalidad de automatización disponible en planes Professional y Enterprise."
  },
  {
    q: "¿Pueden los empleados responder los pulsos desde su celular?",
    a: "Sí. CLIMA AI es completamente responsivo y se puede usar desde cualquier dispositivo. Además, si tienes la integración con WhatsApp o Slack activa, los empleados reciben un enlace directo para responder sin necesidad de abrir la plataforma."
  },
  {
    q: "¿Cuántos administradores puedo tener en mi cuenta?",
    a: "En el plan Professional puedes tener hasta 10 usuarios con rol de Administrador o Manager. En el plan Enterprise no hay límite. Puedes gestionar los accesos en Configuración > Seguridad > Usuarios y permisos."
  },
  {
    q: "¿Cómo exporto los datos para análisis externos?",
    a: "Ve a cualquier sección de Reportes y usa el botón 'Exportar'. Los formatos disponibles son CSV, Excel y PDF. Para integraciones con herramientas de BI como Power BI o Tableau, contacta al equipo de soporte para configurar una conexión API directa."
  },
  {
    q: "¿El sistema detecta automáticamente los riesgos de retención?",
    a: "Sí. El módulo de Riesgo de Retención actualiza los scores de forma continua basándose en múltiples señales: participación en pulsos, sentimiento de respuestas, patrones de reconocimiento, actividad fuera de horario y comparativas históricas. Se generan alertas automáticas cuando un empleado supera ciertos umbrales de riesgo."
  },
  {
    q: "¿Puedo personalizar los tipos de insignias para reconocimientos?",
    a: "Sí. En Reconocimientos > Configuración puedes crear tus propias insignias con nombre personalizado, descripción, color e ícono. También puedes archivar insignias existentes. Esta funcionalidad está disponible en todos los planes."
  },
]

const DOCS = [
  { title: "Guía de inicio rápido", desc: "Configura tu cuenta en menos de 10 minutos", icon: <Zap className="h-5 w-5" />, color: "#f59e0b", href: "#" },
  { title: "Manual de administrador", desc: "Referencia completa de todas las funcionalidades", icon: <FileText className="h-5 w-5" />, color: "#0c365c", href: "#" },
  { title: "API Reference", desc: "Documentación técnica para integraciones", icon: <BookOpen className="h-5 w-5" />, color: "#8b5cf6", href: "#" },
  { title: "Mejores prácticas de eNPS", desc: "Cómo obtener el mayor valor de tus mediciones", icon: <BookOpen className="h-5 w-5" />, color: "#10b981", href: "#" },
]

const TUTORIALS = [
  { title: "Cómo crear tu primer pulso", duration: "3:45", thumb: "📊" },
  { title: "Entendiendo los Insights de IA", duration: "5:20", thumb: "🤖" },
  { title: "Configurar el módulo de reconocimiento", duration: "4:10", thumb: "🏆" },
  { title: "Usar el reporte de eNPS efectivamente", duration: "6:30", thumb: "📈" },
]

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [searchFaq, setSearchFaq] = useState("")
  const [supportName, setSupportName] = useState("")
  const [supportEmail, setSupportEmail] = useState("")
  const [supportMessage, setSupportMessage] = useState("")
  const [supportCategory, setSupportCategory] = useState("general")

  const filteredFaq = FAQ.filter((f) =>
    searchFaq === "" ||
    f.q.toLowerCase().includes(searchFaq.toLowerCase()) ||
    f.a.toLowerCase().includes(searchFaq.toLowerCase())
  )

  function handleSubmitSupport() {
    if (!supportName || !supportEmail || !supportMessage) {
      toast.error("Por favor completa todos los campos.")
      return
    }
    toast.success("Tu solicitud fue enviada. Te responderemos en menos de 24 horas hábiles.")
    setSupportName(""); setSupportEmail(""); setSupportMessage("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0c365c] text-white">
            <HelpCircle className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Centro de Ayuda</h1>
          <p className="mt-2 text-sm text-gray-500">¿En qué podemos ayudarte hoy?</p>
        </motion.div>

        {/* Quick links */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-8 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Contactar soporte", desc: "Respuesta en < 24h", icon: <Mail className="h-5 w-5" />, color: "#0c365c", action: () => document.getElementById("support-form")?.scrollIntoView({ behavior: "smooth" }) },
            { label: "Chat en vivo", desc: "Disponible Lun-Vie 9-18h", icon: <MessageCircle className="h-5 w-5" />, color: "#10b981", action: () => toast.info("Iniciando chat con soporte...") },
            { label: "Documentación", desc: "Guías y referencias técnicas", icon: <BookOpen className="h-5 w-5" />, color: "#8b5cf6", action: () => toast.info("Abriendo documentación...") },
          ].map((item) => (
            <motion.button
              key={item.label}
              variants={cardVariant}
              onClick={item.action}
              className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-left transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: item.color }}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* FAQ */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#0c365c]" />
            Preguntas frecuentes
          </h2>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input className="pl-10 rounded-xl border-gray-200 bg-white" placeholder="Buscar en las preguntas..." value={searchFaq} onChange={(e) => setSearchFaq(e.target.value)} />
          </div>
          <div className="space-y-2">
            {filteredFaq.map((faq, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-white overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-gray-900 pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="h-4 w-4 shrink-0 text-[#0c365c]" />
                    : <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                  }
                </button>
                {openFaq === i && (
                  <div className="border-t border-gray-100 px-5 pb-4 pt-3">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
            {filteredFaq.length === 0 && (
              <div className="rounded-xl border border-gray-100 bg-white px-5 py-10 text-center">
                <p className="text-sm text-gray-500">No se encontraron resultados para "{searchFaq}".</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Documentation links */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#0c365c]" />
            Documentación
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {DOCS.map((doc) => (
              <a key={doc.title} href={doc.href} onClick={(e) => { e.preventDefault(); toast.info(`Abriendo: ${doc.title}`) }} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:shadow-md group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: doc.color }}>
                  {doc.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{doc.title}</p>
                  <p className="text-xs text-gray-500">{doc.desc}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-[#0c365c] shrink-0" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Video tutorials */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Video className="h-5 w-5 text-[#0c365c]" />
            Video tutoriales
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {TUTORIALS.map((tut) => (
              <button
                key={tut.title}
                onClick={() => toast.info(`Reproduciendo: ${tut.title}`)}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-left transition-all hover:shadow-md group"
              >
                <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-[#0c365c]/10 text-2xl">
                  {tut.thumb}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{tut.title}</p>
                  <p className="text-xs text-gray-500">{tut.duration}</p>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c365c] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-3.5 w-3.5 ml-0.5" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Support form */}
        <motion.div id="support-form" variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#0c365c]" />
            Contactar soporte
          </h2>
          <p className="mb-5 text-sm text-gray-500">
            Nuestro equipo te responderá en menos de 24 horas hábiles.
          </p>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                <Input className="mt-1.5 rounded-xl border-gray-200" placeholder="Tu nombre completo" value={supportName} onChange={(e) => setSupportName(e.target.value)} />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Correo electrónico</Label>
                <Input type="email" className="mt-1.5 rounded-xl border-gray-200" placeholder="tu@empresa.com" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Categoría</Label>
              <select className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" value={supportCategory} onChange={(e) => setSupportCategory(e.target.value)}>
                <option value="general">Consulta general</option>
                <option value="technical">Problema técnico</option>
                <option value="billing">Facturación</option>
                <option value="integration">Integración</option>
                <option value="feature">Solicitud de funcionalidad</option>
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Mensaje</Label>
              <Textarea className="mt-1.5 rounded-xl border-gray-200 resize-none" rows={4} placeholder="Describe tu problema o consulta con el mayor detalle posible..." value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} />
            </div>
            <Button className="gap-2 bg-[#0c365c] hover:bg-[#0a2d4e] text-white rounded-xl" onClick={handleSubmitSupport}>
              <Send className="h-4 w-4" />
              Enviar solicitud
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
