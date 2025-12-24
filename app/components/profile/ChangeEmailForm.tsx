import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/libs/Auth/authClient'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  newEmail: z.string().email({
    message: 'Please enter a valid email address.',
  }),
})

export function ChangeEmailForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newEmail: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setStatus('loading')
    setErrorMessage('')
    try {
      const { error } = await authClient.changeEmail({
        newEmail: values.newEmail,
        callbackURL: '/dashboard/profile',
      })

      if (error) {
         setStatus('error')
         setErrorMessage(error.message || 'Failed to update email')
      } else {
        setStatus('success')
        form.reset()
      }
    } catch {
      setStatus('error')
      setErrorMessage('An unexpected error occurred')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Email</CardTitle>
        <CardDescription>
          Update your email address. You may need to verify your new email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {status === 'error' && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
            {status === 'success' && (
              <p className="text-sm text-green-500">
                Email update initiated. Please check your inbox if verification is required.
              </p>
            )}
            <Button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Updating...' : 'Update Email'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
