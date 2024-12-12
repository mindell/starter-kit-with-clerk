import { create } from 'zustand'

interface Plan {
  name: string
  description: string
  price: number
  currency: 'USD' | 'DKK'
  interval: 'MONTHLY' | 'YEARLY'
  isActive: boolean
  slug: string
}

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
