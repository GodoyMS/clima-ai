"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft, ChevronRight, Check, Plus, Trash2,
  Smile, BarChart2, AlignLeft, ListChecks, Users,
  Clock, Bell, FileText
} from "lucide-react"
import { useCreatePulse } from "@/hooks/use-pulses"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { slideUp, staggerContainer, cardVariant } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { Pulse, PulseQuestion } from "@/lib/types"

const STEPS = [
  { id: 1, label: "Información básica", icon: <FileText className="h-4 w-4" /> },
  { id: 2, label: "Preguntas", icon: <ListChecks className="h-4 w-4" /> },
  { id: 3, label: "Configuración", icon: <Clock className="h-4 w-4" /> },
]

const PULSE_TYPES: { value: Pulse["type"]; label: string; desc: string; color: string }[] = [
  { value: "mood", label: "Bienestar", desc: "Check-in emocional rápido", color: "bg-pink-50 border-pink-200 text-pink-700" },
  { value: "engagement", label: "Compromiso", desc: "Nivel de engagement y satisfacción", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { value: "enps", label: "eNPS", desc: "Net Promoter Score de empleados", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { value: "custom", label: "Personalizado", desc: "Preguntas a tu medida", color: "bg-orange-50 border-orange-200 text-orange-700" },
]

const QUESTION_TYPES: { value: PulseQuestion["type"]; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "emoji", label: "Emoji", icon: <Smile className="h-4 w-4" />, desc: "Escala de emojis (😔–😄)" },
  { value: "scale", label: "Escala", icon: <BarChart2 className="h-4 w-4" />, desc: "Escala numérica 1–10" },
  { value: "text", label: "Texto abierto", icon: <AlignLeft className="h-4 w-4" />, desc: "Respuesta libre" },
  { value: "multiple", label: "Opción múltiple", icon: <ListChecks className="h-4 w-4" />, desc: "Elige una opción" },
]

const AUDIENCES = [
  { value: "all", label: "Toda la empresa" },
  { value: "department", label: "Por departamento" },
  { value: "team", label: "Por equipo" },
]

function generateId() {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

export default function NewPulsePage() {
  const router = useRouter()
  const { mutateAsync: createPulse, isPending } = useCreatePulse()

  const [step, setStep] = useState(1)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<Pulse["type"]>("mood")
  const [audience, setAudience] = useState("all")
  const [questions, setQuestions] = useState<PulseQuestion[]>([
    { id: generateId(), text: "", type: "emoji" },
  ])
  const [scheduleDate, setScheduleDate] = useState("")
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifySlack, setNotifySlack] = useState(false)
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(false)

  function addQuestion() {
    setQuestions((prev) => [
      ...prev,
      { id: generateId(), text: "", type: "scale" },
    ])
  }

  function removeQuestion(id: string) {
    if (questions.length <= 1) return
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  function updateQuestion(id: string, patch: Partial<PulseQuestion>) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)))
  }

  function canProceed() {
    if (step === 1) return title.trim().length > 0
    if (step === 2) return questions.every((q) => q.text.trim().length > 0)
    return true
  }

  async function handleSubmit() {
    try {
      await createPulse({
        title,
        description,
        type,
        questions,
        scheduledAt: scheduleDate ? new Date(scheduleDate).toISOString() : undefined,
        status: scheduleDate ? "scheduled" : "draft",
      })
      toast.success("Pulso creado exitosamente")
      router.push("/admin/pulses")
    } catch {
      toast.error("Error al crear el pulso. Intenta de nuevo.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (step === 1 ? router.push("/admin/pulses") : setStep((s) => s - 1))}
            className="gap-1.5 rounded-xl text-gray-600 hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
            {step === 1 ? "Cancelar" : "Anterior"}
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Crear nuevo pulso</h1>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                    step > s.id
                      ? "border-[#0c365c] bg-[#0c365c] text-white"
                      : step === s.id
                      ? "border-[#0c365c] bg-white text-[#0c365c]"
                      : "border-gray-200 bg-white text-gray-400"
                  )}
                >
                  {step > s.id ? <Check className="h-4 w-4" /> : s.icon}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    step === s.id ? "text-[#0c365c]" : "text-gray-400"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-2 flex-1 h-0.5 -mt-5 transition-all",
                    step > s.id ? "bg-[#0c365c]" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Basic info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-5 text-lg font-semibold text-gray-900">Información básica</h2>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Título del pulso <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    className="mt-1.5 rounded-xl border-gray-200"
                    placeholder="ej. Pulso semanal de bienestar"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    className="mt-1.5 rounded-xl border-gray-200 resize-none"
                    placeholder="Describe el objetivo de este pulso..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium text-gray-700">
                    Tipo de pulso <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {PULSE_TYPES.map((pt) => (
                      <button
                        key={pt.value}
                        type="button"
                        onClick={() => setType(pt.value)}
                        className={cn(
                          "flex flex-col items-start gap-1 rounded-xl border-2 p-3.5 text-left transition-all",
                          type === pt.value
                            ? `${pt.color} border-current ring-2 ring-current ring-offset-1`
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        )}
                      >
                        <span className="font-semibold text-sm">{pt.label}</span>
                        <span className="text-xs opacity-75">{pt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium text-gray-700">Audiencia</Label>
                  <div className="flex gap-2 flex-wrap">
                    {AUDIENCES.map((a) => (
                      <button
                        key={a.value}
                        type="button"
                        onClick={() => setAudience(a.value)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                          audience === a.value
                            ? "border-[#0c365c] bg-[#0c365c] text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        )}
                      >
                        <Users className="h-3.5 w-3.5" />
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Questions */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-lg font-semibold text-gray-900">Preguntas</h2>
                <p className="mb-5 text-sm text-gray-500">
                  Agrega entre 1 y 10 preguntas para este pulso.
                </p>

                <div className="space-y-4">
                  {questions.map((q, i) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Pregunta {i + 1}
                        </span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(q.id)}
                            className="rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <Input
                        className="mb-3 rounded-xl border-gray-200 bg-white"
                        placeholder="Escribe la pregunta..."
                        value={q.text}
                        onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                      />
                      <div className="flex flex-wrap gap-2">
                        {QUESTION_TYPES.map((qt) => (
                          <button
                            key={qt.value}
                            type="button"
                            onClick={() => updateQuestion(q.id, { type: qt.value })}
                            className={cn(
                              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                              q.type === qt.value
                                ? "border-[#0c365c] bg-[#0c365c] text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            )}
                          >
                            {qt.icon}
                            {qt.label}
                          </button>
                        ))}
                      </div>
                      {q.type === "multiple" && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-gray-500">
                            Opciones (separadas por coma):
                          </p>
                          <Input
                            className="rounded-xl border-gray-200 bg-white text-sm"
                            placeholder="Opción 1, Opción 2, Opción 3..."
                            value={q.options?.join(", ") ?? ""}
                            onChange={(e) =>
                              updateQuestion(q.id, {
                                options: e.target.value.split(",").map((o) => o.trim()),
                              })
                            }
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {questions.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 w-full gap-2 rounded-xl border-dashed border-gray-300 text-gray-600 hover:border-[#0c365c] hover:text-[#0c365c]"
                    onClick={addQuestion}
                  >
                    <Plus className="h-4 w-4" />
                    Agregar pregunta
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Configuration */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Schedule */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-lg font-semibold text-gray-900">Programación</h2>
                <p className="mb-5 text-sm text-gray-500">
                  Deja vacío para guardar como borrador, o selecciona fecha para programar.
                </p>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Fecha de envío
                  </Label>
                  <Input
                    type="datetime-local"
                    className="mt-1.5 rounded-xl border-gray-200"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Notifications */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-lg font-semibold text-gray-900">Notificaciones</h2>
                <p className="mb-5 text-sm text-gray-500">
                  Elige cómo notificar a los empleados.
                </p>
                <div className="space-y-3">
                  {[
                    { id: "email", label: "Correo electrónico", value: notifyEmail, setter: setNotifyEmail },
                    { id: "slack", label: "Slack", value: notifySlack, setter: setNotifySlack },
                    { id: "whatsapp", label: "WhatsApp", value: notifyWhatsApp, setter: setNotifyWhatsApp },
                  ].map((n) => (
                    <label
                      key={n.id}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Bell className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{n.label}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => n.setter(!n.value)}
                        className={cn(
                          "relative h-5 w-9 rounded-full transition-colors",
                          n.value ? "bg-[#0c365c]" : "bg-gray-200"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                            n.value ? "translate-x-4" : "translate-x-0.5"
                          )}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-2xl border border-[#0c365c]/20 bg-[#0c365c]/5 p-6">
                <h3 className="mb-3 font-semibold text-[#0c365c]">Resumen del pulso</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Título</span>
                    <span className="font-medium text-gray-900 max-w-[60%] text-right">{title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tipo</span>
                    <span className="font-medium text-gray-900 capitalize">{type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Preguntas</span>
                    <span className="font-medium text-gray-900">{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Audiencia</span>
                    <span className="font-medium text-gray-900">
                      {AUDIENCES.find((a) => a.value === audience)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estado</span>
                    <span className="font-medium text-gray-900">
                      {scheduleDate ? "Programado" : "Borrador"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => (step === 1 ? router.push("/admin/pulses") : setStep((s) => s - 1))}
            className="gap-2 rounded-xl"
          >
            <ChevronLeft className="h-4 w-4" />
            {step === 1 ? "Cancelar" : "Anterior"}
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="gap-2 bg-[#0c365c] hover:bg-[#0a2d4e] text-white rounded-xl"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="gap-2 bg-[#0c365c] hover:bg-[#0a2d4e] text-white rounded-xl"
            >
              {isPending ? "Creando..." : "Crear pulso"}
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
