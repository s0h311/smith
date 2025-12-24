import { createFileRoute } from '@tanstack/react-router'
import { authClient } from '@/libs/Auth/authClient'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/dashboard/profile')({
  component: DashboardProfilePage,
})

function DashboardProfilePage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  if (!user) {
    return null
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center gap-4'>
        <Avatar className='h-20 w-20'>
          <AvatarImage
            src={user.image || ''}
            alt={user.name}
          />
          <AvatarFallback className='text-lg'>
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className='text-2xl font-bold'>{user.name}</h2>
          <p className='text-muted-foreground'>{user.email}</p>
        </div>
      </div>

      <Separator />

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic profile details.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                value={user.name}
                readOnly
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email Address</Label>
              <Input
                id='email'
                value={user.email}
                readOnly
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}