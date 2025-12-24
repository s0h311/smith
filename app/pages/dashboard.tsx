import { Outlet, createFileRoute } from '@tanstack/react-router'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { DashboardSidebar } from '../components/DashboardSidebar'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full">
        <div className="p-4">
          <SidebarTrigger />
        </div>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}