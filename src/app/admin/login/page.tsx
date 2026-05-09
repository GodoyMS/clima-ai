"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Eye, EyeOff, CheckCircle, Zap, Shield, TrendingUp, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { loginAdmin } from "@/lib/fake-api"
import { useAuthStore } from "@/store/auth-store"
import { slideUp, staggerContainer } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { ClimaLogo } from "@/components/shared/clima-logo"

type LoginForm = {
  email: string
  password: string
}

const features = [
  { icon: Zap, text: "Insights de IA en tiempo real sobre el compromiso de tu equipo" },
  { icon: TrendingUp, text: "Analítica predictiva para anticipar rotación de talento" },
  { icon: Shield, text: "Pulsos anónimos que generan confianza y datos honestos" },
  { icon: CheckCircle, text: "Reconocimiento entre pares que transforma la cultura" },
]

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (data: LoginForm) => {
    if (!data.email) {
      setError("email", { message: "El correo es requerido" })
      return
    }
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      setError("email", { message: "Ingresa un correo válido" })
      return
    }
    if (!data.password) {
      setError("password", { message: "La contraseña es requerida" })
      return
    }
    try {
      const user = await loginAdmin(data.email, data.password)
      login(user)
      toast.success(`¡Bienvenida, ${user.name.split(" ")[0]}!`, {
        description: "Sesión iniciada correctamente.",
      })
      router.push("/admin/dashboard")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión. Intenta de nuevo."
      toast.error(message)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #0c365c 0%, #167fd0 50%, #1a5a9a 100%)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl  p-2.5">
            <ClimaLogo size="lg" priority className="max-w-[200px]" />
          </div>
        </div>

        {/* Center content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={slideUp} className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-white">
              Transforma el compromiso de tu equipo con IA
            </h1>
            <p className="text-lg text-blue-100/80 leading-relaxed">
              Detecta señales de riesgo, celebra logros y construye una cultura organizacional excepcional con datos en tiempo real.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="space-y-4">
            {features.map((f, i) => (
              <motion.div key={i} variants={slideUp} className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <f.icon className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-blue-100/90 leading-relaxed">{f.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20"
        >
          <p className="text-sm italic text-blue-100/90 leading-relaxed">
            &ldquo;CLIMA AI nos ayudó a reducir la rotación en un 40% en solo 6 meses. Ahora podemos anticipar y actuar antes de que sea tarde.&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-2">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia"
              alt="Patricia"
              className="h-8 w-8 rounded-full ring-2 ring-white/30"
            />
            <div>
              <p className="text-xs font-semibold text-white">Patricia Flores Ríos</p>
              <p className="text-xs text-blue-100/70">Directora de RRHH · CLIMA AI</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12"
      >
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center justify-center lg:hidden">
            <div className="rounded-xl ">
              <ClimaLogo size="md" className="max-w-[180px]" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
            <p className="text-sm text-gray-500">Ingresa tus credenciales de administrador para continuar.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="admin@climaai.pe"
                className={cn(
                  "w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all",
                  "focus:border-[#0c365c] focus:bg-white focus:ring-2 focus:ring-[#0c365c]/10",
                  errors.email ? "border-red-300 bg-red-50" : "border-gray-200"
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={cn(
                    "w-full rounded-xl border bg-gray-50 px-4 py-3 pr-11 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all",
                    "focus:border-[#0c365c] focus:bg-white focus:ring-2 focus:ring-[#0c365c]/10",
                    errors.password ? "border-red-300 bg-red-50" : "border-gray-200"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <a href="#" className="text-xs font-medium text-[#0c365c] hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl bg-[#0c365c] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all",
                "hover:bg-[#0c365c]/90 hover:shadow-md active:scale-[0.98]",
                "disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Credenciales de demo</p>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Email:</span>{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-[#0c365c]">admin@climaai.pe</code>
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Contraseña:</span>{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-[#0c365c]">cualquiera</code>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
