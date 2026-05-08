"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, CheckCircle2, Loader2, ChevronRight } from "lucide-react"
import { createRecognition } from "@/lib/fake-api"
import { useAuthStore } from "@/store/auth-store"
import { MOCK_EMPLOYEES } from "@/lib/mock-data"
import { MobileHeader } from "@/components/employee/mobile-header"
import { staggerContainer, cardVariant, scaleInBounce } from "@/lib/motion"
import { cn } from "@/lib/utils"

const BADGES = [
  { id: "innovador", name: "Innovador", icon: "💡", color: "#f59e0b", desc: "Por aportar ideas creativas" },
  { id: "colaborador", name: "Colaborador", icon: "🤝", color: "#10b981", desc: "Por apoyar al equipo" },
  { id: "lider", name: "Líder", icon: "🏆", color: "#0c365c", desc: "Liderazgo excepcional" },
  { id: "empatico", name: "Empático", icon: "🫶", color: "#ec4899", desc: "Conexión humana genuina" },
  { id: "creativo", name: "Creativo", icon: "🎨", color: "#f97316", desc: "Creatividad sobresaliente" },
  { id: "experto", name: "Experto", icon: "📊", color: "#6366f1", desc: "Conocimiento técnico" },
  { id: "valiente", name: "Valiente", icon: "💪", color: "#8b5cf6", desc: "Por enfrentar desafíos" },
  { id: "mentor", name: "Mentor", icon: "🎓", color: "#14b8a6", desc: "Por guiar a otros" },
]

type Step = "recipient" | "badge" | "message" | "done"

function ConfettiCelebration() {
  const colors = ["#0c365c", "#f59e0b", "#10b981", "#ec4899", "#f97316", "#8b5cf6"]
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            background: colors[i % colors.length],
            width: Math.random() * 10 + 6,
            height: Math.random() * 10 + 6,
            left: `${Math.random() * 100}%`,
            top: "-20px",
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [(Math.random() - 0.5) * 80, (Math.random() - 0.5) * 160],
            rotate: [0, Math.random() * 720 - 360],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 2.5 + 2,
            delay: Math.random() * 1.5,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  )
}

export default function NewRecognitionPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  const [step, setStep] = useState<Step>("recipient")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<(typeof MOCK_EMPLOYEES)[0] | null>(null)
  const [selectedBadge, setSelectedBadge] = useState<(typeof BADGES)[0] | null>(null)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableEmployees = MOCK_EMPLOYEES.filter(
    (e) => e.id !== user?.id
  ).filter(
    (e) =>
      !searchQuery ||
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  async function handleSubmit() {
    if (!selectedEmployee || !selectedBadge || !message.trim()) return
    setIsSubmitting(true)
    try {
      await createRecognition({
        fromId: user?.id ?? "",
        fromName: user?.name ?? "",
        fromAvatar: user?.avatar ?? "",
        toId: selectedEmployee.id,
        toName: selectedEmployee.name,
        toAvatar: selectedEmployee.avatar,
        message,
        badge: selectedBadge.name,
        badgeColor: selectedBadge.color,
        badgeIcon: selectedBadge.icon,
        isPublic: true,
      })
      setStep("done")
    } catch {
      setStep("done")
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepLabels: Record<Step, string> = {
    recipient: "¿A quién reconoces?",
    badge: "Elige una insignia",
    message: "Escribe tu mensaje",
    done: "¡Enviado!",
  }

  return (
    <div className="flex flex-col min-h-full">
      <MobileHeader title="Dar reconocimiento" showBack />

      <AnimatePresence mode="wait">
        {step === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="flex flex-col items-center justify-center flex-1 px-6 text-center gap-6 py-16"
          >
            <ConfettiCelebration />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 18 }}
              className="text-7xl"
            >
              🎉
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">¡Reconocimiento enviado!</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-[280px]">
                {selectedEmployee?.name.split(" ")[0]} recibirá una notificación de tu reconocimiento.
              </p>
            </div>
            {selectedBadge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 rounded-2xl border px-5 py-4"
                style={{ borderColor: `${selectedBadge.color}30`, background: `${selectedBadge.color}10` }}
              >
                <span className="text-3xl">{selectedBadge.icon}</span>
                <div className="text-left">
                  <p className="text-xs font-medium" style={{ color: selectedBadge.color }}>Insignia enviada</p>
                  <p className="text-base font-bold text-gray-900">{selectedBadge.name}</p>
                </div>
              </motion.div>
            )}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/employee/recognition")}
              className="h-13 w-full max-w-[280px] rounded-xl bg-[#0c365c] text-sm font-semibold text-white shadow-lg shadow-[#0c365c]/30"
            >
              Ver reconocimientos
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col flex-1 px-4 py-4 gap-4"
          >
            {/* Step indicator */}
            <div className="flex gap-1.5">
              {(["recipient", "badge", "message"] as Step[]).map((s, i) => (
                <div
                  key={s}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                    step === s
                      ? "bg-[#0c365c]"
                      : ["recipient", "badge", "message"].indexOf(step) > i
                      ? "bg-[#0c365c]/40"
                      : "bg-gray-200"
                  )}
                />
              ))}
            </div>

            <h2 className="text-lg font-bold text-gray-900">{stepLabels[step]}</h2>

            {step === "recipient" && (
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar colaborador..."
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#0c365c] focus:ring-2 focus:ring-[#0c365c]/15"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {availableEmployees.map((emp) => (
                    <motion.button
                      key={emp.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setSelectedEmployee(emp)
                        setStep("badge")
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl p-3.5 text-left border transition-all",
                        selectedEmployee?.id === emp.id
                          ? "bg-[#0c365c]/10 border-[#0c365c]"
                          : "bg-white border-gray-100 hover:border-gray-200"
                      )}
                    >
                      <img src={emp.avatar} alt={emp.name} className="h-11 w-11 rounded-full bg-gray-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{emp.name}</p>
                        <p className="text-xs text-gray-500 truncate">{emp.role} · {emp.department}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === "badge" && (
              <div className="flex flex-col gap-4">
                {selectedEmployee && (
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="h-10 w-10 rounded-full" />
                    <div>
                      <p className="text-xs text-gray-500">Reconociendo a</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedEmployee.name.split(" ").slice(0, 2).join(" ")}</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {BADGES.map((badge) => (
                    <motion.button
                      key={badge.id}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => {
                        setSelectedBadge(badge)
                        setStep("message")
                      }}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-2xl p-4 border transition-all",
                        selectedBadge?.id === badge.id
                          ? "ring-2"
                          : "bg-white border-gray-100"
                      )}
                  style={
                    selectedBadge?.id === badge.id
                      ? { background: `${badge.color}12`, borderColor: badge.color }
                      : {}
                  }
                    >
                      <span className="text-3xl">{badge.icon}</span>
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-900">{badge.name}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{badge.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === "message" && (
              <div className="flex flex-col gap-4">
                {selectedEmployee && selectedBadge && (
                  <div className="flex items-center gap-3 rounded-xl p-3 border" style={{ background: `${selectedBadge.color}08`, borderColor: `${selectedBadge.color}30` }}>
                    <span className="text-2xl">{selectedBadge.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500">Insignia</p>
                      <p className="text-sm font-semibold" style={{ color: selectedBadge.color }}>{selectedBadge.name}</p>
                    </div>
                    <span className="text-gray-300 mx-1">→</span>
                    <img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="h-9 w-9 rounded-full" />
                    <p className="text-xs font-semibold text-gray-900">{selectedEmployee.name.split(" ")[0]}</p>
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Mensaje de reconocimiento
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe por qué merece este reconocimiento... Sé específico y sincero ✨"
                    rows={6}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#0c365c] focus:bg-white focus:ring-2 focus:ring-[#0c365c]/15"
                  />
                  <p className="text-xs text-gray-400 text-right">{message.length} caracteres</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={!message.trim() || isSubmitting}
                  className={cn(
                    "flex h-13 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all",
                    message.trim()
                      ? "bg-[#0c365c] text-white shadow-lg shadow-[#0c365c]/25"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Enviar reconocimiento
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
