"use client"

import { motion } from "framer-motion"
import { MobileHeader } from "@/components/employee/mobile-header"
import { staggerContainer, slideUp } from "@/lib/motion"
import { ClimaLogo } from "@/components/shared/clima-logo"

const sections = [
  {
    emoji: "🎯",
    title: "Misión",
    color: "#0c365c",
    gradient: "from-[#0c365c] to-[#167fd0]",
    content:
      "Transformar la manera en que las organizaciones cuidan a su gente, utilizando inteligencia artificial y datos para crear ambientes laborales más humanos, saludables y productivos.",
  },
  {
    emoji: "🔭",
    title: "Visión",
    color: "#167fd0",
    gradient: "from-[#167fd0] to-[#10b981]",
    content:
      "Ser la plataforma líder en América Latina para el engagement y bienestar laboral, presente en cada empresa que crea que las personas son su mayor activo.",
  },
  {
    emoji: "💫",
    title: "Propósito",
    color: "#f59e0b",
    gradient: "from-[#f59e0b] to-[#f97316]",
    content:
      "Creemos que un colaborador que se siente escuchado, reconocido y cuidado da lo mejor de sí. Nuestro propósito es hacer de ese ideal una realidad cotidiana en cada empresa.",
  },
]

const principles = [
  { icon: "🫶", text: "Las personas primero, siempre" },
  { icon: "📊", text: "Decisiones basadas en datos con corazón humano" },
  { icon: "🔄", text: "Mejora continua como forma de vida" },
  { icon: "🌍", text: "Impacto positivo medible y real" },
  { icon: "🤝", text: "Alianza genuina con nuestros clientes" },
]

export default function MissionPage() {
  return (
    <div className="flex flex-col min-h-full">
      <MobileHeader title="Misión y Visión" showBack />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 px-4 py-4"
      >
        {/* Hero text reveal */}
        <motion.div
          variants={slideUp}
          className="text-center py-6"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="mb-4 flex justify-center"
          >
            <div className="rounded-2xl bg-zinc-950 p-3 shadow-lg ring-1 ring-black/5">
              <ClimaLogo size="lg" className="max-w-[200px]" />
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-2 max-w-[280px] text-sm leading-relaxed text-gray-500"
          >
            Donde la tecnología y la humanidad se encuentran para construir mejores lugares de trabajo
          </motion.p>
        </motion.div>

        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl overflow-hidden shadow-sm"
          >
            <div
              className={`bg-gradient-to-br ${section.gradient} p-5`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-2xl">
                  {section.emoji}
                </div>
                <h3 className="text-base font-bold text-white">{section.title}</h3>
              </div>
              <p className="text-white/85 text-sm leading-relaxed">
                {section.content}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5"
        >
          <h3 className="text-sm font-bold text-gray-900 mb-4">Principios que nos guían</h3>
          <div className="flex flex-col gap-3">
            {principles.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 text-lg">
                  {p.icon}
                </div>
                <p className="text-sm text-gray-700 font-medium">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="rounded-2xl bg-gradient-to-r from-[#0c365c] to-[#167fd0] p-5 text-center"
        >
          <p className="text-white/90 text-sm italic leading-relaxed">
            "Un colaborador que se siente escuchado y valorado no solo trabaja mejor — también vive mejor."
          </p>
          <p className="text-white/60 text-xs mt-3">— Roberto Jiménez Castro, CEO de CLIMA AI</p>
        </motion.div>

        <div className="h-4" />
      </motion.div>
    </div>
  )
}
