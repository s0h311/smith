import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../Database/client'
import { account, session, user, verification } from '~~/shared/Database/schemas/auth'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
})
