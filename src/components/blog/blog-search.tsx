'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useBlogSearch } from '@/hooks/use-blog-search'
import { BlogCard } from './blog-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Article } from '@/types/article'

interface DateRange {
  from?: Date
  to?: Date
}

interface SearchFilters {
  startDate?: Date
  endDate?: Date
  category?: string
  author?: string
}

interface SearchResult {
  query: string
  setQuery: (query: string) => void
  items: Article[]
  isLoading: boolean
  error: Error | null
  suggestions: string[]
  filters: SearchFilters
  updateFilters: (filters: Partial<SearchFilters>) => void
  clearFilters: () => void
}

export function BlogSearch() {
  const [dateRange, setDateRange] = useState<DateRange>({})

  const searchResult = useBlogSearch()
  const {
    query,
    setQuery,
    items,
    isLoading,
    error,
    suggestions,
    filters,
    updateFilters,
    clearFilters,
  } = searchResult

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
          {suggestions.length > 0 && query && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
              {suggestions.map((suggestion: string, index: number) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {dateRange.from ? (
                  dateRange.to ? (
                    `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                  ) : (
                    dateRange.from.toLocaleDateString()
                  )
                ) : (
                  'Select date range'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(range: DateRange | undefined) => {
                  setDateRange(range ?? {})
                  updateFilters({
                    startDate: range?.from ?? undefined,
                    endDate: range?.to ?? undefined,
                  })
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {Object.keys(filters).length > 0 && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-800"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 text-red-600 bg-red-50 rounded-md">
          {error.message}
        </div>
      )}

      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))
        ) : items.length > 0 ? (
          items.map((article: Article) => (
            <BlogCard key={article.slug} article={article} />
          ))
        ) : (
          <p className="text-center text-gray-500">No articles found</p>
        )}
      </div>
    </div>
  )
}
