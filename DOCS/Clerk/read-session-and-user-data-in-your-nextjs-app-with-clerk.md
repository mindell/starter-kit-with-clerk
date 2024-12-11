Read session and user data in your Next.js app with Clerk
=========================================================

Clerk provides a set of [hooks and helpers] that you can use to access the active session and user data in your Next.js application. Here are examples of how to use these helpers in both the client and server-side to get you started.

[Server-side]
-------------------------------------------------------------------------------------

### [App Router]

[`auth()`] and [`currentUser()`] are App Router-specific helpers that you can use inside of your Route Handlers, Middleware, Server Components, and Server Actions.

The `auth()` helper will return the [`Auth`] object of the currently active user. Now that request data is available in the global scope through Next.js's `headers()` and `cookies()` methods, passing the request object to Clerk is no longer required.

The `currentUser()` helper will return the [`Backend User`] object of the currently active user. This is helpful if you want to render information, like their first and last name, directly from the server.

Under the hood, `currentUser()` uses the [`clerkClient`] wrapper to make a call to the Backend API. This does count towards the [Backend API request rate limit]. This also uses `fetch()` so it is automatically deduped per request.

Note

Any requests from a Client Component to a Route Handler will read the session from cookies and will not need the token sent as a Bearer token.

Server components and actions

Route Handler

Route Handler w/ User Fetch

This example uses the new `auth()` helper to validate an authenticated user and the new `currentUser()` helper to access the `Backend API User` object for the authenticated user.

app/page.tsx

```
import { auth, currentUser } from '@clerk/nextjs/server'

export default async function Page() {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = await auth()

  if (userId) {
    // Query DB for user specific information or display assets only to signed in users
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser()
  // Use `user` to render user details or create UI elements
}
```

### [Pages Router]

API Route

API Route w/ User Fetch

getServerSideProps

For Next.js applications using the Pages Router, you can retrieve information about the user and their authentication state, or control access to some or all of your API routes by using the [`getAuth()`] helper. The `getAuth()` helper does require [Middleware].

pages/api/auth.ts

```
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req)

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // retrieve data from your database

  res.status(200).json({})
}
```

[Client-side]
-------------------------------------------------------------------------------------

### [`useAuth`]

The [`useAuth`] hook is a convenient way to access the current auth state. This hook provides the minimal information needed for data-loading and helper methods to manage the current active session.

example.tsx

```
'use client'
import { useAuth } from '@clerk/nextjs'

export default function Example() {
  const { isLoaded, userId, sessionId, getToken } = useAuth()

  // In case the user signs out while on the page.
  if (!isLoaded || !userId) {
    return null
  }

  return (
    <div>
      Hello, {userId} your current active session is {sessionId}
    </div>
  )
}
```

### [`useUser`]

The [`useUser`] hook is a convenient way to access the current user data where you need it. This hook provides the user data and helper methods to manage the current active session.

example.tsx

```
'use client'
import { useUser } from '@clerk/nextjs'

export default function Example() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded || !isSignedIn) {
    return null
  }

  return <div>Hello, {user.firstName} welcome to Clerk</div>
}
```

Feedback
--------
