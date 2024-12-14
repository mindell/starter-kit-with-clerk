import { fetchAllPages } from './strapi'
import { fetchPlans } from './strapi'
import { sitemapConfig, SitemapPageConfig } from '@/config/sitemap'

export type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export interface SitemapConfig {
  baseUrl: string
  revalidate?: number
  excludeSlugs?: string[]
}

export class SitemapGenerator {
  private config: SitemapConfig
  private plansLastModCache: { timestamp: number; lastmod: string | null } | null = null

  constructor(config: SitemapConfig) {
    this.config = {
      revalidate: 3600,
      ...config
    }
  }

  private getPageConfig(slug: string): SitemapPageConfig {
    return sitemapConfig.pageConfigs[slug] || sitemapConfig.defaults
  }

  private async getPlansLastMod(): Promise<string | null> {
    // Check cache first
    const now = Date.now()
    if (this.plansLastModCache && 
        (now - this.plansLastModCache.timestamp) < sitemapConfig.cacheDuration.plans) {
      return this.plansLastModCache.lastmod
    }

    try {
      const plans = await fetchPlans()
      if (!plans.length) return null

      // Get the latest updatedAt date
      const lastmod = plans.reduce((latest, plan) => {
        const planDate = new Date(plan.updatedAt)
        return latest > planDate ? latest : planDate
      }, new Date(0)).toISOString()

      // Update cache
      this.plansLastModCache = {
        timestamp: now,
        lastmod
      }

      return lastmod
    } catch (error) {
      console.error('Error fetching plans for lastmod:', error)
      return null
    }
  }

  private async generateStaticPagesEntries(): Promise<string> {
    const entries: string[] = []
    
    // Add home page
    const home = sitemapConfig.staticPages.home
    entries.push(this.generateUrlEntry({
      loc: `${this.config.baseUrl}${home.path}`,
      lastmod: home.lastmod,
      changefreq: home.changefreq,
      priority: home.priority
    }))

    // Add pricing page with dynamic lastmod
    const pricing = sitemapConfig.staticPages.pricing
    const pricingLastMod = await this.getPlansLastMod()
    entries.push(this.generateUrlEntry({
      loc: `${this.config.baseUrl}${pricing.path}`,
      lastmod: pricingLastMod || undefined,
      changefreq: pricing.changefreq,
      priority: pricing.priority
    }))

    return entries.join('\n')
  }

  private generateUrlEntry({
    loc,
    lastmod,
    changefreq,
    priority
  }: {
    loc: string
    lastmod?: string
    changefreq: ChangeFreq
    priority: number
  }): string {
    return `
      <url>
        <loc>${loc}</loc>
        ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
        <changefreq>${changefreq}</changefreq>
        <priority>${priority.toFixed(1)}</priority>
      </url>
    `
  }

  async generateSitemapXml(): Promise<string> {
    // Fetch both static and dynamic entries in parallel
    const [staticEntries, pages] = await Promise.all([
      this.generateStaticPagesEntries(),
      fetchAllPages({
        excludeSlugs: this.config.excludeSlugs,
        revalidate: this.config.revalidate
      })
    ])

    // Generate dynamic page entries
    const dynamicEntries = pages.map(page => {
      const pageConfig = this.getPageConfig(page.slug)
      return this.generateUrlEntry({
        loc: `${this.config.baseUrl}/${page.slug}`,
        lastmod: page.updatedAt || page.publishedAt,
        // Ensure we always have valid values by using defaults
        changefreq: pageConfig.changefreq ?? sitemapConfig.defaults.changefreq!,
        priority: pageConfig.priority ?? sitemapConfig.defaults.priority!
      })
    }).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${staticEntries}
        ${dynamicEntries}
      </urlset>`
  }
}
