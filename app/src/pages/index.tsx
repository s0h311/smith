import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <h1>Home Page</h1>
      <Link to='/login'>Login</Link>
    </>
  )
}
