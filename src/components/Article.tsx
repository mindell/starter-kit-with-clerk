import React from 'react'
import Markdown from 'markdown-to-jsx'
import { useArticleStore } from '@/store/article'
import { cn } from '@/lib/utils'

export const Article: React.FC = () => {
  const article = useArticleStore((state) => state.article)

  if (!article) {
    return null
  }

  return (
    <article className="max-w-3xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">{article.title}</h1>
        <div className="text-muted-foreground">
          <span>{article.author}</span>
          <span className="mx-2">•</span>
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
      </header>
      
      <div className={cn(
        "prose prose-lg dark:prose-invert",
        "prose-headings:text-foreground",
        "prose-p:text-muted-foreground",
        "prose-strong:text-foreground",
        "prose-a:text-primary hover:prose-a:text-primary/80",
        "prose-blockquote:text-muted-foreground",
        "prose-code:text-muted-foreground"
      )}>
        <Markdown>{article.content}</Markdown>
      </div>
    </article>
  )
}
