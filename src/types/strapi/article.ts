import { StrapiBaseFields } from './base';

export interface StrapiArticle extends StrapiBaseFields {
  title: string;
  content: string;
  description: string;
  slug: string;
  author: string;
}
