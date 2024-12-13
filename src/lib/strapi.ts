import axios, { AxiosError } from 'axios';
import { notFound } from 'next/navigation';
import {
  StrapiSingleResponse,
  StrapiListResponse,
  StrapiPage,
  StrapiArticle,
  StrapiPlan,
} from '@/types/strapi';
import { Page } from '@/types/page';
import { Article } from '@/types/article';
import { Plan } from '@/types/plan';
import {
  mapStrapiPageToPage,
  mapStrapiArticleToArticle,
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

interface FetchOptions {
  endpoint: string;
  slug?: string;
  populate?: string[] | '*';
  additionalFilters?: Record<string, any>;
}

// Cache manager
class CacheManager<T> {
  private cache = new Map<string, CacheItem<T>>();

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > CONFIG.cacheDuration) {
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
  pages: new CacheManager<Page>(),
  articles: new CacheManager<Article>(),
  plans: new CacheManager<Plan | Plan[]>(),
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
    if (!this.instance) {
      this.instance = new StrapiClient();
    }
    return this.instance;
  }

  private async fetchFromAPI<T>({ endpoint, slug, populate, additionalFilters = {} }: FetchOptions): Promise<StrapiSingleResponse<T> | StrapiListResponse<T>> {
    try {
      const filters = slug ? { slug: { $eq: slug }, ...additionalFilters } : additionalFilters;
      
      const response = await axios.get(`${CONFIG.apiUrl}/api/${endpoint}`, {
        params: {
          filters,
          populate: populate || '*',
        },
        headers: this.headers,
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new StrapiError(
          `Failed to fetch from Strapi: ${error.message}`,
          error.response?.status,
          error.response?.data
        );
      }
      throw new StrapiError('Unknown error occurred while fetching from Strapi');
    }
  }

  private async fetchSingle<T>(options: FetchOptions): Promise<T> {
    const response = await this.fetchFromAPI<T>(options);
    
    if ('data' in response) {
      const data = Array.isArray(response.data) ? response.data[0] : response.data;
      if (!data) {
        notFound();
      }
      return data;
    }
    
    notFound();
  }

  async fetchPage(slug: string): Promise<Page> {
    const cached = caches.pages.get(slug);
    if (cached) return cached;

    const pageData = await this.fetchSingle<StrapiPage>({ endpoint: 'pages', slug });
    const page = mapStrapiPageToPage(pageData);
    caches.pages.set(slug, page);
    return page;
  }

  async fetchArticle(slug: string): Promise<Article> {
    const cached = caches.articles.get(slug);
    if (cached) return cached;

    const articleData = await this.fetchSingle<StrapiArticle>({ endpoint: 'articles', slug });
    const article = mapStrapiArticleToArticle(articleData);
    caches.articles.set(slug, article);
    return article;
  }

  async fetchPlan(slug: string): Promise<Plan> {
    const cached = caches.plans.get(slug);
    if (cached && !Array.isArray(cached)) return cached;

    const planData = await this.fetchSingle<StrapiPlan>({ endpoint: 'plans', slug });
    const plan = mapStrapiPlanToPlan(planData);
    caches.plans.set(slug, plan);
    return plan;
  }

  async fetchPlans(): Promise<Plan[]> {
    const cacheKey = 'all-plans';
    const cached = caches.plans.get(cacheKey);
    if (cached) {
      return Array.isArray(cached) ? cached : [cached];
    }

    const response = await this.fetchFromAPI<StrapiPlan>({ endpoint: 'plans' });
    
    if ('data' in response && Array.isArray(response.data)) {
      const plans = response.data.map(mapStrapiPlanToPlan);
      caches.plans.set(cacheKey, plans);
      return plans;
    }
    
    throw new StrapiError('No plans found');
  }
}

// Export singleton instance methods
const strapiClient = StrapiClient.getInstance();

export const fetchPage = (slug: string): Promise<Page> => strapiClient.fetchPage(slug);
export const fetchArticle = (slug: string): Promise<Article> => strapiClient.fetchArticle(slug);
export const fetchPlan = (slug: string): Promise<Plan> => strapiClient.fetchPlan(slug);
export const fetchPlans = (): Promise<Plan[]> => strapiClient.fetchPlans();