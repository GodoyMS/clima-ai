"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Pin, Calendar, Users, Eye, Edit2, Megaphone,
  Search, Filter, CheckCircle2, Clock, FileText, Star, Zap, RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { staggerContainer, cardVariant, slideUp } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { MOCK_ANNOUNCEMENTS } from "@/lib/mock-data"
import type { Announcement } from "@/lib/types"
import { toast } from "sonner"

const CATEGORY_CONFIG = {
  general: { label: "General", color: "bg-gray-100 text-gray-700", icon: <FileText className="h-3.5 w-3.5" /> },
  policy: { label: "Política", color: "bg-blue-100 text-blue-700", icon: <FileText className="h-3.5 w-3.5" /> },
  event: { label: "Evento", color: "bg-purple-100 text-purple-700", icon: <Calendar className="h-3.5 w-3.5" /> },
  achievement: { label: "Logro", color: "bg-amber-100 text-amber-700", icon: <Star className="h-3.5 w-3.5" /> },
  update: { label: "Actualización", color: "bg-teal-100 text-teal-700", icon: <RefreshCw className="h-3.5 w-3.5" /> },
}

const STATUS_CONFIG = {
  published: { label: "Publicado", dot: "bg-emerald-500" },
  draft: { label: "Borrador", dot: "bg-yellow-500" },
  scheduled: { label: "Programado", dot: "bg-blue-500" },
}

const CATEGORIES = ["Todos", "general", "policy", "event", "achievement", "update"] as const
type CategoryFilter = (typeof CATEGORIES)[number]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function AnnouncementsPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("Todos")
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newCategory, setNewCategory] = useState<Announcement["category"]>("general")
  const [newAudience, setNewAudience] = useState<Announcement["targetAudience"]>("all")
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS)

  const pinned = announcements.filter((a) => a.pinned && a.status === "published")
  const regular = announcements.filter((a) => {
    const matchesCat = categoryFilter === "Todos" || a.category === categoryFilter
    const matchesSearch =
      search === "" ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase())
    return !a.pinned && matchesCat && matchesSearch
  })

  function handleCreate() {
    if (!newTitle.trim()) { toast.error("El título es requerido."); return }
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: newTitle,
      content: newContent,
      authorId: "emp-008",
      authorName: "Patricia Flores Ríos",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia",
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      status: "published",
      targetAudience: newAudience,
      readCount: 0,
      totalEmployees: 20,
      pinned: false,
      category: newCategory,
    }
    setAnnouncements((prev) => [newAnn, ...prev])
    setCreateOpen(false)
    setNewTitle("")
    setNewContent("")
    toast.success("Anuncio publicado exitosamente.")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Megaphone className="h-6 w-6 text-[#0c365c]" />
              Anuncios
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Mantén a tu equipo informado con comunicados importantes.
            </p>
          </div>
          <Button
            className="gap-2 bg-[#0c365c] hover:bg-[#0a2d4e] text-white rounded-xl"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Crear Anuncio
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 rounded-xl border-gray-200 bg-white"
              placeholder="Buscar anuncios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Category filters */}
        <div className="mb-5 flex gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => {
            const cfg = cat === "Todos" ? null : CATEGORY_CONFIG[cat]
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                  categoryFilter === cat
                    ? "border-[#0c365c] bg-[#0c365c] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                )}
              >
                {cfg?.icon}
                {cfg ? cfg.label : "Todos"}
              </button>
            )
          })}
        </div>

        {/* Pinned */}
        {pinned.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Pin className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-gray-700">Fijados</h2>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {pinned.map((ann) => (
                <AnnouncementCard key={ann.id} ann={ann} pinned />
              ))}
            </motion.div>
          </div>
        )}

        {/* Regular */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <AnimatePresence>
            {regular.map((ann) => (
              <AnnouncementCard key={ann.id} ann={ann} />
            ))}
          </AnimatePresence>
        </motion.div>

        {regular.length === 0 && pinned.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
            <Megaphone className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="text-base font-semibold text-gray-500">Sin anuncios</h3>
            <p className="mt-1 text-sm text-gray-400">Crea tu primer anuncio para informar a tu equipo.</p>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle>Crear nuevo anuncio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-sm font-medium text-gray-700">Título *</Label>
              <Input
                className="mt-1.5 rounded-xl border-gray-200"
                placeholder="Título del anuncio..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Contenido</Label>
              <Textarea
                className="mt-1.5 rounded-xl border-gray-200 resize-none"
                rows={4}
                placeholder="Escribe el contenido del anuncio..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Categoría</Label>
                <select
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Announcement["category"])}
                >
                  {Object.entries(CATEGORY_CONFIG).map(([val, cfg]) => (
                    <option key={val} value={val}>{cfg.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Audiencia</Label>
                <select
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value as Announcement["targetAudience"])}
                >
                  <option value="all">Toda la empresa</option>
                  <option value="team">Por equipo</option>
                  <option value="department">Por departamento</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setCreateOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-[#0c365c] text-white rounded-xl"
                onClick={handleCreate}
              >
                Publicar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AnnouncementCard({ ann, pinned = false }: { ann: Announcement; pinned?: boolean }) {
  const cfg = CATEGORY_CONFIG[ann.category]
  const statusCfg = STATUS_CONFIG[ann.status]
  const readRate = ann.totalEmployees > 0 ? Math.round((ann.readCount / ann.totalEmployees) * 100) : 0

  return (
    <motion.div
      variants={cardVariant}
      layout
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
        pinned ? "border-amber-200 bg-amber-50/30" : "border-gray-100"
      )}
    >
      <div className="flex items-start gap-3">
        <img
          src={ann.authorAvatar}
          alt={ann.authorName}
          className="h-9 w-9 rounded-full bg-gray-100 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="mb-1.5 flex items-center gap-2 flex-wrap">
            {pinned && (
              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                <Pin className="h-3 w-3" />
                Fijado
              </span>
            )}
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", cfg.color)}>
              {cfg.icon}
              {cfg.label}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <span className={cn("h-1.5 w-1.5 rounded-full", statusCfg.dot)} />
              {statusCfg.label}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">{ann.title}</h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2 leading-relaxed">{ann.content}</p>

          <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {ann.authorName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(ann.publishedAt).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
            </span>
          </div>

          {ann.status === "published" && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-gray-500">
                  <Eye className="h-3.5 w-3.5" />
                  Tasa de lectura
                </span>
                <span className="font-semibold text-gray-700">{ann.readCount}/{ann.totalEmployees} ({readRate}%)</span>
              </div>
              <Progress value={readRate} className="h-1.5 bg-gray-100" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
