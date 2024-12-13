import { StrapiBaseFields } from './base';

export interface StrapiPlan extends StrapiBaseFields {
  name: string;
  description: string;
  price: number;
  features: string[];
  slug: string;
  currency: string;
  interval: string;
  isActive: boolean;
  stripePriceId?: string;
}
