"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronRight, Calendar, Star } from "lucide-react"
import { staggerContainer, cardVariant } from "@/lib/motion"
import { ClimaLogo } from "@/components/shared/clima-logo"

const companyValues = [
  { icon: "🌱", name: "Crecimiento", color: "#10b981" },
  { icon: "🤝", name: "Confianza", color: "#0c365c" },
  { icon: "💡", name: "Innovación", color: "#f59e0b" },
  { icon: "❤️", name: "Bienestar", color: "#ec4899" },
]

const milestones = [
  { emoji: "🎉", title: "7 años de CLIMA AI", date: "Mayo 2026", color: "#0c365c" },
  { emoji: "🚀", title: "Clientes en 8 países", date: "2026", color: "#167fd0" },
  { emoji: "🏆", title: "Mejor trimestre histórico", date: "Q1 2026", color: "#f59e0b" },
  { emoji: "👥", title: "20 personas apasionadas", date: "Hoy", color: "#10b981" },
]

const upcomingEvents = [
  { emoji: "🧘", title: "Taller de manejo del estrés", date: "Lun 19 May", time: "10:00 AM" },
  { emoji: "🧘‍♀️", title: "Meditación guiada", date: "Mié 21 May", time: "8:00 AM" },
  { emoji: "🧠", title: "Charla: Salud Mental", date: "Jue 22 May", time: "4:00 PM" },
  { emoji: "🙏", title: "Ejercicio de gratitud", date: "Vie 23 May", time: "11:00 AM" },
]

const teamPhotoColors = [
  "#0c365c", "#167fd0", "#10b981", "#f59e0b",
  "#ec4899", "#8b5cf6", "#f97316", "#14b8a6",
]

export default function CulturePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <h1 className="text-base font-semibold text-gray-900">Cultura</h1>
        </div>
      </header>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 px-4 py-4"
      >
        {/* Company hero */}
        <motion.div
          variants={cardVariant}
          className="relative overflow-hidden rounded-2xl p-5"
          style={{ background: "linear-gradient(135deg, #0c365c 0%, #167fd0 100%)" }}
        >
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
          <div className="mb-3 flex items-center gap-3">
            <div className="flex shrink-0 items-center justify-center rounded-2xl bg-zinc-950/90 p-2 ring-1 ring-white/15">
              <ClimaLogo size="sm" className="max-w-[100px]" />
            </div>
            <div>
              <p className="text-xs text-white/70">Empresa</p>
              <p className="text-sm font-medium leading-snug text-white/90">
                Plataforma de compromiso y retención
              </p>
            </div>
          </div>
          <p className="text-white/80 text-xs leading-relaxed">
            Transformamos la manera en que las empresas cuidan a su gente mediante inteligencia artificial y datos.
          </p>
          <div className="flex gap-3 mt-4">
            <div className="rounded-xl bg-white/15 px-3 py-2 text-center">
              <p className="text-white text-lg font-bold">7</p>
              <p className="text-white/60 text-[10px]">años</p>
            </div>
            <div className="rounded-xl bg-white/15 px-3 py-2 text-center">
              <p className="text-white text-lg font-bold">20</p>
              <p className="text-white/60 text-[10px]">personas</p>
            </div>
            <div className="rounded-xl bg-white/15 px-3 py-2 text-center">
              <p className="text-white text-lg font-bold">8</p>
              <p className="text-white/60 text-[10px]">países</p>
            </div>
          </div>
        </motion.div>

        {/* Mission card */}
        <motion.button
          variants={cardVariant}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/employee/culture/mission")}
          className="w-full rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-4 text-left"
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#0c365c]/10 text-2xl">
            🎯
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Propósito</p>
            <h3 className="text-sm font-bold text-gray-900 mt-0.5">Nuestra misión y visión</h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
              Descubre el propósito que nos une como empresa
            </p>
          </div>
          <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
        </motion.button>

        {/* Values */}
        <motion.div variants={cardVariant}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Nuestros valores
            </h3>
            <button
              onClick={() => router.push("/employee/culture/values")}
              className="text-xs font-medium text-[#0c365c]"
            >
              Ver todos
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {companyValues.map((val) => (
              <motion.button
                key={val.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/employee/culture/values")}
                className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-3.5 text-left shadow-sm"
              >
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg"
                  style={{ background: `${val.color}15` }}
                >
                  {val.icon}
                </div>
                <span className="text-xs font-semibold text-gray-800">{val.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Team photos */}
        <motion.div variants={cardVariant}>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Nuestro equipo
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {teamPhotoColors.map((color, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl flex items-center justify-center text-white text-xl font-bold"
                style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)` }}
              >
                {["😊", "🚀", "💡", "🤝", "🌟", "❤️", "🎯", "💪"][i]}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">20 personas apasionadas por el bienestar laboral</p>
        </motion.div>

        {/* Milestones */}
        <motion.div variants={cardVariant}>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Hitos y celebraciones
          </h3>
          <div className="flex flex-col gap-2.5">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-3.5"
              >
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ background: `${m.color}12` }}
                >
                  {m.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{m.title}</p>
                  <p className="text-xs text-gray-400">{m.date}</p>
                </div>
                <Star size={14} className="text-amber-400 fill-amber-400 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming events */}
        <motion.div variants={cardVariant}>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Próximos eventos
          </h3>
          <div className="flex flex-col gap-2.5">
            {upcomingEvents.map((event, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-3.5"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xl">
                  {event.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Calendar size={10} className="text-gray-400" />
                    <p className="text-xs text-gray-400">{event.date} · {event.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="h-4" />
      </motion.div>
    </div>
  )
}
