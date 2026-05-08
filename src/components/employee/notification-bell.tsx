"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

const typeColors: Record<string, string> = {
  recognition: "bg-amber-100 text-amber-600",
  pulse: "bg-blue-100 text-blue-600",
  announcement: "bg-purple-100 text-purple-600",
  achievement: "bg-green-100 text-green-600",
  alert: "bg-red-100 text-red-600",
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const unreadCount = notifications.filter((n) => !n.isRead).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.88 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onClick={() => setOpen(true)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700"
      >
        <Bell size={18} strokeWidth={2} />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full max-w-sm p-0 flex flex-col">
          <SheetHeader className="px-4 pt-5 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base font-semibold text-gray-900">
                Notificaciones
              </SheetTitle>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-medium text-[#0c365c] hover:underline"
                >
                  Marcar todo como leído
                </button>
              )}
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="text-4xl mb-3">🔔</div>
                <p className="text-sm font-medium text-gray-600">Sin notificaciones</p>
                <p className="text-xs text-gray-400 mt-1">Estás al día con todo</p>
              </div>
            ) : (
              notifications.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className={cn(
                    "flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors",
                    !notif.isRead && "bg-blue-50/50"
                  )}
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((n) =>
                        n.id === notif.id ? { ...n, isRead: true } : n
                      )
                    )
                  }}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg",
                      typeColors[notif.type] ?? "bg-gray-100 text-gray-600"
                    )}
                  >
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm leading-tight",
                          notif.isRead
                            ? "font-normal text-gray-700"
                            : "font-semibold text-gray-900"
                        )}
                      >
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <div className="flex-shrink-0 h-2 w-2 rounded-full bg-[#0c365c] mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
