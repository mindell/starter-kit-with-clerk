import { Metadata } from 'next'
import { StrapiClient } from '@/lib/strapi'
import { BlogCard } from '@/components/blog/blog-card'
import { BlogSearch } from '@/components/blog/blog-search'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read our latest articles and updates',
}

export const revalidate = 3600 // revalidate every hour

async function getLatestArticles() {
  const strapi = new StrapiClient()
  return strapi.fetchAllArticles({
    sort: ['publishedAt:desc'],
    pagination: {
      page: 1,
      pageSize: 10,
    },
  })
}

export default async function BlogPage() {
  const articles = await getLatestArticles()

  return (
    <div className="container py-12 space-y-12">
      <div>
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="mt-2 text-xl text-gray-600">
          Read our latest articles and updates
        </p>
      </div>

      {articles.length > 0 && (
        <section>
          <h2 className="sr-only">Featured Article</h2>
          <BlogCard article={articles[0]} isFeature />
        </section>
      )}

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Search Articles</h2>
        <BlogSearch />
      </section>

      {articles.length > 1 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Latest Articles</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(1).map((article) => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
