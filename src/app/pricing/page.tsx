'use client'

import { useUser } from '@clerk/nextjs'
import { usePlansStore } from '@/store/plans'
import { useEffect } from 'react'
import { PriceCard } from '@/components/price-card'
import { PriceCardSkeleton } from '@/components/price-card-skeleton'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
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
      // Handle free plan subscription
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
    <div className="relative isolate bg-white px-4 py-12 sm:px-6 sm:py-24 lg:px-8">
      <div
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        aria-hidden="true"
      >
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-2xl text-center lg:max-w-7xl">
        <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          The right price for you, whoever you are
        </p>
      </div>

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
    </div>
  )
}
