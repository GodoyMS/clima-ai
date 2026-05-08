"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, CheckCircle2 } from "lucide-react"
import { slideUp, staggerContainer } from "@/lib/motion"
import { delay } from "@/lib/fake-api"
import { ClimaLogo } from "@/components/shared/clima-logo"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError("Por favor ingresa tu correo electrónico.")
      return
    }
    setError("")
    setIsLoading(true)
    await delay(1200)
    setIsLoading(false)
    setIsSuccess(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div
        className="relative flex flex-col items-center justify-center px-6 pt-16 pb-10"
        style={{ background: "linear-gradient(135deg, #0c365c 0%, #167fd0 100%)" }}
      >
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mb-4 flex justify-center"
        >
          <div className="rounded-2xl bg-zinc-950 p-2.5 shadow-lg ring-1 ring-white/10">
            <ClimaLogo size="sm" className="max-w-[140px]" />
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-2xl font-bold text-white text-center"
        >
          Recuperar contraseña
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-2 text-sm text-white/75 text-center max-w-[260px]"
        >
          Te enviaremos un enlace para restablecer tu contraseña
        </motion.p>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 bg-white rounded-t-3xl -mt-6 px-6 pt-8 pb-10 shadow-[0_-8px_40px_rgba(0,0,0,0.06)]"
      >
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="flex flex-col items-center text-center gap-4 py-8"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">¡Correo enviado!</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-[280px]">
                  Revisa tu bandeja de entrada en{" "}
                  <span className="font-medium text-gray-700">{email}</span> para
                  continuar con el proceso.
                </p>
              </div>
              <button
                onClick={() => router.back()}
                className="mt-4 h-12 w-full rounded-xl bg-[#0c365c] text-sm font-semibold text-white hover:bg-[#0a2e4e] transition-colors"
              >
                Volver al inicio de sesión
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-5"
            >
              <motion.div variants={slideUp}>
                <h2 className="text-lg font-semibold text-gray-900">
                  Ingresa tu correo
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Solo necesitamos saber a dónde enviar el enlace
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <motion.div variants={slideUp} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@empresa.com"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#0c365c] focus:bg-white focus:ring-2 focus:ring-[#0c365c]/15"
                  />
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-xl bg-red-50 border border-red-100 px-4 py-3"
                    >
                      <p className="text-sm text-red-600">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  variants={slideUp}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isLoading}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-[#0c365c] text-sm font-semibold text-white shadow-lg shadow-[#0c365c]/30 hover:bg-[#0a2e4e] transition-colors disabled:opacity-80"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    "Enviar enlace de recuperación"
                  )}
                </motion.button>

                <motion.div variants={slideUp} className="text-center">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ← Volver al inicio de sesión
                  </button>
                </motion.div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
