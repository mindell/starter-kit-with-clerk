import { Page } from '@/types/page';
import { StrapiPage } from '@/types/strapi';

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
