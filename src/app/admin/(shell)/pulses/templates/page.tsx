"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ChevronLeft, Plus, Smile, BarChart3, Star, Flame, Users,
  MessageCircle, Award, Target, ArrowRight, Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { staggerContainer, cardVariant } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface Template {
  id: string
  name: string
  description: string
  category: string
  questionCount: number
  usageCount: number
  icon: React.ReactNode
  color: string
  bg: string
  questions: string[]
}

const TEMPLATES: Template[] = [
  {
    id: "t1",
    name: "Check-in de Bienestar",
    description: "Pulso rápido para evaluar el estado emocional y bienestar del equipo.",
    category: "Bienestar",
    questionCount: 3,
    usageCount: 48,
    icon: <Smile className="h-6 w-6" />,
    color: "#ec4899",
    bg: "bg-pink-50",
    questions: [
      "¿Cómo te sientes hoy?",
      "¿Qué tan manejable es tu carga de trabajo esta semana?",
      "¿Hay algo que te preocupe y quieras compartir?",
    ],
  },
  {
    id: "t2",
    name: "Encuesta de Compromiso",
    description: "Mide el nivel de engagement y satisfacción laboral del equipo.",
    category: "Compromiso",
    questionCount: 5,
    usageCount: 31,
    icon: <BarChart3 className="h-6 w-6" />,
    color: "#167fd0",
    bg: "bg-blue-50",
    questions: [
      "¿Qué tan comprometido te sientes con la empresa? (1-10)",
      "¿Te sientes valorado por tu trabajo?",
      "¿Tienes claridad sobre tus objetivos?",
      "¿Recomendarías esta empresa a un amigo?",
      "¿Qué mejorarías en tu entorno laboral?",
    ],
  },
  {
    id: "t3",
    name: "Medición eNPS",
    description: "Net Promoter Score de empleados para identificar promotores y detractores.",
    category: "eNPS",
    questionCount: 2,
    usageCount: 25,
    icon: <Star className="h-6 w-6" />,
    color: "#8b5cf6",
    bg: "bg-purple-50",
    questions: [
      "¿Qué tan probable es que recomiendes esta empresa como lugar de trabajo? (0-10)",
      "¿Cuál es la razón principal de tu calificación?",
    ],
  },
  {
    id: "t4",
    name: "Detección de Burnout",
    description: "Identifica tempranamente señales de agotamiento en el equipo.",
    category: "Bienestar",
    questionCount: 6,
    usageCount: 19,
    icon: <Flame className="h-6 w-6" />,
    color: "#f97316",
    bg: "bg-orange-50",
    questions: [
      "¿Con qué frecuencia te sientes agotado al final del día?",
      "¿Sientes que tu trabajo tiene impacto y propósito?",
      "¿Tienes dificultad para desconectarte del trabajo fuera de horario?",
      "¿Sientes que tienes el apoyo de tu manager?",
      "¿Tu carga de trabajo es sostenible?",
      "¿Qué necesitas para sentirte mejor en tu trabajo?",
    ],
  },
  {
    id: "t5",
    name: "Evaluación de Onboarding",
    description: "Recoge feedback de nuevos ingresos sobre su proceso de integración.",
    category: "Onboarding",
    questionCount: 4,
    usageCount: 12,
    icon: <Users className="h-6 w-6" />,
    color: "#10b981",
    bg: "bg-emerald-50",
    questions: [
      "¿Qué tan satisfecho estás con tu proceso de onboarding?",
      "¿Te sentiste bienvenido por tu equipo?",
      "¿Tienes claridad sobre tu rol y responsabilidades?",
      "¿Qué mejorarías del proceso de integración?",
    ],
  },
  {
    id: "t6",
    name: "Pulso Post Reunión",
    description: "Feedback rápido tras reuniones importantes para mejorar la dinámica.",
    category: "Comunicación",
    questionCount: 3,
    usageCount: 22,
    icon: <MessageCircle className="h-6 w-6" />,
    color: "#14b8a6",
    bg: "bg-teal-50",
    questions: [
      "¿Qué tan útil fue esta reunión? (1-5)",
      "¿Quedaron claros los próximos pasos?",
      "¿Tienes algún comentario para mejorar nuestras reuniones?",
    ],
  },
  {
    id: "t7",
    name: "Evaluación de Liderazgo",
    description: "Permite al equipo dar feedback anónimo sobre el estilo de su manager.",
    category: "Liderazgo",
    questionCount: 4,
    usageCount: 17,
    icon: <Award className="h-6 w-6" />,
    color: "#f59e0b",
    bg: "bg-amber-50",
    questions: [
      "¿Tu manager te brinda retroalimentación útil y oportuna?",
      "¿Tu manager apoya tu desarrollo profesional?",
      "¿Sientes que puedes comunicarte abiertamente con tu manager?",
      "¿Qué podría mejorar tu manager en su estilo de liderazgo?",
    ],
  },
  {
    id: "t8",
    name: "Revisión de Objetivos",
    description: "Chequeo de avance y claridad de metas individuales y de equipo.",
    category: "Desempeño",
    questionCount: 3,
    usageCount: 9,
    icon: <Target className="h-6 w-6" />,
    color: "#6366f1",
    bg: "bg-indigo-50",
    questions: [
      "¿Tienes claridad sobre tus objetivos para este trimestre?",
      "¿Consideras que tus metas son alcanzables y retadoras?",
      "¿Qué apoyo necesitas para lograr tus objetivos?",
    ],
  },
]

export default function PulseTemplatesPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [preview, setPreview] = useState<Template | null>(null)

  const categories = ["Todos", ...Array.from(new Set(TEMPLATES.map((t) => t.category)))]

  const filtered = TEMPLATES.filter((t) => {
    const matchesSearch =
      search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCategory === "Todos" || t.category === selectedCategory
    return matchesSearch && matchesCat
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Link href="/admin/pulses">
              <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl">
                <ChevronLeft className="h-4 w-4" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Plantillas de Pulsos</h1>
              <p className="mt-0.5 text-sm text-gray-500">
                Usa una plantilla para crear tu siguiente pulso rápidamente.
              </p>
            </div>
          </div>
          <Link href="/admin/pulses/new">
            <Button className="gap-2 bg-[#0c365c] hover:bg-[#0a2d4e] text-white rounded-xl">
              <Plus className="h-4 w-4" />
              Personalizado
            </Button>
          </Link>
        </motion.div>

        {/* Search + categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 rounded-xl border-gray-200 bg-white"
              placeholder="Buscar plantillas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                  selectedCategory === cat
                    ? "bg-[#0c365c] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((template) => (
            <motion.div
              key={template.id}
              variants={cardVariant}
              className="group relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    template.bg
                  )}
                  style={{ color: template.color }}
                >
                  {template.icon}
                </div>
                <span className="rounded-full border border-gray-100 bg-gray-50 px-2.5 py-0.5 text-xs text-gray-500">
                  {template.category}
                </span>
              </div>

              <h3 className="mb-1 font-semibold text-gray-900">{template.name}</h3>
              <p className="mb-3 text-sm text-gray-500 line-clamp-2">{template.description}</p>

              <div className="mb-4 flex items-center gap-4 text-xs text-gray-400">
                <span>{template.questionCount} preguntas</span>
                <span>Usado {template.usageCount} veces</span>
              </div>

              {/* Preview questions */}
              <div className="mb-4 space-y-1.5">
                {template.questions.slice(0, 2).map((q, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
                    <span
                      className="mt-0.5 h-4 w-4 shrink-0 rounded-full text-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: template.color }}
                    >
                      {i + 1}
                    </span>
                    <span className="line-clamp-1">{q}</span>
                  </div>
                ))}
                {template.questions.length > 2 && (
                  <p className="text-xs text-gray-400 pl-5">
                    +{template.questions.length - 2} más...
                  </p>
                )}
              </div>

              <Link href={`/admin/pulses/new`}>
                <Button
                  className="w-full gap-2 rounded-xl text-white"
                  style={{ backgroundColor: template.color }}
                >
                  Usar plantilla
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
            <Search className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="text-base font-semibold text-gray-500">Sin resultados</h3>
            <p className="mt-1 text-sm text-gray-400">Prueba con otro término de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
