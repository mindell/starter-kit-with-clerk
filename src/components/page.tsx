import React from 'react'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXContent } from '@/components/blog/mdx-content'
import { cn } from '@/lib/utils'
import { StrapiPage } from '@/types/strapi'

export interface PageProps {
  className?: string
  customProps?: any
  customParts?: any
  page: StrapiPage
}

export async function Page ({
  className,
  customProps,
  customParts,
  page
}: PageProps) {
  const serializedContent = await serialize(page.content, {
    mdxOptions: {
      development: process.env.NODE_ENV === 'development'
    }
  })
  return (
    <>
      <article className={cn("max-w-4xl mx-auto p-6", className, customProps)}>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground tracking-tight">
            {page.title}
          </h1>
          { page.description && (
            <p className="text-xl text-muted-foreground mb-4">
              {page.description}
            </p>
          )}
          {
          page.updatedAt && (
            <time 
              dateTime={page.updatedAt}
              className="text-sm text-muted-foreground block mt-4"
            >
              Last updated: {new Date(page.updatedAt).toLocaleDateString(undefined, {
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
          <MDXContent serializedContent={serializedContent} />
        </div>

        {customParts}
      </article>
    </>
  )
}
