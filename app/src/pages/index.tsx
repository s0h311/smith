import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { authClient } from '@/libs/Auth/authClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()

  if (isPending) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!session) {
     return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
           <h1 className="text-2xl font-bold">Welcome</h1>
           <p className="text-muted-foreground">Please login to view your profile.</p>
           <Button asChild>
              <Link to="/login">Login</Link>
           </Button>
        </div>
     )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 gap-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
           <div className="flex flex-col space-y-1">
             <span className="text-sm font-medium text-muted-foreground">ID</span>
             <span className="font-mono text-sm break-all">{session.user.id}</span>
           </div>
           <div className="flex flex-col space-y-1">
             <span className="text-sm font-medium text-muted-foreground">Name</span>
             <span>{session.user.name}</span>
           </div>
           <div className="flex flex-col space-y-1">
             <span className="text-sm font-medium text-muted-foreground">Email</span>
             <span>{session.user.email}</span>
           </div>
        </CardContent>
      </Card>
      
      <Button 
        variant="outline" 
        onClick={async () => {
            await authClient.signOut()
            navigate({ to: '/login' })
        }}
      >
        Logout
      </Button>
    </div>
  )
}