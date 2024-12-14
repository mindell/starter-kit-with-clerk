import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { StrapiClient } from '@/lib/strapi'
import { BlogCard } from '@/components/blog/blog-card'

interface Props {
  params: {
    category: string
  }
}

export const revalidate = 3600 // revalidate every hour

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const strapi = new StrapiClient()
  const category = await strapi.fetchCategory(params.category)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: \`\${category.name} - Blog\`,
    description: category.description,
  }
}

async function getCategoryArticles(category: string) {
  const strapi = new StrapiClient()
  const articles = await strapi.fetchAllArticles({
    filters: {
      category: {
        slug: {
          $eq: category,
        },
      },
    },
    sort: ['publishedAt:desc'],
  })

  return articles
}

export default async function CategoryPage({ params }: Props) {
  const strapi = new StrapiClient()
  const category = await strapi.fetchCategory(params.category)

  if (!category) {
    notFound()
  }

  const articles = await getCategoryArticles(params.category)

  return (
    <div className="container py-12 space-y-12">
      <div>
        <h1 className="text-4xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-xl text-gray-600">{category.description}</p>
        )}
      </div>

      {articles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No articles found in this category
        </p>
      )}
    </div>
  )
}
