"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2, History } from "lucide-react"
import { fetchMyPulse, submitPulseResponse } from "@/lib/fake-api"
import { useEmployeeStore } from "@/store/employee-store"
import { MobileHeader } from "@/components/employee/mobile-header"
import { cn } from "@/lib/utils"
import type { Pulse, PulseAnswer } from "@/lib/types"

const EMOJI_OPTIONS = [
  { emoji: "😞", label: "Muy mal", value: "1" },
  { emoji: "😕", label: "Mal", value: "2" },
  { emoji: "😐", label: "Regular", value: "3" },
  { emoji: "🙂", label: "Bien", value: "4" },
  { emoji: "😄", label: "Muy bien", value: "5" },
]

function Confetti() {
  const colors = ["#0c365c", "#167fd0", "#f59e0b", "#10b981", "#f97316", "#8b5cf6"]
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2.5 h-2.5 rounded-sm"
          style={{
            background: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: "-10px",
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [`${(Math.random() - 0.5) * 60}px`, `${(Math.random() - 0.5) * 120}px`],
            rotate: [0, Math.random() * 720 - 360],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            delay: Math.random() * 1.5,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  )
}

export default function PulsePage() {
  const router = useRouter()
  const { setPendingPulseId } = useEmployeeStore()

  const [pulse, setPulse] = useState<Pulse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [direction, setDirection] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [xpEarned] = useState(50)

  useEffect(() => {
    fetchMyPulse()
      .then((p) => {
        setPulse(p)
        if (p) setPendingPulseId(p.id)
      })
      .finally(() => setIsLoading(false))
  }, [setPendingPulseId])

  function handleAnswer(questionId: string, value: string | number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function handleNext() {
    if (!pulse) return
    if (currentQuestion < pulse.questions.length - 1) {
      setDirection(1)
      setCurrentQuestion((q) => q + 1)
    } else {
      handleSubmit()
    }
  }

  function handleBack() {
    if (currentQuestion > 0) {
      setDirection(-1)
      setCurrentQuestion((q) => q - 1)
    }
  }

  async function handleSubmit() {
    if (!pulse) return
    setIsSubmitting(true)
    const pulseAnswers: PulseAnswer[] = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value,
    }))
    try {
      await submitPulseResponse(pulse.id, pulseAnswers)
      setIsComplete(true)
    } catch {
      // still show success for demo
      setIsComplete(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60dvh] flex-1 items-center justify-center py-16">
        <Loader2 size={32} className="animate-spin text-[#0c365c]" />
      </div>
    )
  }

  if (!pulse) {
    return (
      <div className="flex min-h-full flex-col">
        <MobileHeader
          title="Pulso"
          rightAction={
            <button onClick={() => router.push("/employee/pulse/history")} className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
              <History size={16} className="text-gray-600" />
            </button>
          }
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center flex-1 px-8 text-center gap-4 py-20"
        >
          <div className="text-6xl">📭</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sin pulsos activos</h3>
            <p className="text-sm text-gray-500 mt-2">
              No hay pulsos disponibles en este momento. Te notificaremos cuando haya uno nuevo.
            </p>
          </div>
          <button
            onClick={() => router.push("/employee/pulse/history")}
            className="mt-4 flex items-center gap-2 rounded-xl bg-[#0c365c] px-6 py-3 text-sm font-semibold text-white"
          >
            <History size={16} />
            Ver historial
          </button>
        </motion.div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <>
        <Confetti />
        <div className="flex min-h-[calc(100dvh-8rem)] flex-col items-center justify-center gap-6 bg-gradient-to-b from-white to-blue-50 px-6 py-10 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="flex h-28 w-28 items-center justify-center rounded-full bg-green-100"
          >
            <CheckCircle2 size={56} className="text-green-500" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900">¡Gracias por tu respuesta!</h2>
            <p className="text-sm text-gray-500 mt-2">
              Tu opinión ayuda a mejorar el ambiente de trabajo para todos.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-100 px-6 py-4"
          >
            <span className="text-3xl">⚡</span>
            <div className="text-left">
              <p className="text-xs text-amber-600 font-medium">Puntos ganados</p>
              <p className="text-2xl font-bold text-amber-700">+{xpEarned} XP</p>
            </div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/employee/home")}
            className="h-12 w-full max-w-[280px] rounded-xl bg-[#0c365c] text-sm font-semibold text-white shadow-lg shadow-[#0c365c]/30"
          >
            Volver al inicio
          </motion.button>
        </div>
      </>
    )
  }

  const question = pulse.questions[currentQuestion]
  const totalQuestions = pulse.questions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100
  const currentAnswer = answers[question.id]
  const canProceed = currentAnswer !== undefined && currentAnswer !== ""

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeIn" as const },
    }),
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileHeader
        title={pulse.title}
        showBack={currentQuestion === 0}
        rightAction={
          <button onClick={() => router.push("/employee/pulse/history")} className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
            <History size={16} className="text-gray-600" />
          </button>
        }
      />

      {/* Progress bar */}
      <div className="px-4 pt-2 pb-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium">
            Pregunta {currentQuestion + 1} de {totalQuestions}
          </span>
          <span className="text-xs font-semibold text-[#0c365c]">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#0c365c]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={question.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="shrink-0 text-base font-semibold leading-snug text-gray-900">
                {question.text}
              </p>

              <div className="mt-5 flex min-h-0 flex-1 flex-col justify-center gap-4">
                {question.type === "emoji" && (
                  <div className="flex flex-wrap justify-center gap-2 sm:justify-between">
                    {EMOJI_OPTIONS.map((opt) => (
                      <motion.button
                        key={opt.value}
                        whileTap={{ scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        onClick={() => handleAnswer(question.id, opt.value)}
                        className={cn(
                          "flex min-w-[3.25rem] flex-1 flex-col items-center gap-1.5 rounded-xl p-2 transition-all sm:min-w-0",
                          currentAnswer === opt.value
                            ? "bg-[#0c365c]/10 ring-2 ring-[#0c365c]"
                            : "bg-gray-50 hover:bg-gray-100"
                        )}
                      >
                        <motion.span
                          animate={{ scale: currentAnswer === opt.value ? 1.35 : 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="text-3xl"
                        >
                          {opt.emoji}
                        </motion.span>
                        <span className="text-[9px] text-gray-500 font-medium text-center leading-tight">
                          {opt.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}

                {question.type === "scale" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <motion.button
                          key={n}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => handleAnswer(question.id, n)}
                          className={cn(
                            "h-11 w-11 rounded-xl text-sm font-bold transition-all",
                            Number(currentAnswer) === n
                              ? "bg-[#0c365c] text-white shadow-md shadow-[#0c365c]/30"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          )}
                        >
                          {n}
                        </motion.button>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Nada probable</span>
                      <span className="text-xs text-gray-400">Muy probable</span>
                    </div>
                  </div>
                )}

                {question.type === "text" && (
                  <textarea
                    value={(currentAnswer as string) ?? ""}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    rows={5}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#0c365c] focus:bg-white focus:ring-2 focus:ring-[#0c365c]/15"
                  />
                )}

                {question.type === "multiple" && question.options && (
                  <div className="flex flex-col gap-2.5">
                    {question.options.map((opt) => (
                      <motion.button
                        key={opt}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleAnswer(question.id, opt)}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-left transition-all border",
                          currentAnswer === opt
                            ? "bg-[#0c365c]/10 border-[#0c365c] text-[#0c365c]"
                            : "bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <span>{opt}</span>
                        {currentAnswer === opt && (
                          <CheckCircle2 size={16} className="text-[#0c365c] flex-shrink-0" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 z-30 flex gap-3 border-t border-gray-100/80 bg-gray-50/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm supports-[backdrop-filter]:bg-gray-50/80">
        {currentQuestion > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700"
          >
            <ChevronLeft size={22} />
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          disabled={!canProceed || isSubmitting}
          className={cn(
            "flex h-12 min-h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all",
            canProceed
              ? "bg-[#0c365c] text-white shadow-lg shadow-[#0c365c]/25"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Enviando...
            </>
          ) : currentQuestion === totalQuestions - 1 ? (
            <>
              Finalizar
              <CheckCircle2 size={16} />
            </>
          ) : (
            <>
              Siguiente
              <ChevronRight size={16} />
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}
