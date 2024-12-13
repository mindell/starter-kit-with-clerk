import { DashboardProvider } from '@/components/providers/dashboard-provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  )
}
