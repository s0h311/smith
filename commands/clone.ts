import { cpSync, globSync, readFileSync, writeFileSync, lstatSync } from 'node:fs'
import { defineCommand } from 'citty'
import { normalize } from 'node:path'
import { consola } from 'consola'
import { randomBytes } from 'node:crypto'

export default defineCommand({
  meta: {
    name: 'clone',
    description: '',
  },
  run: async () => {
    const args = await collectArgs()

    clone(args)
  },
})

type Args = {
  name: string
}

async function collectArgs(): Promise<Args> {
  const name = await consola.prompt('App name', {
    type: 'text',
  })

  return {
    name,
  }
}

const APP_NAME_PLACEHOLDER = '<app-name>'
const ENV_DB_PASSWORD_PLACEHOLDER = '<db-password>'

function clone({ name }: Args): void {
  // COPY FILES
  const baseProjectPath = normalize(`${import.meta.dirname}/../base`)
  const newAppDir = normalize(`${process.cwd()}/${name}`)

  cpSync(baseProjectPath, newAppDir, { recursive: true })

  // SET APP NAME AND SECRETS

  const excludes = ['pnpm-lock.yaml', 'pnpm-workspace.yaml', 'node_modules']

  const files = globSync([`${newAppDir}/**/*`, `${newAppDir}/.*`]).filter((file) => {
    for (const exclude of excludes) {
      if (file.includes(exclude)) {
        return false
      }
    }

    return true
  })

  const dbPassword = randomBytes(12).toString('base64')

  for (const file of files) {
    if (lstatSync(file).isDirectory()) {
      continue
    }

    const content = readFileSync(file, { encoding: 'utf-8' })

    const newContent = content
      .replaceAll(APP_NAME_PLACEHOLDER, name)
      .replaceAll(ENV_DB_PASSWORD_PLACEHOLDER, dbPassword)

    writeFileSync(file, newContent, { encoding: 'utf-8' })
  }
}
