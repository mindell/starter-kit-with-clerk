import { create } from 'zustand'
import { StrapiPlan } from '@/types/strapi'

interface PlansStore {
  plans: StrapiPlan[]
  setPlans: (plans: StrapiPlan[]) => void
  clearPlans: () => void
}

export const usePlansStore = create<PlansStore>((set) => ({
  plans: [],
  setPlans: (plans) => set({ plans }),
  clearPlans: () => set({ plans: [] }),
}))
