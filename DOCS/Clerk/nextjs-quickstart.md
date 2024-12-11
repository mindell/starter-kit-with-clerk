Next.js Quickstart
==================

You will learn the following:
-----------------------------

-   Install `@clerk/nextjs`
-   Set your Clerk API keys
-   Add `clerkMiddleware()`
-   Add `<ClerkProvider />` and Clerk components

Before you start
----------------

-   [Set up a Clerk application]
-   [Create a Next.js application]

Example repositories
--------------------

-   [App router]
-   [Pages router]

### [Install `@clerk/nextjs`]

Clerk's [Next.js SDK] gives you access to prebuilt components, React hooks, and helpers to make user authentication easier.

Run the following command to install the SDK:

npm

yarn

pnpm

terminal

```
npm install @clerk/nextjs
```

### [Set your Clerk API keys]

Add the following keys to your `.env.local` file. These keys can always be retrieved from the [API Keys⁠] page of your Clerk Dashboard.

.env.local

Starter Template

Starter Template

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bW9yZS1yZWRiaXJkLTUuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_lwu5Dn4R8mm4E9pOMVnawOJ3mPFypK7JdqngvXr1uY
```

### [Add `clerkMiddleware()` to your app]

[`clerkMiddleware()`] grants you access to user authentication state throughout your app, on any route or page. It also allows you to protect specific routes from unauthenticated users. To add `clerkMiddleware()` to your app, follow these steps:

1.  Create a `middleware.ts` file.

    -   If you're using the `/src` directory, create `middleware.ts` in the `/src` directory.
    -   If you're not using the `/src` directory, create `middleware.ts` in the root directory alongside `.env.local`.

2.  In your `middleware.ts` file, export the `clerkMiddleware()` helper:

    middleware.ts

    ```
    import { clerkMiddleware } from '@clerk/nextjs/server'

    export default clerkMiddleware()

    export const config = {
      matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
      ],
    }
    ```

3.  By default, `clerkMiddleware()` will not protect any routes. All routes are public and you must opt-in to protection for routes. See the [`clerkMiddleware()` reference] to learn how to require authentication for specific routes.

### [Add `<ClerkProvider>` and Clerk components to your app]

The [`<ClerkProvider>`] component provides session and user context to Clerk's hooks and components. It's recommended to wrap your entire app at the entry point with `<ClerkProvider>` to make authentication globally accessible. See the [reference docs] for other configuration options.

You can control which content signed-in and signed-out users can see with Clerk's [prebuilt control components]. Create a header using the following components:

-   [`<SignedIn>`]: Children of this component can only be seen while signed in.
-   [`<SignedOut>`]: Children of this component can only be seen while signed out.
-   [`<UserButton />`]: Shows the signed-in user's avatar. Selecting it opens a dropdown menu with account management options.
-   [`<SignInButton />`]: An unstyled component that links to the sign-in page. In this example, since no props or [environment variables] are set for the sign-in URL, this component links to the [Account Portal sign-in page].

Select your preferred router to learn how to make this data available across your entire app:

App Router

Pages Router

app/layout.tsx

```
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
```

### [Create your first user]

Run your project with the following command:

npm

yarn

pnpm

terminal

```
npm run dev
```

Visit your app's homepage at [http://localhost:3000⁠]. Sign up to create your first user.
