'use client'
import { useUser } from '@clerk/nextjs'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin
} from 'lucide-react'
import Image from 'next/image'

export default function Profile() {
  const { user } = useUser()

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your personal information
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          {/* Profile Image Section */}
          <Card className="col-span-12 md:col-span-4 p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32">
                <Image
                  src={user?.imageUrl || '/placeholder-avatar.png'}
                  alt="Profile"
                  className="rounded-full object-cover"
                  fill
                  priority
                />
              </div>
            </div>
          </Card>

          {/* Profile Details Section */}
          <Card className="col-span-12 md:col-span-8 p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <Separator />

              <div className="grid gap-6">
                {/* Name Information */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">First Name</div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{user?.firstName || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Last Name</div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{user?.lastName || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Email Address</div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{user?.emailAddresses[0]?.emailAddress || 'N/A'}</span>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Phone Number</div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{user?.phoneNumbers[0]?.phoneNumber || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Location</div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">Philippines</span>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Account Created</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
