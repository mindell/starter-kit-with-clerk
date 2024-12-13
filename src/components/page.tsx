import React from 'react'
import Markdown from 'markdown-to-jsx'
import { cn } from '@/lib/utils'
import { Metadata } from 'next'
import Head from 'next/head'
import { PageProps } from '@/types/page'

export const Page: React.FC<PageProps> = ({
  title,
  content,
  description,
  lastUpdated,
  className,
  customProps,
  customParts
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {lastUpdated && <meta name="last-modified" content={lastUpdated} />}
      </Head>
      
      <article className={cn("max-w-4xl mx-auto p-6", className, customProps)}>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-muted-foreground mb-4">
              {description}
            </p>
          )}
          {lastUpdated && (
            <time 
              dateTime={lastUpdated}
              className="text-sm text-muted-foreground block mt-4"
            >
              Last updated: {new Date(lastUpdated).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          )}
        </header>
        
        <div className={cn(
          "prose prose-lg max-w-none dark:prose-invert",
          "prose-headings:text-foreground prose-headings:font-semibold",
          "prose-p:text-muted-foreground prose-p:leading-relaxed",
          "prose-strong:text-foreground",
          "prose-a:text-primary hover:prose-a:text-primary/80 prose-a:no-underline hover:prose-a:underline",
          "prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary",
          "prose-code:text-muted-foreground",
          "prose-ul:text-muted-foreground prose-ol:text-muted-foreground",
          "prose-li:marker:text-primary"
        )}>
          <Markdown>{content}</Markdown>
        </div>

        {customParts}
      </article>
    </>
  )
}
