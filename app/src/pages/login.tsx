import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <>
      <h1>Login page</h1>
      <Link to='/'>Home</Link>
    </>
  )
}
