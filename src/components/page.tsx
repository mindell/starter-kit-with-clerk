import React from 'react'
import Markdown from 'markdown-to-jsx'
import { cn } from '@/lib/utils'
import Head from 'next/head'
import { StrapiPage } from '@/types/strapi'

export interface PageProps extends StrapiPage {
  className?: string
  customProps?: any
  customParts?: any
}

export const Page: React.FC<PageProps> = ({
  title,
  content,
  description,
  updatedAt,
  className,
  customProps,
  customParts
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {updatedAt && <meta name="last-modified" content={updatedAt} />}
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
          {
          updatedAt && (
            <time 
              dateTime={updatedAt}
              className="text-sm text-muted-foreground block mt-4"
            >
              Last updated: {new Date(updatedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          )
          }
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
