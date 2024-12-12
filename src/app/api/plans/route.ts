import { fetchPlans } from '@/lib/strapi'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const plans = await fetchPlans()
    return NextResponse.json(plans)
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    )
  }
}
