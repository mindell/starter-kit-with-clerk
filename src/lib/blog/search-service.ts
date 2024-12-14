import { StrapiArticle } from '@/types/strapi'
import { Article } from '@/types/article'
import { mapStrapiArticleToArticle } from '@/mappers'

interface SearchFilters {
  category?: string
  startDate?: Date
  endDate?: Date
  author?: string
}

interface SearchParams extends SearchFilters {
  query: string
  page?: number
  pageSize?: number
}

interface SearchResult {
  items: Article[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export class BlogSearchService {
  constructor(private baseUrl: string = process.env.NEXT_PUBLIC_STRAPI_URL || '') {}

  async search(params: SearchParams): Promise<SearchResult> {
    try {
      const queryParams = this.buildQueryParams(params)
      const url = `${this.baseUrl}/api/articles?${queryParams}`

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      })

      if (!response.ok) {
        throw new Error('Search request failed')
      }

      const data = await response.json()
      const articles = data.data.map((article: StrapiArticle) => 
        mapStrapiArticleToArticle(article)
      )

      return {
        items: articles,
        total: data.meta.pagination.total,
        page: data.meta.pagination.page,
        pageSize: data.meta.pagination.pageSize,
        totalPages: data.meta.pagination.pageCount,
      }
    } catch (error) {
      console.error('Blog search error:', error)
      throw error
    }
  }

  private buildQueryParams(params: SearchParams): string {
    const queryParts: string[] = []

    // Basic pagination
    queryParts.push(\`pagination[page]=\${params.page || 1}\`)
    queryParts.push(\`pagination[pageSize]=\${params.pageSize || 10}\`)

    // Populate related data
    queryParts.push('populate=cover,author,category')

    // Search query
    if (params.query) {
      queryParts.push(\`filters[\$or][0][title][\$containsi]=\${encodeURIComponent(params.query)}\`)
      queryParts.push(\`filters[\$or][1][description][\$containsi]=\${encodeURIComponent(params.query)}\`)
      queryParts.push(\`filters[\$or][2][blocks][content][\$containsi]=\${encodeURIComponent(params.query)}\`)
    }

    // Category filter
    if (params.category) {
      queryParts.push(\`filters[category][slug][\$eq]=\${encodeURIComponent(params.category)}\`)
    }

    // Date range filter
    if (params.startDate) {
      queryParts.push(\`filters[publishedAt][\$gte]=\${params.startDate.toISOString()}\`)
    }
    if (params.endDate) {
      queryParts.push(\`filters[publishedAt][\$lte]=\${params.endDate.toISOString()}\`)
    }

    // Author filter
    if (params.author) {
      queryParts.push(\`filters[author][id][\$eq]=\${encodeURIComponent(params.author)}\`)
    }

    // Always sort by publish date desc
    queryParts.push('sort[0]=publishedAt:desc')

    // Only published articles
    queryParts.push('filters[status][$eq]=published')

    return queryParts.join('&')
  }

  async getSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) return []

    try {
      const url = \`\${this.baseUrl}/api/articles\`
      const params = new URLSearchParams({
        'filters[$or][0][title][$containsi]': query,
        'filters[$or][1][description][$containsi]': query,
        'pagination[pageSize]': '5',
        'sort[0]': 'publishedAt:desc',
        'filters[status][$eq]': 'published'
      })

      const response = await fetch(\`\${url}?\${params}\`, {
        headers: {
          Authorization: \`Bearer \${process.env.STRAPI_API_TOKEN}\`,
        },
      })

      if (!response.ok) {
        throw new Error('Suggestions request failed')
      }

      const data = await response.json()
      
      // Extract unique terms from titles and descriptions
      const suggestions = data.data
        .map((article: StrapiArticle) => [
          article.attributes.title,
          article.attributes.description
        ])
        .flat()
        .filter((text: string) => 
          text.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)

      return [...new Set(suggestions)]
    } catch (error) {
      console.error('Suggestions error:', error)
      return []
    }
  }
}
