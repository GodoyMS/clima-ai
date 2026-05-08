"use client"

import { motion } from "framer-motion"
import { Flame, Trophy } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useEmployeeStore } from "@/store/employee-store"
import { MOCK_EMPLOYEES } from "@/lib/mock-data"
import { MobileHeader } from "@/components/employee/mobile-header"
import { staggerContainer, cardVariant } from "@/lib/motion"
import { cn } from "@/lib/utils"

const allBadges = [
  { id: "innovador", name: "Innovador", icon: "💡", color: "#f59e0b", desc: "Aporta ideas creativas" },
  { id: "colaborador", name: "Colaborador", icon: "🤝", color: "#10b981", desc: "Apoya al equipo constantemente" },
  { id: "lider", name: "Líder", icon: "🏆", color: "#0c365c", desc: "Liderazgo excepcional" },
  { id: "empatico", name: "Empático", icon: "🫶", color: "#ec4899", desc: "Conexión humana genuina" },
  { id: "estrella", name: "Estrella del Mes", icon: "⭐", color: "#f59e0b", desc: "Mejor desempeño del mes" },
  { id: "mentor", name: "Mentor", icon: "🎓", color: "#8b5cf6", desc: "Guía y apoya a otros" },
  { id: "creativo", name: "Creativo", icon: "🎨", color: "#f97316", desc: "Creatividad sobresaliente" },
  { id: "analitico", name: "Analítico", icon: "📊", color: "#6366f1", desc: "Insights basados en datos" },
  { id: "disponibilidad", name: "Disponibilidad", icon: "⚡", color: "#eab308", desc: "Siempre disponible cuando se necesita" },
  { id: "crecimiento", name: "Crecimiento", icon: "📈", color: "#10b981", desc: "Impulsa el crecimiento" },
  { id: "visionario", name: "Visionario", icon: "🔭", color: "#0c365c", desc: "Visión estratégica de largo plazo" },
  { id: "fundador", name: "Fundador", icon: "🚀", color: "#167fd0", desc: "Parte fundacional del equipo" },
]

const leaderboard = [
  { rank: 1, name: "Roberto Jiménez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto", score: 95, streak: 60, badge: "🥇" },
  { rank: 2, name: "María López", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", score: 91, streak: 28, badge: "🥈" },
  { rank: 3, name: "Laura Sánchez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura", score: 88, streak: 45, badge: "🥉" },
  { rank: 4, name: "Sofía Ramírez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia", score: 89, streak: 22, badge: "4️⃣" },
  { rank: 5, name: "Natalia Herrera", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Natalia", score: 85, streak: 25, badge: "5️⃣" },
]

const CURRENT_LEVEL = 4
const CURRENT_XP = 350
const XP_TO_NEXT = 500
const LEVELS = ["Principiante", "Aprendiz", "Colaborador", "Experto", "Maestro", "Leyenda"]

export default function AchievementsPage() {
  const { user } = useAuthStore()
  const { streak } = useEmployeeStore()
  const employee = MOCK_EMPLOYEES.find((e) => e.id === user?.id) ?? MOCK_EMPLOYEES[0]
  const earnedBadgeIds = new Set(employee.badges.map((b) => b.name.toLowerCase()))
  const currentStreak = employee.streakDays
  const longestStreak = Math.max(currentStreak + 7, 21)

  return (
    <div className="flex flex-col min-h-full">
      <MobileHeader title="Logros" showBack />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 px-4 py-4"
      >
        {/* Level card */}
        <motion.div
          variants={cardVariant}
          className="relative overflow-hidden rounded-2xl p-5"
          style={{ background: "linear-gradient(135deg, #0c365c 0%, #167fd0 100%)" }}
        >
          <div className="absolute top-0 right-0 h-36 w-36 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/70 text-xs font-medium">Nivel actual</p>
              <h2 className="text-white text-2xl font-bold">{LEVELS[CURRENT_LEVEL]}</h2>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
              <Trophy size={32} className="text-amber-300" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-xs">XP: {CURRENT_XP}</span>
            <span className="text-white/70 text-xs">Próximo: {XP_TO_NEXT} XP</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${(CURRENT_XP / XP_TO_NEXT) * 100}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-4">
            {LEVELS.slice(0, 6).map((level, i) => (
              <div
                key={level}
                className={cn(
                  "flex flex-col items-center",
                  i <= CURRENT_LEVEL ? "opacity-100" : "opacity-30"
                )}
              >
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    i < CURRENT_LEVEL ? "bg-amber-400" : i === CURRENT_LEVEL ? "bg-white" : "bg-white/30"
                  )}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Streaks */}
        <motion.div variants={cardVariant} className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 p-4 flex flex-col items-center text-center gap-1">
            <Flame size={24} className="text-white" />
            <p className="text-white text-2xl font-bold leading-none">{currentStreak}</p>
            <p className="text-white/80 text-xs font-medium">Racha actual</p>
            <p className="text-white/60 text-[10px]">días consecutivos</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-4 flex flex-col items-center text-center gap-1">
            <Trophy size={24} className="text-white" />
            <p className="text-white text-2xl font-bold leading-none">{longestStreak}</p>
            <p className="text-white/80 text-xs font-medium">Racha más larga</p>
            <p className="text-white/60 text-[10px]">días consecutivos</p>
          </div>
        </motion.div>

        {/* Badges grid */}
        <motion.div variants={cardVariant}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Insignias
            </h3>
            <span className="text-xs font-medium text-gray-500">
              {employee.badges.length}/{allBadges.length}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {allBadges.map((badge) => {
              const isEarned = employee.badges.some(
                (b) => b.name.toLowerCase() === badge.name.toLowerCase() ||
                  b.icon === badge.icon
              )
              return (
                <motion.div
                  key={badge.id}
                  whileTap={{ scale: 0.93 }}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl p-3 text-center border transition-all",
                    isEarned ? "bg-white border-gray-100 shadow-sm" : "bg-gray-50 border-gray-100"
                  )}
                >
                  <motion.div
                    initial={isEarned ? { scale: 0 } : {}}
                    animate={isEarned ? { scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl text-2xl",
                      isEarned ? "" : "grayscale opacity-30"
                    )}
                    style={isEarned ? { background: `${badge.color}15` } : { background: "#f3f4f6" }}
                  >
                    {badge.icon}
                  </motion.div>
                  <div>
                    <p className={cn("text-[10px] font-bold leading-tight", isEarned ? "text-gray-900" : "text-gray-400")}>
                      {badge.name}
                    </p>
                    {!isEarned && (
                      <p className="text-[9px] text-gray-300 mt-0.5">🔒 Bloqueado</p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div variants={cardVariant}>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Tabla de líderes
          </h3>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            {leaderboard.map((person, i) => (
              <div
                key={person.rank}
                className={cn(
                  "flex items-center gap-3 px-4 py-3",
                  i !== leaderboard.length - 1 && "border-b border-gray-50",
                  person.rank === 1 && "bg-amber-50/60"
                )}
              >
                <span className="text-xl flex-shrink-0 w-6 text-center">{person.badge}</span>
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="h-9 w-9 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{person.name.split(" ")[0]}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Flame size={10} className="text-orange-400" />
                    <p className="text-xs text-gray-500">{person.streak} días</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[#0c365c]">{person.score}</p>
                  <p className="text-[10px] text-gray-400">puntos</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent achievements */}
        <motion.div variants={cardVariant}>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Logros recientes
          </h3>
          <div className="flex flex-col gap-2.5">
            {[
              { emoji: "🔥", title: "Racha de 14 días", desc: "Respondiste pulsos 14 días seguidos", xp: 50, date: "Hoy" },
              { emoji: "🤝", title: "Insignia Colaborador", desc: "Ganaste la insignia Colaborador", xp: 100, date: "1 abr" },
              { emoji: "💡", title: "Primera idea enviada", desc: "Enviaste tu primera sugerencia", xp: 25, date: "15 mar" },
            ].map((achievement, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-3.5"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xl">
                  {achievement.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{achievement.title}</p>
                  <p className="text-xs text-gray-500 truncate">{achievement.desc}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-amber-600">+{achievement.xp} XP</p>
                  <p className="text-[10px] text-gray-400">{achievement.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="h-4" />
      </motion.div>
    </div>
  )
}
