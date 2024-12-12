'use client'
import { useUser } from '@clerk/nextjs'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus'
import { useSubscriptionStore } from '@/store/subscription'
import { useEffect } from 'react'
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useUser()
  const { subscription, setSubscription } = useSubscriptionStore()
  
  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch(`/api/subscriptions/current`)
        const data = await response.json()
        setSubscription(data)
      } catch (error) {
        console.error('Error fetching subscription:', error)
      }
    }

    fetchSubscription()
  }, [setSubscription])

  const stats = [
    {
      name: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      name: 'Active Users',
      value: '2,338',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
    },
    {
      name: 'Sales',
      value: '$12,234.59',
      change: '-4.5%',
      trend: 'down',
      icon: CreditCard,
    },
    {
      name: 'Active Projects',
      value: '12',
      change: '+2.3%',
      trend: 'up',
      icon: BarChart3,
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Subscription Status */}
        <div className="max-w-md">
          <SubscriptionStatus
            planName={subscription?.plan?.name || 'Free'}
            status={subscription?.status || 'FREE'}
            endDate={subscription?.endDate as Date}
            amount={subscription?.amount || 0}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.name}
                className="relative overflow-hidden rounded-lg border bg-white p-6"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-gray-600" />
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      stat.trend === 'up'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    {stat.change}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <Separator />

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>View Customers</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <CreditCard className="h-6 w-6" />
              <span>Manage Billing</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Team Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
