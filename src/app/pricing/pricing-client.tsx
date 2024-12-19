'use client'

import { useUser } from '@clerk/nextjs'
import { usePlansStore } from '@/store/plans'
import { useEffect } from 'react'
import { PriceCard } from '@/components/price-card'
import { PriceCardSkeleton } from '@/components/price-card-skeleton'
import { useRouter } from 'next/navigation'

export default function PricingClient() {
  const { user, isLoaded } = useUser()
  const { plans, setPlans } = usePlansStore()
  const router = useRouter()

  useEffect(() => {
    async function fetchAvailablePlans() {
      try {
        const response = await fetch('/api/plans')
        const data = await response.json()
        setPlans(data)
      } catch (error) {
        console.error('Error fetching plans:', error)
      }
    }
    fetchAvailablePlans()
  }, [setPlans])

  const handleSubscribe = async (plan: any) => {
    if (!user) {
      router.push('/sign-in')
      return
    }

    if (plan.slug === 'free') {
      router.push('/dashboard')
      return
    }

    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planSlug: plan.slug,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating subscription:', error)
    }
  }

  return (
    <div className="mx-auto mt-16 grid max-w-lg gap-8 md:max-w-3xl lg:max-w-7xl lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      {plans.length === 0 ? (
        <>
          <PriceCardSkeleton />
          <PriceCardSkeleton />
          <PriceCardSkeleton />
        </>
      ) : (
        plans.map((plan) => (
          <PriceCard
            key={plan.slug}
            plan={plan}
            isLoaded={isLoaded}
            isSignedIn={!!user}
            onSubscribe={() => handleSubscribe(plan)}
          />
        ))
      )}
    </div>
  )
}
