import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/passwordReset')({
  component: PasswordResetPage,
})

function PasswordResetPage() {
  return <div>Hello "/passwordReset"!</div>
}
