import { StrapiBaseFields } from './base';

export interface StrapiPage extends StrapiBaseFields {
  title: string;
  content: string;
  description: string;
  slug: string;
}
