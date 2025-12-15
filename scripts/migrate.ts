import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db, connection } from '../server/libs/Database/client.ts'

await migrate(db, {
  migrationsFolder: './server/libs/Database/migrations',
})

await connection.end()
