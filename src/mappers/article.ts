import { Article } from '@/types/article';
import { StrapiArticle } from '@/types/strapi';

export const mapStrapiArticleToArticle = (strapiArticle: StrapiArticle): Article => ({
  title: strapiArticle.title,
  content: strapiArticle.content,
  description: strapiArticle.description,
  author: strapiArticle.author,
  slug: strapiArticle.slug,
  createdAt: strapiArticle.createdAt,
  publishedAt: strapiArticle.publishedAt,
  updatedAt: strapiArticle.updatedAt,
  locale: strapiArticle.locale,
});
