import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/profile')({
  component: DashboardProfilePage,
})

function DashboardProfilePage() {
  return <div>Hello "/dashboard/profile"!</div>
}
