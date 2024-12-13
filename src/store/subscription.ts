import { create } from 'zustand'
import { Plan } from '@/types/plan'

interface Subscription {
  status: string
  startDate: Date
  endDate: Date
  plan: Plan
  amount: number
}

interface SubscriptionStore {
  subscription: Subscription | null
  setSubscription: (subscription: Subscription) => void
  clearSubscription: () => void
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscription: null,
  setSubscription: (subscription) => set({ subscription }),
  clearSubscription: () => set({ subscription: null }),
}))
