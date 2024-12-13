export interface Plan {
  slug: string
  name: string
  description: string
  price: number
  currency: string
  interval: string
  isActive: boolean
  features?: string[]
  stripePriceId?: string
}
