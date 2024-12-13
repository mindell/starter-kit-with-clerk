import { Plan } from '@/types/plan';
import { StrapiPlan } from '@/types/strapi';

export const mapStrapiPlanToPlan = (strapiPlan: StrapiPlan): Plan => ({
  name: strapiPlan.name,
  description: strapiPlan.description,
  price: strapiPlan.price,
  currency: strapiPlan.currency,
  interval: strapiPlan.interval,
  isActive: strapiPlan.isActive,
  features: strapiPlan.features,
  slug: strapiPlan.slug,
  stripePriceId: strapiPlan.stripePriceId,
});
