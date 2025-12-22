import { createFileRoute } from '@tanstack/react-router'
import noAuth from '../middlewares/noAuth'

export const Route = createFileRoute('/resetPassword')({
  component: ResetPasswordPage,
  beforeLoad: async ({ location }) => await noAuth(location.href),
})

function ResetPasswordPage() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <h1>Reset Password Page (Empty for now)</h1>
    </div>
  )
}
