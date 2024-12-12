'use client'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { usePlansStore } from '@/store/plans'
import { useEffect } from 'react'

export default function PricingPage() {
  const { user, isLoaded } = useUser()
  const { plans, setPlans } = usePlansStore()

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

  return (
    <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          The right price for you, whoever you are
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {plans.map((plan, index) => (
          <div
            key={plan.slug}
            className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 ${
              index === 1 ? 'sm:z-10 sm:rounded-r-none' : 'sm:mt-8 sm:rounded-l-none'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">{plan.name}</h3>
                {plan.isActive && (
                  <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                    Most popular
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">{plan.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.currency} {plan.price}</span>
                <span className="text-sm font-semibold leading-6 text-gray-600">/{plan.interval.toLowerCase()}</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {/* Add your feature list here */}
              </ul>
            </div>
            <Button
              className="mt-8"
              disabled={!isLoaded}
              onClick={() => {
                // Handle subscription
              }}
            >
              {user ? 'Get started today' : 'Sign up to get started'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
