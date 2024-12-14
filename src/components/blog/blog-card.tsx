import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Article } from '@/types/article'
import { formatDate } from '@/lib/utils'

interface BlogCardProps {
  article: Article
  isFeature?: boolean
}

export function BlogCard({ article, isFeature = false }: BlogCardProps) {
  const href = `/blog/${article.category?.slug || 'uncategorized'}/${article.slug}`

  return (
    <Card className={`overflow-hidden ${isFeature ? 'lg:flex' : ''}`}>
      <div className={`relative ${isFeature ? 'lg:w-2/5' : 'aspect-video'}`}>
        {article.cover ? (
          <Image
            src={article.cover.url}
            alt={article.cover.alternativeText || article.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>
      <div className={`p-6 ${isFeature ? 'lg:w-3/5' : ''}`}>
        {article.category && (
          <Link
            href={`/blog/${article.category.slug}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {article.category.name}
          </Link>
        )}
        <Link href={href}>
          <h3 className={`mt-2 ${isFeature ? 'text-2xl' : 'text-xl'} font-semibold text-gray-900 hover:text-gray-600`}>
            {article.title}
          </h3>
        </Link>
        <p className="mt-3 text-gray-600 line-clamp-2">
          {article.description}
        </p>
        <div className="mt-4 flex items-center gap-x-4">
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
              <span className="text-sm text-gray-700">{article.author.name}</span>
            </div>
          )}
          <time className="text-sm text-gray-500">
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </div>
    </Card>
  )
}
