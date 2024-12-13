import { StrapiPage } from './strapi';

export interface Page {
  title: string;
  content: string;
  description: string;
  slug: string;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  locale?: string;
}

export interface PageProps extends Omit<Page, 'createdAt' | 'publishedAt' | 'updatedAt' | 'locale'> {
  lastUpdated?: string;
  className?: string;
  customProps?: string;
  customParts?: React.ReactNode;
}

export const mapStrapiPageToPage = (strapiPage: StrapiPage): Page => ({
  title: strapiPage.title,
  content: strapiPage.content,
  description: strapiPage.description,
  slug: strapiPage.slug,
  createdAt: strapiPage.createdAt,
  publishedAt: strapiPage.publishedAt,
  updatedAt: strapiPage.updatedAt,
  locale: strapiPage.locale,
});
