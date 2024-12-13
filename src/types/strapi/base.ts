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
