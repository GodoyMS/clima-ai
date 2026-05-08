"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { loginEmployee } from "@/lib/fake-api"
import { useAuthStore } from "@/store/auth-store"
import { slideUp, staggerContainer } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { ClimaLogo } from "@/components/shared/clima-logo"

export default function EmployeeLoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError("Por favor ingresa tu correo electrónico.")
      return
    }
    setError("")
    setIsLoading(true)
    try {
      const user = await loginEmployee(email, password)
      login(user)
      router.push("/employee/home")
    } catch {
      setError("Ocurrió un error. Por favor intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Top gradient section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center justify-center px-6 pt-16 pb-12"
        style={{ background: "linear-gradient(135deg, #0c365c 0%, #167fd0 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" />

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          className="relative mb-5"
        >
          <div className="flex items-center justify-center rounded-3xl bg-zinc-950 p-4 shadow-xl shadow-black/25 ring-1 ring-white/10">
            <ClimaLogo size="xl" priority className="max-w-[220px]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-center"
        >
          <p className="mt-1 text-sm text-white/80 leading-relaxed max-w-[280px]">
            Tu voz importa. Tu bienestar también.
          </p>
        </motion.div>
      </motion.div>

      {/* Bottom white card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 bg-white rounded-t-3xl -mt-6 px-6 pt-8 pb-10 shadow-[0_-8px_40px_rgba(0,0,0,0.08)]"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-5"
        >
          <motion.div variants={slideUp}>
            <h2 className="text-xl font-semibold text-gray-900">Bienvenido/a de vuelta</h2>
            <p className="text-sm text-gray-500 mt-1">Inicia sesión para continuar</p>
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
                autoComplete="email"
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#0c365c] focus:bg-white focus:ring-2 focus:ring-[#0c365c]/15"
              />
            </motion.div>

            <motion.div variants={slideUp} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pr-12 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#0c365c] focus:bg-white focus:ring-2 focus:ring-[#0c365c]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="rounded-xl bg-red-50 border border-red-100 px-4 py-3"
                >
                  <p className="text-sm text-red-600">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={slideUp}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                type="submit"
                disabled={isLoading}
                className={cn(
                  "flex h-13 w-full items-center justify-center rounded-xl text-base font-semibold text-white transition-all",
                  "bg-[#0c365c] hover:bg-[#0a2e4e] active:bg-[#091f38]",
                  "shadow-lg shadow-[#0c365c]/30",
                  isLoading && "opacity-80"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </motion.button>
            </motion.div>

            <motion.div variants={slideUp} className="text-center">
              <button
                type="button"
                onClick={() => router.push("/employee/forgot-password")}
                className="text-sm font-medium text-[#0c365c] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </motion.div>
          </form>

          <motion.div
            variants={slideUp}
            className="rounded-xl border border-dashed border-blue-200 bg-blue-50 px-4 py-3"
          >
            <p className="text-xs text-blue-700 font-medium text-center">
              💡 Demo: ingresa cualquier correo y contraseña para acceder
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
