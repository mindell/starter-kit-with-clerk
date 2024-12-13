import { create } from 'zustand'
import { Plan } from '@/types/plan'

interface PlanCache {
  [key: string]: {
    plan: Plan
    timestamp: number
  }
}

interface PlanCacheStore {
  cache: PlanCache
  addToCache: (slug: string, plan: Plan) => void
  getFromCache: (slug: string) => Plan | null
  clearCache: () => void
}

const CACHE_DURATION = 1000 * 60 * 5 // 5 minutes

export const usePlanCacheStore = create<PlanCacheStore>((set, get) => ({
  cache: {},
  
  addToCache: (slug, plan) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [slug]: {
          plan,
          timestamp: Date.now()
        }
      }
    }))
  },
  
  getFromCache: (slug) => {
    const state = get()
    const cached = state.cache[slug]
    
    if (!cached) return null
    
    // Check if cache is expired
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      // Remove expired cache
      set((state) => {
        const { [slug]: _, ...rest } = state.cache
        return { cache: rest }
      })
      return null
    }
    
    return cached.plan
  },
  
  clearCache: () => set({ cache: {} })
}))
