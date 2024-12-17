import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Tailwind Typography classes for comprehensive markdown styling
    ...components,
    wrapper: ({ children }) => (
      <article className="prose prose-lg prose-blue dark:prose-invert">
        {children}
      </article>
    )
  }
}