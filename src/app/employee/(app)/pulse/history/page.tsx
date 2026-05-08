"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Clock, BarChart2 } from "lucide-react"
import { MOCK_PULSES } from "@/lib/mock-data"
import { MobileHeader } from "@/components/employee/mobile-header"
import { staggerContainer, cardVariant } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const statusConfig = {
  completed: { label: "Completado", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  active: { label: "Activo", color: "bg-blue-100 text-blue-700", icon: BarChart2 },
  scheduled: { label: "Programado", color: "bg-purple-100 text-purple-700", icon: Clock },
  draft: { label: "Borrador", color: "bg-gray-100 text-gray-500", icon: Clock },
}

const typeLabels: Record<string, string> = {
  mood: "Estado de ánimo",
  engagement: "Compromiso",
  enps: "eNPS",
  custom: "Personalizado",
}

export default function PulseHistoryPage() {
  const pulses = MOCK_PULSES.filter((p) => p.status !== "draft").sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="flex flex-col min-h-full">
      <MobileHeader title="Historial de Pulsos" showBack />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3 px-4 py-4"
      >
        <motion.div variants={cardVariant} className="rounded-2xl bg-gradient-to-r from-[#0c365c] to-[#167fd0] p-4 flex items-center gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl">
            📊
          </div>
          <div>
            <p className="text-white/75 text-xs">Total de pulsos respondidos</p>
            <p className="text-white text-3xl font-bold">{pulses.filter((p) => p.status === "completed").length}</p>
          </div>
        </motion.div>

        {pulses.map((pulse) => {
          const config = statusConfig[pulse.status] ?? statusConfig.draft
          const StatusIcon = config.icon
          return (
            <motion.div
              key={pulse.id}
              variants={cardVariant}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#0c365c]/10">
                  <BarChart2 size={18} className="text-[#0c365c]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 leading-snug flex-1">{pulse.title}</h4>
                    <span className={cn("flex-shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold", config.color)}>
                      <StatusIcon size={10} />
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pulse.description}</p>
                  <div className="flex items-center gap-3 mt-2.5">
                    <span className="text-[10px] text-gray-400 bg-gray-50 rounded-full px-2 py-1 font-medium">
                      {typeLabels[pulse.type]}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {pulse.questions.length} preguntas
                    </span>
                  </div>
                  {pulse.status === "completed" && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-400">Participación</span>
                        <span className="text-[10px] font-semibold text-gray-700">{pulse.participationRate}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-green-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${pulse.participationRate}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[10px] text-gray-400">
                      {format(new Date(pulse.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                    </span>
                    {pulse.status === "completed" && (
                      <span className="text-[10px] font-medium text-green-600 flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        Respondido
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}

        <div className="h-4" />
      </motion.div>
    </div>
  )
}
