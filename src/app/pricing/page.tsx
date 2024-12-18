import { Metadata } from 'next'
import Header from '@/components/header'
import PricingClient from './pricing-client'

export const metadata: Metadata = {
  title: 'Pricing Plans | Your Service Name',
  description: 'Choose the perfect plan for your needs. We offer flexible pricing options to help you grow.',
  openGraph: {
    title: 'Pricing Plans | Your Service Name',
    description: 'Choose the perfect plan for your needs. We offer flexible pricing options to help you grow.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing Plans | Your Service Name',
    description: 'Choose the perfect plan for your needs. We offer flexible pricing options to help you grow.',
  }
}

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
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

      <div className="mx-auto max-w-2xl text-center lg:max-w-7xl mt-10">
        <h1 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h1>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          The right plan for your needs
        </p>
      </div>

      <PricingClient />
    </div>
  )
}
