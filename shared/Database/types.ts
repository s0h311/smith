import type { user } from './schemas/public'

export type User = typeof user.$inferSelect
export type UserInsert = typeof user.$inferInsert
