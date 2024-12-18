export interface Plan {
  slug: string
  name: string
  description: string
  price: number
  currency: string
  interval: string
  isActive: boolean
  stripePriceId: string
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  features?: string[]
}
