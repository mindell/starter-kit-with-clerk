'use client'

import { cn } from "@/lib/utils"

const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 
      className={cn(
        "scroll-m-20 text-4xl font-bold tracking-tight mb-4",
        "dark:text-gray-50",
        className
      )} 
      {...props} 
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight mb-3",
        "dark:text-gray-100",
        className
      )} 
      {...props} 
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight mb-2",
        "dark:text-gray-200",
        className
      )} 
      {...props} 
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p 
      className={cn(
        "leading-7 mb-4",
        "dark:text-gray-300",
        className
      )} 
      {...props} 
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul 
      className={cn(
        "my-6 ml-6 list-disc",
        "dark:text-gray-300",
        className
      )} 
      {...props} 
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol 
      className={cn(
        "my-6 ml-6 list-decimal",
        "dark:text-gray-300",
        className
      )} 
      {...props} 
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li 
      className={cn(
        "mt-2",
        "dark:text-gray-300",
        className
      )} 
      {...props} 
    />
  ),
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a 
      className={cn(
        "font-medium underline underline-offset-4",
        "text-primary-600 hover:text-primary-800",
        "dark:text-primary-400 dark:hover:text-primary-300",
        className
      )} 
      {...props} 
    />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote 
      className={cn(
        "mt-6 border-l-2 border-gray-300 pl-6 italic",
        "dark:border-gray-700 dark:text-gray-300",
        className
      )} 
      {...props} 
    />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "relative rounded bg-gray-100 px-[0.3rem] py-[0.2rem] font-mono text-sm",
        "dark:bg-gray-800",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        "mb-4 mt-6 overflow-x-auto rounded-lg bg-gray-100 p-4",
        "dark:bg-gray-800",
        className
      )}
      {...props}
    />
  ),
}

export default components
