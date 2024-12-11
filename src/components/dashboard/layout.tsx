import { DashboardHeader } from "./header"
import { Sidebar } from "./sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="lg:relative lg:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col w-full">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
