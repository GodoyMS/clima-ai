import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Notification } from '@/lib/types'
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data'

interface AdminState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  /** Left drawer on small viewports (Sheet), same idea as shadcn Sidebar mobile */
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void

  commandPaletteOpen: boolean
  toggleCommandPalette: () => void
  setCommandPaletteOpen: (open: boolean) => void

  selectedEmployeeId: string | null
  setSelectedEmployeeId: (id: string | null) => void

  notifications: Notification[]
  unreadCount: number
  setNotifications: (notifications: Notification[]) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

      mobileSidebarOpen: false,
      setMobileSidebarOpen: (open: boolean) => set({ mobileSidebarOpen: open }),

      commandPaletteOpen: false,
      toggleCommandPalette: () =>
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      setCommandPaletteOpen: (open: boolean) => set({ commandPaletteOpen: open }),

      selectedEmployeeId: null,
      setSelectedEmployeeId: (id: string | null) => set({ selectedEmployeeId: id }),

      notifications: MOCK_NOTIFICATIONS,
      unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length,

      setNotifications: (notifications: Notification[]) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.isRead).length,
        }),

      markNotificationRead: (id: string) =>
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n,
          )
          return {
            notifications,
            unreadCount: notifications.filter((n) => !n.isRead).length,
          }
        }),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        })),
    }),
    {
      name: 'clima-admin',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    },
  ),
)
