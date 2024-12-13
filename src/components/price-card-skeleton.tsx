import { cn } from '@/lib/utils'

export function PriceCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="mt-6 flex items-baseline gap-x-1">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="mt-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-x-3">
              <div className="h-6 w-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 flex-1 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 h-10 bg-gray-200 rounded-md animate-pulse" />
    </div>
  )
}
