import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: [
    // './shared/Database/schemas/auth.ts',
    './shared/Database/schemas/public.ts',
  ],
  out: './server/libs/Database/migrations',
  dbCredentials: {
    url: process.env.DATABASE_CONNECTION_STRING!,
  },
})
