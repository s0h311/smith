import { authClient } from '../libs/Auth/authClient'
import { redirect } from '@tanstack/react-router'

export default async function (locationHref: string): Promise<void | never> {
  const session = await authClient.getSession()

  if (!session.data) {
    throw redirect({
      to: '/login',
      search: {
        redirect: locationHref,
      },
    })
  }
}
