"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, CheckCircle2 } from "lucide-react"
import { MobileHeader } from "@/components/employee/mobile-header"
import { delay } from "@/lib/fake-api"
import { staggerContainer, slideUp } from "@/lib/motion"
import { cn } from "@/lib/utils"

const categories = [
  { id: "ambiente", icon: "🏢", name: "Ambiente laboral", color: "#0c365c" },
  { id: "herramientas", icon: "🔧", name: "Herramientas", color: "#167fd0" },
  { id: "procesos", icon: "📋", name: "Procesos", color: "#6366f1" },
  { id: "liderazgo", icon: "👔", name: "Liderazgo", color: "#f59e0b" },
  { id: "bienestar", icon: "🧘", name: "Bienestar", color: "#10b981" },
]

export default function NewFeedbackPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedCategory || !message.trim()) return
    setIsSubmitting(true)
    await delay(1200)
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const selectedCat = categories.find((c) => c.id === selectedCategory)

  if (isSuccess) {
    return (
      <div className="flex flex-col min-h-full">
        <MobileHeader title="Feedback enviado" showBack />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="flex flex-col items-center justify-center flex-1 px-6 text-center gap-6 py-16"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 18 }}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100"
          >
            <CheckCircle2 size={48} className="text-green-500" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">¡Gracias por tu feedback!</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-[280px]">
              Tu {isAnonymous ? "mensaje anónimo" : "mensaje"} fue recibido. Ayuda a mejorar
              el ambiente de trabajo para todos.
            </p>
          </div>
          {selectedCat && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 rounded-2xl px-5 py-4 border"
              style={{ background: `${selectedCat.color}08`, borderColor: `${selectedCat.color}25` }}
            >
              <span className="text-2xl">{selectedCat.icon}</span>
              <div className="text-left">
                <p className="text-xs" style={{ color: selectedCat.color }}>Categoría</p>
                <p className="text-sm font-bold text-gray-900">{selectedCat.name}</p>
              </div>
              {isAnonymous && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 font-medium">
                  🔒 Anónimo
                </span>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      <MobileHeader title="Nuevo Feedback" showBack />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-5 px-4 py-4"
      >
        <motion.div variants={slideUp}>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Categoría
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.93 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl p-3.5 border transition-all text-left",
                  selectedCategory === cat.id
                    ? "ring-2"
                    : "bg-white border-gray-100 hover:border-gray-200"
                )}
                style={
                  selectedCategory === cat.id
                    ? { background: `${cat.color}10`, borderColor: cat.color }
                    : {}
                }
              >
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xl"
                  style={{ background: `${cat.color}15` }}
                >
                  {cat.icon}
                </div>
                <span
                  className={cn("text-xs font-semibold", selectedCategory === cat.id ? "" : "text-gray-700")}
                  style={selectedCategory === cat.id ? { color: cat.color } : {}}
                >
                  {cat.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Anonymous toggle */}
        <motion.div variants={slideUp}>
          <div className="rounded-2xl bg-white border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xl flex-shrink-0">
                  🔒
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Modo anónimo</p>
                  <p className="text-xs text-gray-500 mt-0.5">Tu identidad no será revelada</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={cn(
                  "relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors",
                  isAnonymous ? "bg-[#0c365c]" : "bg-gray-200"
                )}
              >
                <motion.div
                  animate={{ x: isAnonymous ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="h-5 w-5 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
            <AnimatePresence>
              {isAnonymous && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-gray-50"
                >
                  <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                    ✓ Tu feedback se enviará de forma completamente anónima. RRHH verá el contenido pero nunca tu nombre.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div variants={slideUp} className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Tu mensaje
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Comparte tu opinión, sugerencia o comentario de forma constructiva. Recuerda que tu feedback ayuda a mejorar el ambiente para todos..."
            rows={7}
            className="w-full resize-none rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#0c365c] focus:ring-2 focus:ring-[#0c365c]/15 shadow-sm"
          />
          <p className="text-xs text-gray-400 text-right">{message.length} caracteres</p>
        </motion.div>

        {/* Tips */}
        <motion.div
          variants={slideUp}
          className="rounded-xl bg-amber-50 border border-amber-100 p-4"
        >
          <p className="text-xs font-semibold text-amber-800 mb-2">💡 Tips para un buen feedback</p>
          <ul className="text-xs text-amber-700 space-y-1.5">
            <li>• Sé específico: describe la situación concreta</li>
            <li>• Propón soluciones cuando sea posible</li>
            <li>• Mantén un tono constructivo y respetuoso</li>
          </ul>
        </motion.div>

        <motion.button
          variants={slideUp}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!selectedCategory || !message.trim() || isSubmitting}
          className={cn(
            "flex h-13 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all",
            selectedCategory && message.trim()
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
              Enviar feedback
            </>
          )}
        </motion.button>

        <div className="h-4" />
      </motion.div>
    </div>
  )
}
