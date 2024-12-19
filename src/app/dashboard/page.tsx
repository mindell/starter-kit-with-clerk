'use server'
import { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { SubscriptionSection } from './_components/subscription-section';
import { StatsGrid } from './_components/stats-grid';

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <>
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
        <Suspense fallback={<div>Loading subscription...</div>}>
          <SubscriptionSection />
        </Suspense>

        {/* Stats Grid */}
        <Suspense fallback={<div>Loading stats...</div>}>
          <StatsGrid />
        </Suspense>
      </div>
    </>
  );
}
