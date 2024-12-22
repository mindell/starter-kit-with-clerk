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
type PopulateValue = string | string[];

export type PopulateObject = {
  [key: string]: PopulateValue | PopulateObject;
};

type PopulateParams = 
  | '*'
  | PopulateValue 
  | PopulateObject
  | (string | PopulateObject)[]
  | null;

interface FetchOptions {
  endpoint: string;
  slug?: string;
  populate?: PopulateParams;
  additionalFilters?: Record<string, any>;
  sort?: string[];
  status?: 'published' | 'draft';
  pagination?: Pagination;    
  fields?: string[];
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
  pages: new CacheManager<StrapiPage[]>(),
  articles: new CacheManager<StrapiArticle[]>(),
  plans: new CacheManager<StrapiPlan[]>(),
  categories: new CacheManager<StrapiCategory[]>(),
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
    fields,
    pagination,
  }: FetchOptions): Promise<StrapiListResponse<T> | StrapiSingleResponse<T>> {
    try {
      const filters = slug ? { slug: { $eq: slug } } : {};
      const response = await axios.get(`${CONFIG.apiUrl}/api/${endpoint}`, {
        params: {
          filters: { ...filters, ...additionalFilters },
          populate: populate ? populate : undefined,
          sort,
          status,
          fields,
          pagination,
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

  async fetchPage(slug: string): Promise<StrapiPage> {
    const page = await this.fetchSingle<StrapiPage>({
      endpoint: 'pages',
      slug,
    });
    return page;
  }

  async fetchArticle(slug: string): Promise<StrapiArticle> {
    const article = await this.fetchSingle<StrapiArticle>({
      endpoint: 'articles',
      slug,
    });
    return article;
  }

  async fetchPlan(slug: string): Promise<StrapiPlan> {
    const plan = await this.fetchSingle<StrapiPlan>({
      endpoint: 'plans',
      slug,
    });
    return plan;
  }

  async fetchPlans(options: {fields?: string[]}): Promise<StrapiPlan[]> {
    const {
      fields = [],
    } = options;
    const populate = fields.length > 0 ? null : '*';
    const response = await this.fetchFromAPI<StrapiPlan>({
      endpoint: 'plans',
      populate,
      fields
    });
    
    if ('data' in response && Array.isArray(response.data)) {
      return response.data;
    }
    
    throw new StrapiError('No plans found');
  }

  async fetchAllPages(options: { 
    page?: number,
    pageSize?: number,
    excludeSlugs?: string[],
    fields?: string[], 
  } = {}): Promise<StrapiPage[]> {
    const { 
      pageSize = 100,
      excludeSlugs = [],
      page = 1,
      fields = ['publishedAt', 'updatedAt','slug'],
    } = options;

    try {
      const cacheKey = `all-pages-${pageSize}-${excludeSlugs.join(',')}`;
      const cachedData = caches.pages.get(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const response = await this.fetchFromAPI<StrapiPage>({
        endpoint: 'pages',
        fields,
        pagination: {
          page,
          pageSize,
          withCount: true
        },
        sort: ['updatedAt:desc'],
        status: 'published',
        populate: null,
      });

      if ('data' in response && Array.isArray(response.data)) {
        const pages = response.data
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

export const fetchPage = (slug: string): Promise<StrapiPage> => strapiClient.fetchPage(slug);
export const fetchArticle = (slug: string): Promise<StrapiArticle> => strapiClient.fetchArticle(slug);
export const fetchPlan = (slug: string): Promise<StrapiPlan> => strapiClient.fetchPlan(slug);
export const fetchPlans = (options: { fields?: string[] }): Promise<StrapiPlan[]> => strapiClient.fetchPlans(options);
export const fetchAllPages = (options: { 
  pageSize?: number,
  excludeSlugs?: string[],
  revalidate?: number 
} = {}): Promise<StrapiPage[]> => strapiClient.fetchAllPages(options);
export const fetchBlogCategoryArticles = (categorySlug: string):Promise<StrapiArticle[]> => strapiClient.fetchBlogCategoryArticles(categorySlug);
export async function fetchAllArticles(options: {
  pageSize?: number,
  page?: number,
  fields?: string[],
  populate?: PopulateParams,
  sort?: string[],
}): Promise<StrapiArticle[]> {
  const {
    fields = ['updatedAt', 'publishedAt', 'slug'],
    pageSize = 10,
    page = 1,
    sort = ['publishedAt:desc'],
  } = options;
  let populate = options.populate;
  if(!populate) {
    populate = fields.length > 0 ? null : '*';
  }
  
  return strapiClient.fetchCollection<StrapiArticle>({
    endpoint: 'articles',
    populate,
    fields,
    pagination: {
      pageSize,
      page,
      withCount: true
    },
    sort: sort,
    status: 'published'
  })
}
export const fetchCategory = <T>(categorySlug: string):Promise<StrapiCategory> => strapiClient.fetchCategory(categorySlug);

export async function fetchAllCategories(options: {
  pageSize?: number,
  page?: number,
  fields?: string[],
  sort?: string[],
}): Promise<StrapiCategory[]> {
  const {
    fields = ['name', 'slug'],
    pageSize = 100,
    page = 1,
    sort = ['name:asc'],
  } = options;

  return strapiClient.fetchCollection<StrapiCategory>({
    endpoint: 'categories',
    fields,
    pagination: {
      pageSize,
      page,
      withCount: true
    },
    sort,
    status: 'published'
  })
}
