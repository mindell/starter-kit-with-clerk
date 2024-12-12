import React from 'react'
import Markdown from 'markdown-to-jsx'
import { useArticleStore } from '@/store/article'

export const Article: React.FC = () => {
  const article = useArticleStore((state) => state.article)

  if (!article) {
    return <div>No article available</div>
  }

  return (
    <article className="max-w-3xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
        <div className="text-gray-600">
          <span>{article.author}</span>
          <span className="mx-2">•</span>
          <time>{new Date(article.publishedAt).toLocaleDateString()}</time>
        </div>
      </header>
      
      <div className="prose prose-lg">
        <Markdown>{article.content}</Markdown>
      </div>
    </article>
  )
}
