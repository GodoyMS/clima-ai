"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data"
import { MobileHeader } from "@/components/employee/mobile-header"
import { staggerContainer, cardVariant } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { formatDistanceToNow, isToday, isYesterday, isThisWeek } from "date-fns"
import { es } from "date-fns/locale"
import type { Notification } from "@/lib/types"

const typeColors: Record<string, string> = {
  recognition: "bg-amber-100 text-amber-600",
  pulse: "bg-blue-100 text-blue-600",
  announcement: "bg-purple-100 text-purple-600",
  achievement: "bg-green-100 text-green-600",
  alert: "bg-red-100 text-red-600",
}

function groupNotifications(notifications: Notification[]) {
  const groups: Record<string, Notification[]> = {
    Hoy: [],
    Ayer: [],
    "Esta semana": [],
    Anteriores: [],
  }

  for (const notif of notifications) {
    const date = new Date(notif.createdAt)
    if (isToday(date)) {
      groups["Hoy"].push(notif)
    } else if (isYesterday(date)) {
      groups["Ayer"].push(notif)
    } else if (isThisWeek(date)) {
      groups["Esta semana"].push(notif)
    } else {
      groups["Anteriores"].push(notif)
    }
  }

  return groups
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  function dismiss(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const groups = groupNotifications(notifications)

  return (
    <div className="flex flex-col min-h-full">
      <MobileHeader
        title="Notificaciones"
        showBack
        rightAction={
          unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              className="text-xs font-medium text-[#0c365c] whitespace-nowrap"
            >
              Leer todo
            </button>
          ) : undefined
        }
      />

      {unreadCount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mx-4 mt-3 mb-1 rounded-xl bg-[#0c365c]/8 border border-[#0c365c]/15 px-4 py-2.5 flex items-center justify-between"
        >
          <p className="text-xs font-medium text-[#0c365c]">
            {unreadCount} notificaciones sin leer
          </p>
          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-[#0c365c] underline"
          >
            Marcar todo como leído
          </button>
        </motion.div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-1 px-4 py-3"
      >
        {notifications.length === 0 ? (
          <motion.div
            variants={cardVariant}
            className="flex flex-col items-center justify-center py-20 text-center gap-4"
          >
            <div className="text-6xl">🔔</div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Sin notificaciones</h3>
              <p className="text-sm text-gray-500 mt-1">Estás completamente al día</p>
            </div>
          </motion.div>
        ) : (
          Object.entries(groups).map(([group, notifs]) => {
            if (notifs.length === 0) return null
            return (
              <div key={group} className="mb-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-1 py-2">
                  {group}
                </p>
                <div className="flex flex-col gap-1.5">
                  <AnimatePresence>
                    {notifs.map((notif) => (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          "relative flex gap-3 rounded-2xl p-3.5 transition-colors",
                          !notif.isRead ? "bg-white border border-[#0c365c]/15 shadow-sm" : "bg-white border border-gray-100"
                        )}
                        onClick={() => markRead(notif.id)}
                      >
                        {/* Unread dot */}
                        {!notif.isRead && (
                          <div className="absolute top-3.5 left-2 h-2 w-2 rounded-full bg-[#0c365c]" />
                        )}
                        <div
                          className={cn(
                            "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-lg",
                            typeColors[notif.type] ?? "bg-gray-100 text-gray-600"
                          )}
                        >
                          {notif.icon}
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <p
                            className={cn(
                              "text-sm leading-tight",
                              !notif.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"
                            )}
                          >
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1.5">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: es })}
                          </p>
                        </div>
                        {/* Dismiss button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            dismiss(notif.id)
                          }}
                          className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <X size={12} className="text-gray-500" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )
          })
        )}
        <div className="h-4" />
      </motion.div>
    </div>
  )
}
