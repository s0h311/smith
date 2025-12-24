import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../Database/client'
import { account, session, user, verification } from '../../../shared/Database/schemas/auth'
import { sendMail } from '../Mail/client'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await sendMail({
        recipients: [user.email],
        subject: 'Reset your password',
        text: `Click the link to reset your password: ${url}`,
      })
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`)
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        await sendMail({
          recipients: [user.email],
          subject: 'Approve email change',
          text: `Click the link to approve the change to ${newEmail}: ${url}`,
        })
      },
    },
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
  trustedOrigins: () => {
    if (process.env.ENVIRONMENT === 'development') {
      return ['http://localhost:3000']
    }

    return ['*.rock-science.com']
  },
})
