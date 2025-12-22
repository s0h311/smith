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

const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
  error: z.string().optional(),
})

export const Route = createFileRoute('/resetPassword')({
  component: ResetPasswordPage,
  validateSearch: (search) => resetPasswordSearchSchema.parse(search),
  beforeLoad: async ({ location }) => await noAuth(location.href),
})

const requestSchema = z.object({
  email: z.string().email(),
})

const resetSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

function ResetPasswordPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(search.error || null)

  const isResetting = !!search.token

  // Request Form
  const requestForm = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: '' },
  })

  // Reset Form
  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onRequestSubmit(values: z.infer<typeof requestSchema>) {
    setError(null)
    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: '/resetPassword',
    })

    if (error) {
      setError(error.message || 'An error occurred. Please try again.')
      return
    }

    setIsSubmitted(true)
  }

  async function onResetSubmit(values: z.infer<typeof resetSchema>) {
    setError(null)
    if (!search.token) return

    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token: search.token,
    })

    if (error) {
      setError(error.message || 'Failed to reset password.')
      return
    }

    navigate({ to: '/login' })
  }

  if (isResetting) {
    return (
      <div className='flex min-h-screen w-full items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>Set New Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...resetForm}>
              <form
                onSubmit={resetForm.handleSubmit(onResetSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={resetForm.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='******'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetForm.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='******'
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
                  Reset Password
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className='flex justify-center text-sm text-muted-foreground'>
            <Link
              to='/login'
              className='hover:underline'
            >
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen w-full items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            {isSubmitted ? 'Check your email' : 'Enter your email to reset your password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className='text-center space-y-4'>
              <p className='text-sm text-muted-foreground'>We have sent a password reset link to your email address.</p>
            </div>
          ) : (
            <Form {...requestForm}>
              <form
                onSubmit={requestForm.handleSubmit(onRequestSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={requestForm.control}
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

                {error && <div className='text-destructive text-sm'>{error}</div>}

                <Button
                  type='submit'
                  className='w-full'
                >
                  Send Reset Link
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className='flex justify-center text-sm text-muted-foreground'>
          <Link
            to='/login'
            className='hover:underline'
          >
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
