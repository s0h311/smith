import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/resetPassword')({
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1>Reset Password Page (Empty for now)</h1>
    </div>
  )
}
