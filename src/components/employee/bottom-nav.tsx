"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Activity, Heart, Leaf, User } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data"

const tabs = [
  { href: "/employee/home", label: "Inicio", icon: Home },
  { href: "/employee/pulse", label: "Pulso", icon: Activity },
  { href: "/employee/recognition", label: "Reconocer", icon: Heart },
  { href: "/employee/culture", label: "Cultura", icon: Leaf },
  { href: "/employee/profile", label: "Perfil", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-pb">
      <div className="max-w-[430px] mx-auto flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/")
          const Icon = tab.icon
          const isPulse = tab.href === "/employee/pulse"

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center min-w-0"
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-2 px-3 rounded-2xl transition-colors min-h-[44px] justify-center",
                  isActive ? "text-[#0c365c]" : "text-gray-400"
                )}
              >
                <div className="relative">
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={cn(
                      "transition-all duration-200",
                      isActive ? "text-[#0c365c]" : "text-gray-400"
                    )}
                  />
                  {isPulse && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium transition-all duration-200 leading-none",
                    isActive ? "text-[#0c365c]" : "text-gray-400"
                  )}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-[#0c365c]/8 rounded-2xl"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
