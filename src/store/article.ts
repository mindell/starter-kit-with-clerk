import { create } from 'zustand'

interface Article {
  title: string
  content: string
  author: string
  publishedAt: string
}

interface ArticleStore {
  article: Article | null
  setArticle: (article: Article) => void
  clearArticle: () => void
}

export const useArticleStore = create<ArticleStore>((set) => ({
  article: null,
  setArticle: (article) => set({ article }),
  clearArticle: () => set({ article: null }),
}))
