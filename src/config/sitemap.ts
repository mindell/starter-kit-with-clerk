import { ChangeFreq } from '@/lib/sitemap-generator'

export interface StaticPageConfig {
  path: string
  priority: number
  changefreq: ChangeFreq
  lastmod?: string
}

export interface SitemapPageConfig {
  priority?: number
  changefreq?: ChangeFreq
}

// Centralized configuration for all pages
export const sitemapConfig = {
  // Cache durations
  cacheDuration: {
    plans: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
  },
  
  // Static pages configuration
  staticPages: {
    home: {
      path: '/',
      priority: 1.0,
      changefreq: 'monthly' as const,
      lastmod: new Date().toISOString(), // Static lastmod
    } satisfies StaticPageConfig,
    
    pricing: {
      path: '/pricing',
      priority: 0.8,
      changefreq: 'weekly' as const,
      // lastmod will be calculated dynamically from plans
    } satisfies StaticPageConfig,
  },
  
  // Default values for dynamic pages (required values)
  defaults: {
    priority: 0.5,
    changefreq: 'monthly' as const,
  } satisfies Required<SitemapPageConfig>,
  
  // Special page configurations (optional, for future use)
  pageConfigs: {
    'faq': {
      priority: 0.7,
      changefreq: 'weekly' as const,
    },
  } as Record<string, SitemapPageConfig>,
} as const
