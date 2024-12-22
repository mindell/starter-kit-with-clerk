import { Suspense } from 'react'
import Header from '@/components/header'
import { Page } from '@/components/page'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchPage } from '@/lib/strapi'
import { generateDynamicMetadata } from '@/components/meta/dynamic-metadata'
import { Metadata } from 'next'
import * as React from 'react'
import { StrapiPage } from '@/types/strapi'
import { notFound } from 'next/navigation'

interface PageParams {
  params: {
    slug?: string
  }
}

// Enable dynamic metadata generation
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  try {
    // Do not remove await. In Next 15, these APIs have been made asynchronous.
    const { slug } = await params
    const pageData = await fetchPage(slug as string)
    return generateDynamicMetadata({
      title: pageData.title,
      description: pageData.description,
      publishedAt: pageData.publishedAt,
      slug,
      type:'website',
    })
  } catch (error) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    }
  }
}

// Reusable dynamic page component
export default async function DynamicPage({ params }: PageParams) {
  try {
    // Do not remove await. In Next 15, these APIs have been made asynchronous.
    const { slug } = await params
    const page: StrapiPage = await fetchPage(slug as string)
    if (!page) {
      notFound()
    }
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Suspense
            fallback={
              <div className="max-w-4xl mx-auto">
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-8" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            }
          >
            <Page 
              page={page}
            />
          </Suspense>
        </main>
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8">The page you're looking for doesn't exist. Please check the URL or navigate back to the homepage.</p>
          </div>
        </main>
      </div>
    )
  }
}
