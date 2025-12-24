import { createFileRoute } from '@tanstack/react-router'
import { authClient } from '@/libs/Auth/authClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHomePage,
})

function DashboardHomePage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {user?.name}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is your dashboard overview.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}