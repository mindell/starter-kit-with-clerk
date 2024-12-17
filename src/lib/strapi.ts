import axios, { AxiosError } from 'axios';
import { notFound } from 'next/navigation';
import {
  StrapiSingleResponse,
  StrapiListResponse,
  StrapiPage,
  StrapiArticle,
  StrapiPlan,
  StrapiBaseFields,
  StrapiCategory,
} from '@/types/strapi';
import { Page } from '@/types/page';
import { Plan } from '@/types/plan';
import {
  mapStrapiPageToPage,
  mapStrapiPlanToPlan,
} from '@/mappers';

// Configuration
const CONFIG = {
  apiUrl: process.env.NEXT_PUBLIC_STRAPI_URL,
  apiToken: process.env.STRAPI_API_TOKEN,
  cacheDuration: 5 * 60 * 1000, // 5 minutes in milliseconds
} as const;

// Custom error class
class StrapiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'StrapiError';
  }
}

// Types
interface CacheItem<T> {
  data: T;
  timestamp: number;
}
interface Pagination {
  page?: number;
  pageSize: number;
  withCount?: boolean;
}
interface FetchOptions {
  endpoint: string;
  slug?: string;
  populate?: string[] | '*';
  additionalFilters?: Record<string, any>;
  sort?: string[];
  status?: 'published' | 'draft';
  pagination?: Pagination;
}

// Cache manager
class CacheManager<T> {
  private cache = new Map<string, CacheItem<T>>();

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > CONFIG.cacheDuration) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

// Initialize caches with correct types
const caches = {
  pages: new CacheManager<Page[]>(),
  articles: new CacheManager<StrapiArticle[]>(),
  plans: new CacheManager<Plan[]>(),
};

// API client
class StrapiClient {
  private static instance: StrapiClient;
  private headers: { Authorization: string };

  private constructor() {
    this.headers = {
      Authorization: `Bearer ${CONFIG.apiToken}`,
    };
  }

  static getInstance(): StrapiClient {
    if (!StrapiClient.instance) {
      StrapiClient.instance = new StrapiClient();
    }
    return StrapiClient.instance;
  }

  private async fetchFromAPI<T>({ 
    endpoint, 
    slug, 
    populate = '*',
    additionalFilters = {},
    sort,
    status,
  }: FetchOptions): Promise<StrapiListResponse<T> | StrapiSingleResponse<T>> {
    try {
      const filters = slug ? { slug: { $eq: slug } } : {};
      const response = await axios.get(`${CONFIG.apiUrl}/api/${endpoint}`, {
        params: {
          filters: { ...filters, ...additionalFilters },
          populate,
          sort,
          status
        },
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        notFound();
      }
      throw new StrapiError(
        'Failed to fetch from Strapi',
        error instanceof AxiosError ? error.response?.status : undefined,
        error
      );
    }
  }

  private async fetchSingle<T extends StrapiBaseFields>(options: FetchOptions): Promise<T> {
    const response = await this.fetchFromAPI<T>(options);

    if ('data' in response) {
      if (Array.isArray(response.data)) {
        const [item] = response.data;
        if (!item) {
          throw new StrapiError('Item not found');
        }
        return item;
      }
      return response.data;
    }
    
    throw new StrapiError('Invalid response format');
  }

  async fetchPage(slug: string): Promise<Page> {
    const page = await this.fetchSingle<StrapiPage>({
      endpoint: 'pages',
      slug,
    });
    return mapStrapiPageToPage(page);
  }

  async fetchArticle(slug: string): Promise<StrapiArticle> {
    const article = await this.fetchSingle<StrapiArticle>({
      endpoint: 'articles',
      slug,
    });
    return article;
  }

  async fetchPlan(slug: string): Promise<Plan> {
    const plan = await this.fetchSingle<StrapiPlan>({
      endpoint: 'plans',
      slug,
    });
    return mapStrapiPlanToPlan(plan);
  }

  async fetchPlans(): Promise<Plan[]> {
    const response = await this.fetchFromAPI<StrapiPlan>({
      endpoint: 'plans',
    });
    
    if ('data' in response && Array.isArray(response.data)) {
      return response.data.map(mapStrapiPlanToPlan);
    }
    
    throw new StrapiError('No plans found');
  }

  async fetchAllPages(options: { 
    pageSize?: number,
    excludeSlugs?: string[],
    revalidate?: number 
  } = {}): Promise<Page[]> {
    const { 
      pageSize = 100,
      excludeSlugs = [],
      revalidate = 3600
    } = options;

    try {
      const cacheKey = `all-pages-${pageSize}-${excludeSlugs.join(',')}`;
      const cachedData = caches.pages.get(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const response = await this.fetchFromAPI<StrapiPage>({
        endpoint: 'pages',
        populate: '*',
        additionalFilters: {
          pagination: {
            pageSize,
            withCount: true
          },
          sort: ['updatedAt:desc'],
          status: 'published'
        }
      });

      if ('data' in response && Array.isArray(response.data)) {
        const pages = response.data
          .map(mapStrapiPageToPage)
          .filter(page => !excludeSlugs.includes(page.slug));
        
        caches.pages.set(cacheKey, pages);
        return pages;
      }

      return [];
    } catch (error) {
      console.error('Error fetching all pages:', error);
      return [];
    }
  }

  async fetchCollection<T>(options: FetchOptions): Promise<T[]> {
    const response = await this.fetchFromAPI<T>(options);

    if ('data' in response && Array.isArray(response.data)) {
      return response.data;
    }

    throw new StrapiError('No items found');
  }

  async fetchBlogCategoryArticles<T>(categorySlug: string): Promise<T[]> {
    const options = {
      endpoint: 'articles',
      additionalFilters: {
        category: {
          slug: {
            $eq: categorySlug
          }
        }
      },
      pagination: {
        pageSize: 10,
        page:1,
        withCount: true
      },
      sort: ['updatedAt:desc'],
    }
    const response = await this.fetchFromAPI<T>(options);

    if ('data' in response && Array.isArray(response.data)) {
      return response.data;
    }
    
    throw new StrapiError('No items found');
  }

  async fetchCategory<T>(categorySlug: string): Promise<T> {
    const options = {
      endpoint: 'categories',
      slug: categorySlug
    }
    const response = await this.fetchFromAPI<T>(options);

    if ('data' in response) {
      if (Array.isArray(response.data)) {
        const [item] = response.data;
        if (!item) {
          throw new StrapiError('Item not found');
        }
        return item;
      }
      return response.data;
    }
    
    throw new StrapiError('Invalid response format');
  }
}

// Export singleton instance methods
const strapiClient = StrapiClient.getInstance();

export const fetchPage = (slug: string): Promise<Page> => strapiClient.fetchPage(slug);
export const fetchArticle = (slug: string): Promise<StrapiArticle> => strapiClient.fetchArticle(slug);
export const fetchPlan = (slug: string): Promise<Plan> => strapiClient.fetchPlan(slug);
export const fetchPlans = (): Promise<Plan[]> => strapiClient.fetchPlans();
export const fetchAllPages = (options: { 
  pageSize?: number,
  excludeSlugs?: string[],
  revalidate?: number 
} = {}): Promise<Page[]> => strapiClient.fetchAllPages(options);
export const fetchBlogCategoryArticles = (categorySlug: string):Promise<StrapiArticle[]> => strapiClient.fetchBlogCategoryArticles(categorySlug);
export async function fetchAllArticles(): Promise<StrapiArticle[]> {
  return strapiClient.fetchCollection<StrapiArticle>({
    endpoint: 'articles',
    populate: [
      'cover',
      'author',
      'category',
      'blocks',
      'blocks.file'
    ],
    sort: ['publishedAt:desc'],
    status: 'published'
  })
}
export const fetchCategory = <T>(categorySlug: string):Promise<StrapiCategory> => strapiClient.fetchCategory(categorySlug);
