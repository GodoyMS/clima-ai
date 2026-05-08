"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Settings, Flame, BarChart2, Heart, Award, ChevronRight, LogOut } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useEmployeeStore } from "@/store/employee-store"
import { MOCK_EMPLOYEES, MOCK_RECOGNITIONS } from "@/lib/mock-data"
import { staggerContainer, cardVariant } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

const engagementHistory = [40, 55, 62, 70, 65, 75, 80, 78, 82, 85, 82, 88]
const months = ["Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May"]

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { streak } = useEmployeeStore()

  const employee = MOCK_EMPLOYEES.find((e) => e.id === user?.id) ?? MOCK_EMPLOYEES[0]
  const receivedRec = MOCK_RECOGNITIONS.filter((r) => r.toId === employee.id).slice(0, 3)
  const sentRec = MOCK_RECOGNITIONS.filter((r) => r.fromId === employee.id)

  const stats = [
    { label: "Racha", value: employee.streakDays, icon: Flame, color: "#f97316" },
    { label: "Pulsos", value: 12, icon: BarChart2, color: "#167fd0" },
    { label: "Dados", value: sentRec.length, icon: Heart, color: "#ec4899" },
    { label: "Recibidos", value: receivedRec.length, icon: Award, color: "#f59e0b" },
  ]

  const maxVal = Math.max(...engagementHistory)

  function handleLogout() {
    logout()
    router.push("/employee/login")
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-900">Mi Perfil</h1>
        <button
          onClick={() => router.push("/employee/profile/settings")}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
        >
          <Settings size={16} className="text-gray-600" />
        </button>
      </header>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 px-4 py-4"
      >
        {/* Profile header */}
        <motion.div
          variants={cardVariant}
          className="relative overflow-hidden rounded-2xl"
          style={{ background: "linear-gradient(135deg, #0c365c 0%, #167fd0 100%)" }}
        >
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
          <div className="p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="h-18 w-18 rounded-2xl bg-white/20 border-2 border-white/30"
                  style={{ height: 72, width: 72 }}
                />
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-400 border-2 border-white">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-bold text-base leading-tight truncate">{employee.name}</h2>
                <p className="text-white/70 text-xs mt-0.5 truncate">{employee.role}</p>
                <p className="text-white/50 text-xs truncate">{employee.department}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Flame size={12} className="text-orange-300" />
                  <span className="text-white/80 text-xs font-semibold">{employee.streakDays} días de racha</span>
                </div>
              </div>
            </div>
            {/* Engagement score */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/70 text-xs">Nivel de compromiso</span>
                <span className="text-white font-bold text-sm">{employee.engagementScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${employee.engagementScore}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={cardVariant} className="grid grid-cols-4 gap-2">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white border border-gray-100 p-3 text-center shadow-sm">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl"
                  style={{ background: `${stat.color}15` }}
                >
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <p className="text-lg font-bold text-gray-900 leading-none">{stat.value}</p>
                <p className="text-[10px] text-gray-500 leading-tight">{stat.label}</p>
              </div>
            )
          })}
        </motion.div>

        {/* Engagement history chart */}
        <motion.div variants={cardVariant} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Historial de engagement</h3>
          <div className="flex items-end gap-1.5 h-20">
            {engagementHistory.map((val, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  className="w-full rounded-t-sm"
                  style={{ background: i === engagementHistory.length - 1 ? "#0c365c" : "#0c365c40" }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / maxVal) * 64}px` }}
                  transition={{ duration: 0.6, delay: i * 0.04, ease: "easeOut" }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {months.filter((_, i) => i % 3 === 0).map((m) => (
              <span key={m} className="text-[9px] text-gray-400">{m}</span>
            ))}
            <span className="text-[9px] text-gray-400">May</span>
          </div>
        </motion.div>

        {/* Badges */}
        {employee.badges.length > 0 && (
          <motion.div variants={cardVariant}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Mis insignias
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {employee.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-3.5 shadow-sm"
                >
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{ background: `${badge.color}15` }}
                  >
                    {badge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{badge.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {formatDistanceToNow(new Date(badge.earnedAt), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent recognitions received */}
        {receivedRec.length > 0 && (
          <motion.div variants={cardVariant}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Reconocimientos recibidos
            </h3>
            <div className="flex flex-col gap-3">
              {receivedRec.map((rec) => (
                <div key={rec.id} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <img src={rec.fromAvatar} alt={rec.fromName} className="h-9 w-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-gray-900">{rec.fromName.split(" ")[0]}</span>
                        <span className="text-base">{rec.badgeIcon}</span>
                        <span
                          className="text-[10px] font-semibold rounded-full px-2 py-0.5"
                          style={{ background: `${rec.badgeColor}15`, color: rec.badgeColor }}
                        >
                          {rec.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{rec.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(rec.createdAt), { addSuffix: true, locale: es })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Settings link */}
        <motion.div variants={cardVariant} className="flex flex-col gap-2">
          <button
            onClick={() => router.push("/employee/profile/settings")}
            className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-4 text-left"
          >
            <Settings size={18} className="text-gray-500" />
            <span className="flex-1 text-sm font-medium text-gray-700">Configuración</span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 p-4 text-left"
          >
            <LogOut size={18} className="text-red-500" />
            <span className="flex-1 text-sm font-medium text-red-600">Cerrar sesión</span>
          </button>
        </motion.div>

        <div className="h-4" />
      </motion.div>
    </div>
  )
}
