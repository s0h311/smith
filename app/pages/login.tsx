import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/libs/Auth/authClient'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import noAuth from '../middlewares/noAuth'

export const Route = createFileRoute('/login')({
  component: LoginPage,
  beforeLoad: async ({ location }) => await noAuth(location.href),
})

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
})

function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    })

    if (error) {
      setError(error.message || 'An error occurred during login')
      return
    }

    if (data) {
      navigate({ to: '/' })
    }
  }

  return (
    <div className='flex min-h-screen w-full items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='email@example.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='********'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <div className='text-destructive text-sm'>{error}</div>}

              <Button
                type='submit'
                className='w-full'
              >
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex flex-col gap-2 items-center justify-center text-sm text-muted-foreground'>
          <Link
            to='/resetPassword'
            className='hover:underline'
          >
            Forgot password?
          </Link>
          <div className='flex gap-1'>
            <span>Don't have an account?</span>
            <Link
              to='/signup'
              className='text-primary hover:underline'
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
