"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, AlertTriangle, CheckCircle2 } from "lucide-react"
import { staggerContainer, cardVariant } from "@/lib/motion"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

const categories = [
  { icon: "🏢", name: "Ambiente laboral", color: "#0c365c", count: 3 },
  { icon: "🔧", name: "Herramientas", color: "#167fd0", count: 1 },
  { icon: "📋", name: "Procesos", color: "#6366f1", count: 2 },
  { icon: "👔", name: "Liderazgo", color: "#f59e0b", count: 1 },
  { icon: "🧘", name: "Bienestar", color: "#10b981", count: 4 },
]

const recentFeedback = [
  {
    id: "fb-1",
    category: "Bienestar",
    icon: "🧘",
    color: "#10b981",
    preview: "Sería genial tener más opciones de horario flexible para gestionar mejor el balance vida-trabajo...",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    anonymous: true,
    status: "received",
  },
  {
    id: "fb-2",
    category: "Procesos",
    icon: "📋",
    color: "#6366f1",
    preview: "Los procesos de aprobación de gastos podrían agilizarse con la nueva plataforma de Ramp...",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    anonymous: false,
    status: "reviewed",
  },
  {
    id: "fb-3",
    category: "Ambiente laboral",
    icon: "🏢",
    color: "#0c365c",
    preview: "Las reuniones de los miércoles podrían ser más cortas y enfocadas. Propongo un formato de 30 min...",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    anonymous: true,
    status: "received",
  },
]

export default function FeedbackPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-full">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center">
        <h1 className="text-base font-semibold text-gray-900">Feedback</h1>
      </header>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 px-4 py-4"
      >
        {/* Action buttons */}
        <motion.div variants={cardVariant} className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/employee/feedback/new")}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#0c365c] p-4 text-center min-h-[100px]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-2xl">
              💬
            </div>
            <span className="text-xs font-semibold text-white">Dar feedback</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/employee/feedback/new?type=problem")}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-rose-500 p-4 text-center min-h-[100px]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-2xl">
              ⚠️
            </div>
            <span className="text-xs font-semibold text-white">Reportar problema</span>
          </motion.button>
        </motion.div>

        {/* Info card */}
        <motion.div
          variants={cardVariant}
          className="rounded-2xl bg-blue-50 border border-blue-100 p-4 flex items-start gap-3"
        >
          <div className="text-xl flex-shrink-0">🔒</div>
          <div>
            <p className="text-sm font-semibold text-blue-900">Tu privacidad importa</p>
            <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
              Puedes enviar feedback de forma anónima. Tu identidad nunca será revelada cuando actives el modo anónimo.
            </p>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div variants={cardVariant}>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Categorías
          </h3>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat.name}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/employee/feedback/new?category=${cat.name}`)}
                className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-3.5 text-left"
              >
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ background: `${cat.color}12` }}
                >
                  {cat.icon}
                </div>
                <span className="flex-1 text-sm font-medium text-gray-800">{cat.name}</span>
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: cat.color }}
                >
                  {cat.count}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent feedback */}
        <motion.div variants={cardVariant}>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Mis feedbacks recientes
          </h3>
          <div className="flex flex-col gap-3">
            {recentFeedback.map((fb) => (
              <div
                key={fb.id}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{ background: `${fb.color}12` }}
                  >
                    {fb.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-[10px] font-semibold rounded-full px-2 py-0.5"
                        style={{ background: `${fb.color}15`, color: fb.color }}
                      >
                        {fb.category}
                      </span>
                      <div className={`flex items-center gap-1 text-[10px] font-medium ${fb.status === "reviewed" ? "text-green-600" : "text-gray-400"}`}>
                        {fb.status === "reviewed" ? (
                          <><CheckCircle2 size={10} /> Revisado</>
                        ) : (
                          <><AlertTriangle size={10} /> Recibido</>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{fb.preview}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {fb.anonymous && (
                        <span className="text-[10px] text-gray-400 bg-gray-50 rounded-full px-2 py-0.5 font-medium">
                          🔒 Anónimo
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">
                        {formatDistanceToNow(new Date(fb.date), { addSuffix: true, locale: es })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="h-4" />
      </motion.div>

      {/* FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push("/employee/feedback/new")}
        className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-full bg-[#0c365c] px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#0c365c]/40"
      >
        <Plus size={18} />
        Nuevo feedback
      </motion.button>
    </div>
  )
}
