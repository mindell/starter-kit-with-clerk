'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useDashboardStore } from '@/store/dashboard'
import {
  LayoutDashboard,
  Settings,
  Users,
  Box,
  CreditCard,
  MessageSquare,
  BarChart3,
  HelpCircle,
  Menu,
} from 'lucide-react'

const navigation = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    group: 'main',
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    group: 'main',
  },
  {
    name: 'Customers',
    href: '/dashboard/customers',
    icon: Users,
    group: 'main',
  },
  {
    name: 'Products',
    href: '/dashboard/products',
    icon: Box,
    group: 'services',
  },
  {
    name: 'Billing',
    href: '/dashboard/billing',
    icon: CreditCard,
    group: 'services',
  },
  {
    name: 'Support',
    href: '/dashboard/support',
    icon: MessageSquare,
    group: 'support',
  },
  {
    name: 'Help Center',
    href: '/dashboard/help',
    icon: HelpCircle,
    group: 'support',
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    group: 'settings',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useDashboardStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0",
        !sidebarOpen && "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-lg font-bold text-indigo-600">Starter Kit</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {['main', 'services', 'support', 'settings'].map((group) => (
            <div key={group} className="mb-4">
              <div className="mb-2 px-2 text-xs font-semibold uppercase text-gray-500">
                {group}
              </div>
              <div className="space-y-1">
                {navigation
                  .filter((item) => item.group === group)
                  .map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center rounded-lg px-2 py-1.5 text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </Link>
                    )
                  })}
              </div>
              {group !== 'settings' && (
                <Separator className="my-3" />
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}
