import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EmployeeState {
  currentMood: number | null
  setCurrentMood: (mood: number) => void

  hasCheckedInToday: boolean
  setHasCheckedInToday: (value: boolean) => void

  streak: number
  incrementStreak: () => void
  resetStreak: () => void

  activeTab: string
  setActiveTab: (tab: string) => void

  pendingPulseId: string | null
  setPendingPulseId: (id: string | null) => void

  lastCheckInDate: string | null
  setLastCheckInDate: (date: string) => void
}

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set, get) => ({
      currentMood: null,
      setCurrentMood: (mood: number) => set({ currentMood: mood }),

      hasCheckedInToday: false,
      setHasCheckedInToday: (value: boolean) => {
        const today = new Date().toISOString().split('T')[0]
        set({ hasCheckedInToday: value })
        if (value) {
          const lastDate = get().lastCheckInDate
          if (lastDate !== today) {
            set({ lastCheckInDate: today })
          }
        }
      },

      streak: 0,
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
      resetStreak: () => set({ streak: 0 }),

      activeTab: 'inicio',
      setActiveTab: (tab: string) => set({ activeTab: tab }),

      pendingPulseId: null,
      setPendingPulseId: (id: string | null) => set({ pendingPulseId: id }),

      lastCheckInDate: null,
      setLastCheckInDate: (date: string) => set({ lastCheckInDate: date }),
    }),
    {
      name: 'clima-employee',
      partialize: (state) => ({
        currentMood: state.currentMood,
        hasCheckedInToday: state.hasCheckedInToday,
        streak: state.streak,
        activeTab: state.activeTab,
        lastCheckInDate: state.lastCheckInDate,
      }),
    },
  ),
)
