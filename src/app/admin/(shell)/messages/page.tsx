"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Send, Search, Bot, MessageCircle, Clock, AlertCircle, User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { slideUp, staggerContainer, listItem } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { MOCK_MESSAGES, MOCK_EMPLOYEES } from "@/lib/mock-data"
import type { Message } from "@/lib/types"

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

const MOCK_THREAD: { sender: string; text: string; time: string; mine: boolean }[] = [
  { sender: "Laura Sánchez Rivera", text: "Hola Carlos, ¿tienes un momento para revisar el PR de autenticación esta tarde? Quiero asegurarme de que esté listo para el release del viernes.", time: "14:30", mine: false },
  { sender: "Tú", text: "¡Hola Laura! Claro, puedo revisarlo después de las 4pm. ¿Te funciona ese horario?", time: "14:45", mine: true },
  { sender: "Laura Sánchez Rivera", text: "Perfecto, a las 4pm está bien. Te agendo una reunión rápida de 30 min para revisarlo juntos.", time: "14:47", mine: false },
  { sender: "Tú", text: "Genial, ahí estaré. Voy a revisar primero los cambios antes de la reunión.", time: "14:50", mine: true },
]

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(MOCK_MESSAGES[0])
  const [search, setSearch] = useState("")
  const [reply, setReply] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [newTo, setNewTo] = useState("")
  const [newMsg, setNewMsg] = useState("")

  const filtered = MOCK_MESSAGES.filter((m) =>
    search === "" ||
    m.fromName.toLowerCase().includes(search.toLowerCase()) ||
    m.content.toLowerCase().includes(search.toLowerCase())
  )

  const TYPE_ICON = {
    direct: <User className="h-3.5 w-3.5" />,
    alert: <AlertCircle className="h-3.5 w-3.5 text-red-500" />,
    system: <Bot className="h-3.5 w-3.5 text-[#0c365c]" />,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
            <p className="mt-0.5 text-sm text-gray-500">Comunicación directa con tu equipo.</p>
          </div>
          <Button
            className="gap-2 bg-[#0c365c] hover:bg-[#0a2d4e] text-white rounded-xl"
            onClick={() => setShowNew(true)}
          >
            <Plus className="h-4 w-4" />
            Nuevo Mensaje
          </Button>
        </motion.div>

        <div className="flex gap-4 h-[calc(100vh-220px)]">
          {/* Left panel: conversation list */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-72 shrink-0 flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
          >
            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-9 h-8 text-sm rounded-xl border-gray-200 bg-gray-50"
                  placeholder="Buscar mensajes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {filtered.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id
                const senderEmp = MOCK_EMPLOYEES.find((e) => e.id === msg.fromId)
                const avatarUrl = senderEmp?.avatar ?? (msg.fromId === "system" ? "" : "")

                return (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-gray-50",
                      isSelected && "bg-[#0c365c]/5 border-r-2 border-r-[#0c365c]"
                    )}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      {msg.fromId === "system" ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0c365c] text-white">
                          <Bot className="h-4 w-4" />
                        </div>
                      ) : (
                        <img
                          src={msg.fromAvatar}
                          alt={msg.fromName}
                          className="h-9 w-9 rounded-full bg-gray-100"
                        />
                      )}
                      {!msg.isRead && (
                        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#0c365c] border-2 border-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={cn("text-xs font-semibold truncate", !msg.isRead ? "text-gray-900" : "text-gray-600")}>
                          {msg.fromName}
                        </p>
                        <span className="text-xs text-gray-400 shrink-0 ml-1">{timeAgo(msg.createdAt)}</span>
                      </div>
                      <p className={cn("text-xs truncate", !msg.isRead ? "text-gray-700" : "text-gray-400")}>
                        {msg.content}
                      </p>
                      <span className={cn(
                        "mt-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px]",
                        msg.type === "alert" ? "bg-red-100 text-red-600" :
                        msg.type === "system" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                      )}>
                        {TYPE_ICON[msg.type]}
                        {msg.type === "direct" ? "Directo" : msg.type === "alert" ? "Alerta" : "Sistema"}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Right panel: message thread */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
          >
            {selectedMessage ? (
              <>
                {/* Thread header */}
                <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                  {selectedMessage.fromId === "system" ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0c365c] text-white shrink-0">
                      <Bot className="h-5 w-5" />
                    </div>
                  ) : (
                    <img
                      src={selectedMessage.fromAvatar}
                      alt={selectedMessage.fromName}
                      className="h-10 w-10 rounded-full bg-gray-100 shrink-0"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{selectedMessage.fromName}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(selectedMessage.createdAt).toLocaleString("es-MX", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>

                {/* Thread messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Original message */}
                  <div className="flex gap-3">
                    {selectedMessage.fromId === "system" ? (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c365c] text-white">
                        <Bot className="h-4 w-4" />
                      </div>
                    ) : (
                      <img src={selectedMessage.fromAvatar} alt="" className="h-8 w-8 rounded-full bg-gray-100 shrink-0" />
                    )}
                    <div className="max-w-[70%]">
                      <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3">
                        <p className="text-sm text-gray-800">{selectedMessage.content}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-400 ml-2">
                        {new Date(selectedMessage.createdAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  {/* Thread continuation (for direct messages) */}
                  {selectedMessage.type === "direct" && MOCK_THREAD.slice(1).map((t, i) => (
                    <div key={i} className={cn("flex gap-3", t.mine && "flex-row-reverse")}>
                      {!t.mine && (
                        <img src={selectedMessage.fromAvatar} alt="" className="h-8 w-8 rounded-full bg-gray-100 shrink-0" />
                      )}
                      <div className={cn("max-w-[70%]", t.mine && "items-end flex flex-col")}>
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-3",
                            t.mine ? "rounded-tr-sm bg-[#0c365c] text-white" : "rounded-tl-sm bg-gray-100 text-gray-800"
                          )}
                        >
                          <p className="text-sm">{t.text}</p>
                        </div>
                        <p className={cn("mt-1 text-xs text-gray-400", t.mine ? "mr-2" : "ml-2")}>{t.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply box */}
                {selectedMessage.type === "direct" && (
                  <div className="border-t border-gray-100 p-3">
                    <div className="flex items-end gap-2">
                      <Textarea
                        className="resize-none rounded-xl border-gray-200 text-sm flex-1 min-h-[40px] max-h-[100px]"
                        placeholder="Escribe tu respuesta..."
                        rows={2}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            if (reply.trim()) {
                              setReply("")
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        className="bg-[#0c365c] text-white rounded-xl shrink-0"
                        onClick={() => { setReply(""); }}
                        disabled={!reply.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center text-gray-400">
                  <MessageCircle className="mx-auto mb-3 h-12 w-12" />
                  <p className="text-sm">Selecciona una conversación</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* New message modal (simple inline) */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setShowNew(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Nuevo mensaje</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Para</label>
                  <select
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
                    value={newTo}
                    onChange={(e) => setNewTo(e.target.value)}
                  >
                    <option value="">Seleccionar empleado...</option>
                    {MOCK_EMPLOYEES.map((e) => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Mensaje</label>
                  <Textarea
                    className="mt-1.5 rounded-xl border-gray-200 resize-none"
                    rows={4}
                    placeholder="Escribe tu mensaje..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowNew(false)}>
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-[#0c365c] text-white rounded-xl gap-2"
                    onClick={() => { setShowNew(false); setNewMsg(""); }}
                  >
                    <Send className="h-4 w-4" />
                    Enviar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
