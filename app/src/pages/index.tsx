import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <h1>Home Page</h1>
      <Link to='/login'>Login</Link>
    </>
  )
}
