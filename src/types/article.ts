export interface Article {
  id: number;
  title: string;
  content: string;
  description: string;
  author: string;
  slug: string;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  locale?: string;
}
