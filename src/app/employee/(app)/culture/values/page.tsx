"use client"

import { motion } from "framer-motion"
import { MobileHeader } from "@/components/employee/mobile-header"
import { staggerContainer, cardVariant } from "@/lib/motion"

const values = [
  {
    emoji: "🌱",
    name: "Crecimiento",
    color: "#10b981",
    description:
      "Creemos en el desarrollo continuo de cada persona. Invertimos en aprendizaje, mentoring y oportunidades de carrera porque sabemos que cuando las personas crecen, la empresa crece.",
    behaviors: ["Busco aprender algo nuevo cada semana", "Comparto mi conocimiento con el equipo", "Celebro los logros de mis compañeros"],
  },
  {
    emoji: "🤝",
    name: "Confianza",
    color: "#0c365c",
    description:
      "Construimos relaciones basadas en la transparencia y la honestidad. La confianza es la base de todo trabajo colaborativo y es algo que cultivamos activamente cada día.",
    behaviors: ["Soy transparente en mis comunicaciones", "Cumplo mis compromisos", "Asumo responsabilidad por mis errores"],
  },
  {
    emoji: "💡",
    name: "Innovación",
    color: "#f59e0b",
    description:
      "Cuestionamos el status quo y buscamos constantemente formas mejores de hacer las cosas. La innovación no es un departamento, es una forma de pensar que todos compartimos.",
    behaviors: ["Propongo nuevas ideas sin miedo", "Experimento y aprendo del fracaso", "Cuestiono procesos que no agregan valor"],
  },
  {
    emoji: "❤️",
    name: "Bienestar",
    color: "#ec4899",
    description:
      "Ponemos el bienestar de las personas en el centro de todo lo que hacemos. Esto incluye salud física, mental y emocional, dentro y fuera del trabajo.",
    behaviors: ["Respeto mi tiempo de descanso", "Apoyo a quien lo necesita", "Hablo abiertamente de cómo me siento"],
  },
  {
    emoji: "🌍",
    name: "Impacto",
    color: "#6366f1",
    description:
      "Todo lo que hacemos está orientado a crear un impacto positivo y medible, tanto para nuestros clientes como para la sociedad. Queremos dejar el mundo un poco mejor.",
    behaviors: ["Mido el resultado de mi trabajo", "Pienso en el impacto a largo plazo", "Me importa el bienestar colectivo"],
  },
  {
    emoji: "🎯",
    name: "Excelencia",
    color: "#f97316",
    description:
      "No nos conformamos con lo suficientemente bueno. Aspiramos a la excelencia en todo lo que hacemos, con una actitud de mejora continua y orgullo por la calidad de nuestro trabajo.",
    behaviors: ["Doy lo mejor en cada entregable", "Busco retroalimentación activamente", "Me enorgullece la calidad de mi trabajo"],
  },
]

export default function ValuesPage() {
  return (
    <div className="flex flex-col min-h-full">
      <MobileHeader title="Nuestros Valores" showBack />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 px-4 py-4"
      >
        <motion.div
          variants={cardVariant}
          className="rounded-2xl bg-gradient-to-r from-[#0c365c] to-[#167fd0] p-4 text-center"
        >
          <p className="text-white/90 text-sm leading-relaxed">
            Nuestros valores no son palabras en una pared — son compromisos vivos que guían cada decisión que tomamos.
          </p>
        </motion.div>

        {values.map((value, i) => (
          <motion.div
            key={value.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                  className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-3xl"
                  style={{ background: `${value.color}15` }}
                >
                  {value.emoji}
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{value.name}</h3>
                  <div className="h-1 w-8 rounded-full mt-1" style={{ background: value.color }} />
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>

              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                  En la práctica
                </p>
                <div className="flex flex-col gap-2">
                  {value.behaviors.map((b, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <div
                        className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                        style={{ background: value.color }}
                      >
                        ✓
                      </div>
                      <p className="text-xs text-gray-600">{b}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="h-4" />
      </motion.div>
    </div>
  )
}
