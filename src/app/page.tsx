import Image from "next/image";
import { auth } from '@clerk/nextjs/server'
import Header from "@/components/header";
import Link from 'next/link'
import { SignInButton } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth()
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-indigo-600 mb-6">
            Modern Full-Stack Starter Kit
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Jump-start your project with our pre-configured template featuring Clerk Authentication, 
            Supabase Database, Strapi CMS, and Stripe Payments.
          </p>
          {!userId && (
            <div className="mt-8">
              <SignInButton mode="modal">
                <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
                  Get Started
                </button>
              </SignInButton>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Image src="/clerk.svg" alt="Clerk" width={24} height={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clerk Authentication</h3>
            <p className="text-gray-600">Secure user authentication and management with Clerk's modern auth solution.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Image src="/supabase.svg" alt="Supabase" width={24} height={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Supabase Database</h3>
            <p className="text-gray-600">Powerful PostgreSQL database with real-time capabilities and intuitive API.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
              <Image src="/strapi.svg" alt="Strapi" width={24} height={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Strapi CMS</h3>
            <p className="text-gray-600">Headless CMS for flexible content management and API creation.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Image src="/stripe.svg" alt="Stripe" width={24} height={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stripe Payments</h3>
            <p className="text-gray-600">Integrated payment processing for secure and seamless transactions.</p>
          </div>
        </div>

        {userId && (
          <div className="text-center bg-gradient-to-r from-indigo-500 to-violet-500 text-white p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
            <p className="mb-6">You're signed in and ready to go. Check out your dashboard to get started.</p>
            <Link href="/dashboard" className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Go to Dashboard
            </Link>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
          <Link href="/about" className="hover:text-indigo-600 transition-colors">
            About
          </Link>
          <a
            href="https://nextjs.org/learn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition-colors"
          >
            Learn Next.js
          </a>
          <a
            href="https://vercel.com/templates"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition-colors"
          >
            Templates
          </a>
        </div>
      </footer>
    </div>
  );
}
