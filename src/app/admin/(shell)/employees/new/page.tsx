"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { ArrowLeft, UserPlus, Loader2, User, Briefcase, Settings2 } from "lucide-react"
import { toast } from "sonner"
import { useCreateEmployee } from "@/hooks/use-employees"
import { staggerContainer, slideUp, cardVariant } from "@/lib/motion"
import { MOCK_TEAMS, MOCK_EMPLOYEES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type FormData = {
  name: string
  email: string
  phone?: string
  location?: string
  department: string
  teamId: string
  role: string
  managerId?: string
  startDate: string
  status: "active" | "onboarding" | "inactive"
}

const departments = [
  "Ingeniería",
  "Marketing",
  "Ventas",
  "Recursos Humanos",
  "Producto",
  "Éxito del Cliente",
  "Dirección General",
  "Finanzas",
  "Operaciones",
]

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

const inputClass = (hasError?: boolean) =>
  cn(
    "w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all",
    "focus:border-[#0c365c] focus:bg-white focus:ring-2 focus:ring-[#0c365c]/10",
    hasError ? "border-red-300 bg-red-50" : "border-gray-200"
  )

export default function NewEmployeePage() {
  const router = useRouter()
  const { mutateAsync: createEmployee } = useCreateEmployee()

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      status: "onboarding",
      startDate: new Date().toISOString().split("T")[0],
    },
  })

  const selectedTeamId = watch("teamId")
  const selectedTeam = MOCK_TEAMS.find((t) => t.id === selectedTeamId)

  const onSubmit = async (data: FormData) => {
    let hasError = false
    if (!data.name || data.name.length < 2) {
      setError("name", { message: "El nombre debe tener al menos 2 caracteres" })
      hasError = true
    }
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      setError("email", { message: "Ingresa un correo válido" })
      hasError = true
    }
    if (!data.department) {
      setError("department", { message: "Selecciona un departamento" })
      hasError = true
    }
    if (!data.teamId) {
      setError("teamId", { message: "Selecciona un equipo" })
      hasError = true
    }
    if (!data.role || data.role.length < 2) {
      setError("role", { message: "El cargo debe tener al menos 2 caracteres" })
      hasError = true
    }
    if (!data.startDate) {
      setError("startDate", { message: "La fecha de inicio es requerida" })
      hasError = true
    }
    if (hasError) return
    try {
      const team = MOCK_TEAMS.find((t) => t.id === data.teamId)
      const manager = MOCK_EMPLOYEES.find((e) => e.id === data.managerId)
      await createEmployee({
        ...data,
        team: team?.name ?? "",
        manager: manager?.name ?? "",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      })
      toast.success("¡Empleado creado exitosamente!", {
        description: `${data.name} ha sido agregado a la plataforma.`,
      })
      router.push("/admin/employees")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear el empleado"
      toast.error(message)
    }
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      {/* Header */}
      <motion.div variants={slideUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#0c365c]"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Nuevo Empleado</h1>
            <p className="text-sm text-gray-500">Completa el formulario para agregar un colaborador</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal info */}
        <motion.div variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0c365c]/10">
              <User className="h-4 w-4 text-[#0c365c]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Información Personal</h2>
              <p className="text-xs text-gray-400">Datos básicos del colaborador</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Nombre completo" required error={errors.name?.message}>
              <input
                {...register("name")}
                placeholder="Ej. Ana García Martínez"
                className={inputClass(!!errors.name)}
              />
            </FormField>

            <FormField label="Correo electrónico" required error={errors.email?.message}>
              <input
                {...register("email")}
                type="email"
                placeholder="ana.garcia@climaai.pe"
                className={inputClass(!!errors.email)}
              />
            </FormField>

            <FormField label="Teléfono" error={errors.phone?.message}>
              <input
                {...register("phone")}
                type="tel"
                placeholder="+51 1 234-5678"
                className={inputClass(!!errors.phone)}
              />
            </FormField>

            <FormField label="Ubicación" error={errors.location?.message}>
              <input
                {...register("location")}
                placeholder="Lima"
                className={inputClass(!!errors.location)}
              />
            </FormField>
          </div>
        </motion.div>

        {/* Work info */}
        <motion.div variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#167fd0]/10">
              <Briefcase className="h-4 w-4 text-[#167fd0]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Información Laboral</h2>
              <p className="text-xs text-gray-400">Posición, departamento y equipo</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Cargo" required error={errors.role?.message}>
              <input
                {...register("role")}
                placeholder="Ej. Desarrollador Senior"
                className={inputClass(!!errors.role)}
              />
            </FormField>

            <FormField label="Departamento" required error={errors.department?.message}>
              <select {...register("department")} className={inputClass(!!errors.department)}>
                <option value="">Seleccionar departamento</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Equipo" required error={errors.teamId?.message}>
              <select {...register("teamId")} className={inputClass(!!errors.teamId)}>
                <option value="">Seleccionar equipo</option>
                {MOCK_TEAMS.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              {selectedTeam && (
                <p className="text-xs text-gray-400">
                  Manager: {selectedTeam.managerName}
                </p>
              )}
            </FormField>

            <FormField label="Manager directo" error={errors.managerId?.message}>
              <select {...register("managerId")} className={inputClass(!!errors.managerId)}>
                <option value="">Seleccionar manager</option>
                {MOCK_EMPLOYEES.filter((e) => e.role.toLowerCase().includes("director") || e.role.toLowerCase().includes("gerente") || e.role.toLowerCase().includes("vp") || e.role.toLowerCase().includes("ceo") || e.role.toLowerCase().includes("manager")).map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Fecha de inicio" required error={errors.startDate?.message}>
              <input
                {...register("startDate")}
                type="date"
                className={inputClass(!!errors.startDate)}
              />
            </FormField>
          </div>
        </motion.div>

        {/* Config */}
        <motion.div variants={cardVariant} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100">
              <Settings2 className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Configuración</h2>
              <p className="text-xs text-gray-400">Estado y accesos en la plataforma</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Estado" required error={errors.status?.message}>
              <select {...register("status")} className={inputClass(!!errors.status)}>
                <option value="onboarding">Onboarding</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </FormField>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div variants={slideUp} className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "flex items-center gap-2 rounded-xl bg-[#0c365c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all",
              "hover:bg-[#0c365c]/90 hover:shadow-md active:scale-[0.98]",
              "disabled:cursor-not-allowed disabled:opacity-60"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Crear Empleado
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  )
}
