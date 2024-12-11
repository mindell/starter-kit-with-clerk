import { create } from 'zustand'

interface DashboardState {
  sidebarOpen: boolean
  currentView: string
  setSidebarOpen: (open: boolean) => void
  setCurrentView: (view: string) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  sidebarOpen: true,
  currentView: 'overview',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentView: (view) => set({ currentView: view }),
}))
