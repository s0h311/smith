import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/requestNewPassword')({
  component: RequestNewPasswordPage,
})

function RequestNewPasswordPage() {
  return <div>Hello "/requestNewPassword"!</div>
}
