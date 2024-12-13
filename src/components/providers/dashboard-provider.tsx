'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useSubscriptionStore } from '@/store/subscription'
import { usePlanCacheStore } from '@/store/plan-cache'
import { fetchPlan } from '@/lib/strapi'
import { Plan } from '@/types/plan'

interface DashboardProviderProps {
  children: React.ReactNode
}

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

export function DashboardProvider({ children }: DashboardProviderProps) {
  const { user, isLoaded } = useUser()
  const { setSubscription } = useSubscriptionStore()
  const { getFromCache, addToCache } = usePlanCacheStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const fetchSubscriptionWithRetry = async (retryCount = 0): Promise<void> => {
    try {
      // Reset error state
      setError(null)
      setIsLoading(true)

      // Fetch subscription from your API
      const response = await fetch('/api/subscriptions/current')
      if (!response.ok) throw new Error('Failed to fetch subscription')
      
      const subscriptionData = await response.json()
      if (subscriptionData) {
        let plan: Plan | null = null

        // Try to get plan from cache first
        plan = getFromCache(subscriptionData.planId)

        if (!plan) {
          // If not in cache, fetch from Strapi
          try {
            const response = await fetch(`/api/plans/${subscriptionData.planId}`)
            plan = await response.json();            
            // Add to cache
            if(plan) addToCache(subscriptionData.planId, plan);
          } catch (error) {
            throw new Error('Failed to fetch plan details')
          }
        }

        if (!plan) {
          throw new Error('Plan not found')
        }

        setSubscription({
          status: subscriptionData.status,
          startDate: new Date(subscriptionData.startDate),
          endDate: subscriptionData.endDate ? new Date(subscriptionData.endDate) : new Date(),
          plan,
          amount: Number(subscriptionData.amount)
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      
      // If we haven't exceeded max retries, try again
      if (retryCount < MAX_RETRIES) {
        console.log(`Retry attempt ${retryCount + 1} of ${MAX_RETRIES}`)
        // Wait for delay before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)))
        return fetchSubscriptionWithRetry(retryCount + 1)
      }
      
      // If we've exhausted retries, set the error
      setError(errorMessage)
      console.error('Error fetching subscription:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (mounted && isLoaded && user) {
      fetchSubscriptionWithRetry()
    }
  }, [user, isLoaded, mounted])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  // Only show loading/error states after initial mount
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-800 rounded-lg p-4">
          <p className="font-medium">Error loading subscription data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">
          Loading subscription data...
        </div>
      </div>
    )
  }

  return <>{children}</>
}
