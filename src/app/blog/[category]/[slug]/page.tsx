import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { StrapiClient } from '@/lib/strapi'
import { formatDate } from '@/lib/utils'
import { Mdx } from '@/components/mdx'

interface Props {
  params: {
    category: string
    slug: string
  }
}

export const revalidate = 3600 // revalidate every hour

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const strapi = new StrapiClient()
  const article = await strapi.fetchArticle(params.slug)

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: article.cover
      ? {
          images: [
            {
              url: article.cover.url,
              width: article.cover.width,
              height: article.cover.height,
              alt: article.cover.alternativeText || article.title,
            },
          ],
        }
      : undefined,
  }
}

export default async function ArticlePage({ params }: Props) {
  const strapi = new StrapiClient()
  const article = await strapi.fetchArticle(params.slug)

  if (!article || article.category?.slug !== params.category) {
    notFound()
  }

  return (
    <article className="container py-12 space-y-8">
      <header className="space-y-6 text-center">
        {article.category && (
          <Link
            href={\`/blog/\${article.category.slug}\`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {article.category.name}
          </Link>
        )}
        <h1 className="text-4xl font-bold">{article.title}</h1>
        <p className="text-xl text-gray-600">{article.description}</p>
        <div className="flex items-center justify-center gap-x-4">
          {article.author && (
            <div className="flex items-center gap-x-2">
              {article.author.avatar && (
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="text-gray-700">{article.author.name}</span>
            </div>
          )}
          <time className="text-gray-500">
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </header>

      {article.cover && (
        <div className="relative aspect-video">
          <Image
            src={article.cover.url}
            alt={article.cover.alternativeText || article.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      <div className="prose prose-lg mx-auto">
        <Mdx code={article.content} />
      </div>
    </article>
  )
}
