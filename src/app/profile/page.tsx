import { currentUser } from '@clerk/nextjs/server'
import Header from '../components/Header'

export default async function Profile() {
  const user = await currentUser()
  
  if (!user) return null

  return (
    <div>
      <Header />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            <p className="text-lg">
              <span className="font-semibold">Name:</span>{' '}
              {user.firstName} {user.lastName}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Email:</span>{' '}
              {user.emailAddresses[0]?.emailAddress}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Created:</span>{' '}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
