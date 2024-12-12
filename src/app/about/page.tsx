'use client'
import Header from '../components/Header';
import { Article } from '@/components/Article'
import { useArticleStore } from '@/store/article'
import { useEffect } from 'react';


export default function AboutPage() {
  const setArticle = useArticleStore((state) => state.setArticle)

  useEffect(() => {
    async function getAboutContent() {
      try {
        const response = await fetch('/api/article?slug=about')
        const data = await response.json()
        
        setArticle({
          title: data.title,
          content: data.blocks[0].body,
          author: data.author,
          publishedAt: data.publishedAt
        })
      } catch (error) {
        console.error('Error fetching about content:', error)
      }
    }

    getAboutContent()
  }, [setArticle])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <Article />
    </div>
  )
}
