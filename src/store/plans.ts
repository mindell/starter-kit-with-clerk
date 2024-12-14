import { create } from 'zustand'
import { Plan } from '@/types'

interface PlansStore {
  plans: Plan[]
  setPlans: (plans: Plan[]) => void
  clearPlans: () => void
}

export const usePlansStore = create<PlansStore>((set) => ({
  plans: [],
  setPlans: (plans) => set({ plans }),
  clearPlans: () => set({ plans: [] }),
}))
