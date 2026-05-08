"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Flame, Heart, MessageSquare, Megaphone, Star,
  ChevronRight, Activity, Leaf, Trophy, Users
} from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useEmployeeStore } from "@/store/employee-store"
import { MOCK_RECOGNITIONS, MOCK_ANNOUNCEMENTS, MOCK_PULSES, MOCK_EMPLOYEES } from "@/lib/mock-data"
import { NotificationBell } from "@/components/employee/notification-bell"
import { ClimaLogo } from "@/components/shared/clima-logo"
import { staggerContainer, cardVariant, slideUp, slideDown } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

const MOODS = [
  { emoji: "😞", value: 1, label: "Mal" },
  { emoji: "😕", value: 2, label: "Regular" },
  { emoji: "😐", value: 3, label: "Neutro" },
  { emoji: "🙂", value: 4, label: "Bien" },
  { emoji: "😄", value: 5, label: "Excelente" },
]

const quickActions = [
  { icon: Heart, label: "Dar reconocimiento", href: "/employee/recognition/new", color: "bg-rose-100 text-rose-600" },
  { icon: MessageSquare, label: "Enviar feedback", href: "/employee/feedback/new", color: "bg-violet-100 text-violet-600" },
  { icon: Leaf, label: "Ver cultura", href: "/employee/culture", color: "bg-emerald-100 text-emerald-600" },
  { icon: Trophy, label: "Ver logros", href: "/employee/achievements", color: "bg-amber-100 text-amber-600" },
]

function getDayGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Buenos días"
  if (hour < 18) return "Buenas tardes"
  return "Buenas noches"
}

function getFirstName(name: string) {
  return name?.split(" ")[0] ?? ""
}

export default function EmployeeHomePage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { hasCheckedInToday, setHasCheckedInToday, setCurrentMood, streak } = useEmployeeStore()

  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [moodSubmitted, setMoodSubmitted] = useState(hasCheckedInToday)
  const [likedRecognitions, setLikedRecognitions] = useState<Set<string>>(new Set())

  const activePulse = MOCK_PULSES.find((p) => p.status === "active")
  const latestRecognitions = MOCK_RECOGNITIONS.slice(0, 3)
  const latestAnnouncements = MOCK_ANNOUNCEMENTS.slice(0, 2)

  const currentEmployee = MOCK_EMPLOYEES.find((e) => e.id === user?.id)
  const streakDays = currentEmployee?.streakDays ?? streak
  const teamAvgMood = 3.8

  function handleMoodSubmit() {
    if (!selectedMood) return
    setCurrentMood(selectedMood)
    setHasCheckedInToday(true)
    setMoodSubmitted(true)
  }

  function toggleLike(recId: string) {
    setLikedRecognitions((prev) => {
      const next = new Set(prev)
      next.has(recId) ? next.delete(recId) : next.add(recId)
      return next
    })
  }

  const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className="flex flex-col min-h-full">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <ClimaLogo size="2xs" className="max-w-[72px]" />
          <span className="text-sm font-semibold capitalize leading-tight text-gray-900">{today}</span>
        </div>
        <NotificationBell />
      </header>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 px-4 py-4"
      >
        {/* Greeting card */}
        <motion.div
          variants={cardVariant}
          className="relative overflow-hidden rounded-2xl p-5"
          style={{ background: "linear-gradient(135deg, #0c365c 0%, #167fd0 100%)" }}
        >
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" />
          <p className="text-white/75 text-sm font-medium">{getDayGreeting()},</p>
          <h2 className="text-white text-xl font-bold mt-0.5">
            {getFirstName(user?.name ?? "Colaborador")} 👋
          </h2>
          <p className="text-white/60 text-xs mt-1">Bienvenido/a de vuelta</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5">
              <Flame size={14} className="text-orange-300" />
              <span className="text-white text-xs font-semibold">{streakDays} días de racha</span>
            </div>
          </div>
        </motion.div>

        {/* Mood check-in */}
        <AnimatePresence mode="wait">
          {!moodSubmitted ? (
            <motion.div
              key="mood-checkin"
              variants={cardVariant}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5"
            >
              <h3 className="text-sm font-semibold text-gray-900">¿Cómo te sientes hoy?</h3>
              <p className="text-xs text-gray-500 mt-0.5">Tu estado de ánimo es importante para nosotros</p>
              <div className="flex justify-between mt-4 gap-1">
                {MOODS.map((mood) => (
                  <motion.button
                    key={mood.value}
                    whileTap={{ scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    onClick={() => setSelectedMood(mood.value)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl p-2 transition-all flex-1",
                      selectedMood === mood.value
                        ? "bg-[#0c365c]/10 ring-2 ring-[#0c365c]"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <motion.span
                      animate={{ scale: selectedMood === mood.value ? 1.3 : 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="text-2xl"
                    >
                      {mood.emoji}
                    </motion.span>
                    <span className="text-[9px] text-gray-500 font-medium">{mood.label}</span>
                  </motion.button>
                ))}
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleMoodSubmit}
                disabled={!selectedMood}
                className={cn(
                  "mt-4 h-11 w-full rounded-xl text-sm font-semibold transition-all",
                  selectedMood
                    ? "bg-[#0c365c] text-white shadow-md shadow-[#0c365c]/25"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                Registrar mi estado
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="mood-done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="rounded-2xl bg-green-50 border border-green-100 p-4 flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-xl flex-shrink-0">
                ✅
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">¡Gracias por compartir!</p>
                <p className="text-xs text-green-600 mt-0.5">Estado de hoy registrado</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active pulse banner */}
        {activePulse && (
          <motion.div
            variants={cardVariant}
            className="rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => router.push("/employee/pulse")}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-violet-500 to-purple-600 text-left"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20">
                <Activity size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/75 text-xs font-medium">Pulso activo</p>
                <p className="text-white text-sm font-bold leading-tight truncate">{activePulse.title}</p>
                <p className="text-white/60 text-xs mt-0.5">
                  {activePulse.questions.length} preguntas · ~2 min
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <span className="rounded-full bg-white text-purple-600 text-xs font-bold px-3 py-1.5 whitespace-nowrap">
                  Responder
                </span>
                <ChevronRight size={16} className="text-white/60" />
              </div>
            </button>
          </motion.div>
        )}

        {/* Quick actions */}
        <motion.div variants={cardVariant}>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Acciones rápidas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.href}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={() => router.push(action.href)}
                  className="flex items-center gap-3 rounded-2xl bg-white border border-gray-100 p-3.5 text-left shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={cn("flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl", action.color)}>
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 leading-tight">{action.label}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Engagement streak card */}
        <motion.div
          variants={cardVariant}
          className="rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 p-4 flex items-center gap-4"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl flex-shrink-0">
            🔥
          </div>
          <div>
            <p className="text-white/80 text-xs font-medium">Racha actual</p>
            <p className="text-white text-2xl font-bold leading-none">{streakDays} días</p>
            <p className="text-white/70 text-xs mt-0.5">¡Sigue así, lo estás haciendo genial!</p>
          </div>
        </motion.div>

        {/* Team mood */}
        <motion.div
          variants={cardVariant}
          className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-4"
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50">
            <Users size={22} className="text-[#0c365c]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Ánimo promedio del equipo</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-lg font-bold text-gray-900">{teamAvgMood}/5</p>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    className={star <= Math.round(teamAvgMood) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                  />
                ))}
              </div>
            </div>
          </div>
          <span className="text-2xl">🙂</span>
        </motion.div>

        {/* Recognition feed */}
        <motion.div variants={cardVariant}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Reconocimientos recientes
            </h3>
            <button
              onClick={() => router.push("/employee/recognition")}
              className="text-xs font-medium text-[#0c365c]"
            >
              Ver todos
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {latestRecognitions.map((rec) => (
              <motion.div
                key={rec.id}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={rec.fromAvatar}
                    alt={rec.fromName}
                    className="h-9 w-9 rounded-full bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-gray-900 truncate">
                        {rec.fromName.split(" ")[0]}
                      </span>
                      <span className="text-xs text-gray-400">reconoció a</span>
                      <span className="text-xs font-semibold text-[#0c365c] truncate">
                        {rec.toName.split(" ")[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-base">{rec.badgeIcon}</span>
                      <span
                        className="text-[10px] font-semibold rounded-full px-2 py-0.5"
                        style={{ background: `${rec.badgeColor}20`, color: rec.badgeColor }}
                      >
                        {rec.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{rec.message}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-50">
                  <span className="text-[10px] text-gray-400">
                    {formatDistanceToNow(new Date(rec.createdAt), { addSuffix: true, locale: es })}
                  </span>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => toggleLike(rec.id)}
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all",
                        likedRecognitions.has(rec.id)
                          ? "bg-rose-100 text-rose-600"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      <Heart size={11} className={likedRecognitions.has(rec.id) ? "fill-rose-500 text-rose-500" : ""} />
                      {rec.reactions.reduce((sum, r) => sum + r.count, 0) + (likedRecognitions.has(rec.id) ? 1 : 0)}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Announcements */}
        <motion.div variants={cardVariant}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Anuncios
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {latestAnnouncements.map((ann) => {
              const categoryColors: Record<string, string> = {
                achievement: "bg-amber-100 text-amber-700",
                policy: "bg-blue-100 text-blue-700",
                event: "bg-green-100 text-green-700",
                update: "bg-purple-100 text-purple-700",
                general: "bg-gray-100 text-gray-700",
              }
              const categoryLabels: Record<string, string> = {
                achievement: "Logro",
                policy: "Política",
                event: "Evento",
                update: "Actualización",
                general: "General",
              }
              return (
                <motion.div
                  key={ann.id}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#0c365c]/10">
                      <Megaphone size={18} className="text-[#0c365c]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {ann.pinned && (
                          <span className="text-[10px] font-semibold text-[#0c365c] bg-[#0c365c]/10 rounded-full px-2 py-0.5">
                            📌 Fijado
                          </span>
                        )}
                        <span className={cn("text-[10px] font-semibold rounded-full px-2 py-0.5", categoryColors[ann.category])}>
                          {categoryLabels[ann.category]}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mt-1.5 leading-snug">
                        {ann.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ann.content}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <img src={ann.authorAvatar} alt={ann.authorName} className="h-4 w-4 rounded-full" />
                        <span className="text-[10px] text-gray-400">{ann.authorName.split(" ")[0]}</span>
                        <span className="text-[10px] text-gray-300">·</span>
                        <span className="text-[10px] text-gray-400">
                          {formatDistanceToNow(new Date(ann.publishedAt), { addSuffix: true, locale: es })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <div className="h-4" />
      </motion.div>
    </div>
  )
}
