import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../Database/client.ts'
import { account, session, user, verification } from '../Database/schemas/auth.ts'
import { sendMailWithHtml } from '../Mail/client.ts'
import { getBaseUrl } from '../Utils/getBaseUrl.ts'
import { magicLink } from 'better-auth/plugins/magic-link'
import { betterAuth } from 'better-auth'
import { render } from 'react-email'
import { SignInEmail } from '../Mail/templates/SignInEmail.tsx'

export const SIGN_IN_LINK_TTL_MINUTES = 15

const baseUrl = getBaseUrl()

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  plugins: [
    magicLink({
      expiresIn: SIGN_IN_LINK_TTL_MINUTES * 60,

      sendMagicLink: async ({ email, url }) => {
        const html = await render(SignInEmail({ url, ttlInMinutes: SIGN_IN_LINK_TTL_MINUTES }))

        await sendMailWithHtml({
          recipients: [email],
          subject: 'Sign in to <app-name>',
          html,
        })
      },
    }),
  ],
  baseURL: baseUrl,
  trustedOrigins: () => [new URL(baseUrl).origin],
  user: {
    deleteUser: {
      enabled: true,
    },
  },
})
