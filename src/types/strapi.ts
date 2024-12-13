// Base Strapi types for v5
export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: StrapiMeta;
}

// Base attributes that all content types have
export interface StrapiBaseFields {
  id: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale?: string;
}

// Page specific types
export interface StrapiPage extends StrapiBaseFields {
  title: string;
  content: string;
  description: string;
  slug: string;
}

export type StrapiPageResponse = StrapiListResponse<StrapiPage> | StrapiSingleResponse<StrapiPage>;

// Article specific types
export interface StrapiArticle extends StrapiBaseFields {
  title: string;
  content: string;
  description: string;
  slug: string;
}

export type StrapiArticleResponse = StrapiListResponse<StrapiArticle> | StrapiSingleResponse<StrapiArticle>;

// Plan specific types
export interface StrapiPlan extends StrapiBaseFields {
  name: string;
  description: string;
  price: number;
  features: string[];
  slug: string;
}

export type StrapiPlanResponse = StrapiListResponse<StrapiPlan> | StrapiSingleResponse<StrapiPlan>;
