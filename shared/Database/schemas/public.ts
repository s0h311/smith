import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at', {
    mode: 'date',
    precision: 2,
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
})
