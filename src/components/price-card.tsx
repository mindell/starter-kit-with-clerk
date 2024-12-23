import { Button } from '@/components/ui/button'
import { StrapiPlan } from '@/types/strapi'
import Markdown from 'markdown-to-jsx'
import { cn } from '@/lib/utils'

interface PriceCardProps {
  isLoaded: boolean
  isSignedIn: boolean
  className?: string
  plan: StrapiPlan
  onSubscribe: () => void
}

export function PriceCard({ plan, isLoaded, isSignedIn, className, onSubscribe }: PriceCardProps) {
  

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
        onClick={onSubscribe}
        className="mt-6 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {isLoaded ? (isSignedIn ? 'Subscribe' : 'Sign up') : 'Loading...'}
      </Button>
    </div>
  )
}
