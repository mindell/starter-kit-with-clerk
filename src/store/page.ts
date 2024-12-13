import { create } from 'zustand'

export interface Page {
  title: string
  content: string
  description: string
  slug: string
  createdAt: string
  publishedAt: string
  updatedAt: string
  locale?: string
}

interface PageState {
  page: Page | null
  setPage: (page: Page | null) => void
  clearPage: () => void
}

export const usePageStore = create<PageState>((set) => ({
  page: null,
  setPage: (page) => set({ page }),
  clearPage: () => set({ page: null })
}))
