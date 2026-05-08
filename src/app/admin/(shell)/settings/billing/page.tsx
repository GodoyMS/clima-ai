"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Building2, Shield, CreditCard, Plug, Check, Download,
  Zap, Users, Database, ChevronRight, Crown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { slideUp, staggerContainer, cardVariant } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const SIDEBAR_ITEMS = [
  { href: "/admin/settings/general", label: "General", icon: <Building2 className="h-4 w-4" />, active: false },
  { href: "/admin/settings/security", label: "Seguridad", icon: <Shield className="h-4 w-4" />, active: false },
  { href: "/admin/settings/billing", label: "Facturación", icon: <CreditCard className="h-4 w-4" />, active: true },
  { href: "/admin/settings/integrations", label: "Integraciones", icon: <Plug className="h-4 w-4" />, active: false },
]

const INVOICES = [
  { date: "01 Abr 2026", amount: "$4,788", status: "paid", number: "INV-2026-04" },
  { date: "01 Mar 2026", amount: "$4,788", status: "paid", number: "INV-2026-03" },
  { date: "01 Feb 2026", amount: "$4,788", status: "paid", number: "INV-2026-02" },
  { date: "01 Ene 2026", amount: "$4,788", status: "paid", number: "INV-2026-01" },
  { date: "01 Dic 2025", amount: "$4,788", status: "paid", number: "INV-2025-12" },
]

const PLANS = [
  {
    name: "Starter",
    price: "$1,299",
    period: "/mes",
    employees: "Hasta 25",
    current: false,
    features: ["Pulsos básicos", "Dashboard de engagement", "1 integración", "Soporte por email"],
    color: "#9ca3af",
  },
  {
    name: "Professional",
    price: "$4,788",
    period: "/mes",
    employees: "Hasta 100",
    current: true,
    features: ["Pulsos ilimitados", "IA insights", "Todas las integraciones", "Soporte prioritario", "Retención de datos 2 años"],
    color: "#0c365c",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    employees: "Ilimitados",
    current: false,
    features: ["Todo lo de Professional", "SLA garantizado", "Manager de cuenta dedicado", "Implementación personalizada", "API avanzada"],
    color: "#f59e0b",
  },
]

export default function BillingPage() {
  const usageEmployees = 20
  const usageEmployeesMax = 100
  const usagePulses = 8
  const usagePulsesMax = 999
  const usageStorage = 3.2
  const usageStorageMax = 50

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona las preferencias de tu organización.</p>
        </motion.div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="w-48 shrink-0">
            <nav className="space-y-1">
              {SIDEBAR_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all", item.active ? "bg-[#0c365c] text-white" : "text-gray-600 hover:bg-gray-100")}>
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          <div className="flex-1 space-y-5">
            {/* Current plan */}
            <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-[#0c365c]/20 bg-linear-to-br from-[#0c365c]/5 to-[#167fd0]/5 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="h-5 w-5 text-amber-500" />
                    <h2 className="text-base font-semibold text-gray-900">Plan Professional</h2>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Activo</span>
                  </div>
                  <p className="text-3xl font-black text-[#0c365c]">$4,788<span className="text-base font-normal text-gray-500">/mes</span></p>
                  <p className="text-sm text-gray-600 mt-1">Próxima factura: 1 de Junio 2026</p>
                </div>
                <Button variant="outline" className="rounded-xl text-sm" onClick={() => toast.info("Contacta a ventas para cambiar de plan.")}>
                  Cambiar plan
                </Button>
              </div>
            </motion.div>

            {/* Usage stats */}
            <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-gray-900">Uso del plan</h2>
              <div className="space-y-4">
                {[
                  { label: "Empleados activos", used: usageEmployees, max: usageEmployeesMax, unit: "empleados", icon: <Users className="h-4 w-4" /> },
                  { label: "Pulsos creados", used: usagePulses, max: usagePulsesMax, unit: "pulsos", icon: <Zap className="h-4 w-4" /> },
                  { label: "Almacenamiento", used: usageStorage, max: usageStorageMax, unit: "GB", icon: <Database className="h-4 w-4" /> },
                ].map((usage) => (
                  <div key={usage.label}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        {usage.icon}
                        {usage.label}
                      </span>
                      <span className="text-gray-500">
                        {usage.used} / {usage.max === 999 ? "Ilimitado" : usage.max} {usage.unit}
                      </span>
                    </div>
                    <Progress value={usage.max === 999 ? 1 : (usage.used / usage.max) * 100} className="h-2 bg-gray-100" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Payment method */}
            <motion.div variants={slideUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#0c365c]" />
                Método de pago
              </h2>
              <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-[#0c365c] text-white font-bold text-xs">
                    VISA
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">•••• •••• •••• 4242</p>
                    <p className="text-xs text-gray-500">Vence 09/2028 · Patricia Flores Ríos</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="rounded-xl text-xs" onClick={() => toast.info("Funcionalidad en desarrollo.")}>
                  Actualizar
                </Button>
              </div>
            </motion.div>

            {/* Invoice history */}
            <motion.div variants={slideUp} initial="hidden" animate="visible" className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Historial de facturas</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Número</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Fecha</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Monto</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Estado</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">Descargar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {INVOICES.map((inv) => (
                    <tr key={inv.number} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 text-xs font-mono text-gray-600">{inv.number}</td>
                      <td className="px-5 py-3 text-xs text-gray-600">{inv.date}</td>
                      <td className="px-5 py-3 text-xs font-semibold text-gray-900">{inv.amount} MXN</td>
                      <td className="px-5 py-3">
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Pagada</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button variant="ghost" size="sm" className="rounded-lg text-xs gap-1" onClick={() => toast.success(`Descargando ${inv.number}...`)}>
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Plan comparison / upgrade CTA */}
            <motion.div variants={slideUp} initial="hidden" animate="visible">
              <div className="mb-4 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 flex items-center gap-3">
                <Crown className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800">¿Listo para escalar?</p>
                  <p className="text-xs text-amber-700">El plan Enterprise incluye API avanzada, SLA garantizado y manager de cuenta dedicado.</p>
                </div>
                <Button size="sm" className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white rounded-xl" onClick={() => toast.info("El equipo de ventas te contactará pronto.")}>
                  Hablar con ventas
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {PLANS.map((plan) => (
                  <div key={plan.name} className={cn("rounded-2xl border p-4", plan.current ? "border-[#0c365c] bg-[#0c365c]/5" : "border-gray-100 bg-white")}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                      {plan.current && <span className="text-xs rounded-full bg-[#0c365c] text-white px-2 py-0.5">Actual</span>}
                    </div>
                    <p className="text-xl font-black text-gray-900 mb-1">{plan.price}<span className="text-xs font-normal text-gray-400">{plan.period}</span></p>
                    <p className="text-xs text-gray-500 mb-3">{plan.employees} empleados</p>
                    <ul className="space-y-1.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: plan.color }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
