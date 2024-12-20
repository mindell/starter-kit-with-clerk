import { Button } from '@/components/ui/button'
import { Plan } from '@/types/plan'
import Markdown from 'markdown-to-jsx'
import { cn } from '@/lib/utils'

interface PriceCardProps {
  plan: Plan
  isLoaded: boolean
  isSignedIn: boolean
  className?: string
  onSubscribe: () => void
}

export function PriceCard({ plan, isLoaded, isSignedIn, className, onSubscribe }: PriceCardProps) {
  const handleSubscribe = async () => {
    if (!isSignedIn) {
      onSubscribe();
      return;
    }

    if (plan.slug === 'free') {
      // Handle free plan subscription
      onSubscribe();
      return;
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
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-3xl bg-white p-6 ring-1 ring-gray-200 xl:p-8 transition-transform hover:scale-105 h-full',
        className
      )}
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
        <div className="mt-4 text-sm leading-6 text-gray-600 prose prose-sm">
          <Markdown>{plan.description}</Markdown>
        </div>
        <p className="mt-6 flex items-baseline gap-x-1">
          <span className="text-4xl font-bold tracking-tight text-gray-900">
            {plan.currency} {plan.price}
          </span>
          <span className="text-sm font-semibold leading-6 text-gray-600">/{plan.interval.toLowerCase()}</span>
        </p>
        {plan.features && (
          <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-indigo-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button
        onClick={handleSubscribe}
        className="mt-6 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {isLoaded ? (isSignedIn ? 'Subscribe' : 'Sign up') : 'Loading...'}
      </Button>
    </div>
  )
}
