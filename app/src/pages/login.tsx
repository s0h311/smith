import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <h1>Login page</h1>
      <Link to='/'>Home</Link>
    </>
  )
}
