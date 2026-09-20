import { cpSync, globSync, lstatSync, renameSync, existsSync } from 'node:fs'
import { defineCommand } from 'citty'
import { normalize } from 'node:path'
import { consola } from 'consola'
import { randomBytes } from 'node:crypto'
import { replaceInFileSync } from './utils.ts'

const BASE_TEMPLATE_PATH = `${import.meta.dirname}/../templates/base`
const APP_NAME_PLACEHOLDER = '<app-name>'
const ENV_DB_PASSWORD_PLACEHOLDER = '<db-password>'
const MATRIX_PATH_PLACEHOLDER = '<path-to-matrix>'
const MATRIX_GITHUB_USERNAME_PLACEHOLDER = '<github-username>'

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
  githubUsername?: string
  withAuth: boolean
  withSkills: boolean
}

async function collectArgs(): Promise<Args> {
  const name = await consola.prompt('App name', {
    type: 'text',
  })

  const githubUsername = await consola.prompt('Github username', {
    type: 'text',
  })

  const withAuth = await consola.prompt('Should auth be included?', {
    type: 'confirm',
  })

  const withSkills = await consola.prompt('Should agent skills be included?', {
    type: 'confirm',
  })

  return {
    name,
    githubUsername,
    withAuth,
    withSkills,
  }
}

function clone({ name, githubUsername, withAuth, withSkills }: Args): void {
  // COPY FILES
  const baseTemplatePath = normalize(BASE_TEMPLATE_PATH)
  const newAppDir = normalize(`${process.cwd()}/${name}`)

  cpSync(baseTemplatePath, newAppDir, { recursive: true })

  const envExamplePath = `${newAppDir}/.env.example`
  const envPath = `${newAppDir}/.env`

  renameSync(envExamplePath, envPath)

  // SETUP MATRIX
  setupMatrix(newAppDir, githubUsername)

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

  const dbPassword = randomBytes(12).toString('base64').replaceAll('+', 'a').replaceAll('/', 'z')

  for (const file of files) {
    if (lstatSync(file).isDirectory()) {
      continue
    }

    if (file.includes('.matrix')) {
      console.log(file)
    }

    replaceInFileSync({
      filePath: file,
      replacements: [
        { searchString: APP_NAME_PLACEHOLDER, replacement: name },
        { searchString: ENV_DB_PASSWORD_PLACEHOLDER, replacement: dbPassword },
      ],
    })
  }

  // CONFIGURE AUTH
  if (withAuth) {
    // TODO
  }

  // ADD AGENT SKILLS
  if (withSkills) {
    // TODO
  }
}

function setupMatrix(newAppDir: string, githubUsername: Args['githubUsername']): void {
  const matrixPath = normalize(`${process.cwd()}/matrix`)
  const matrixFound = existsSync(matrixPath)

  if (!matrixFound) {
    consola.info('Replace <path-to-matrix> in package.json with actual path to Matrix')

    return
  }

  const packageJsonPath = `${newAppDir}/package.json`

  replaceInFileSync({
    filePath: packageJsonPath,
    replacements: [{ searchString: MATRIX_PATH_PLACEHOLDER, replacement: matrixPath }],
  })

  if (!githubUsername) {
    consola.info('Replace <github-username> in matrix.config.json with actual Github username')
    return
  }

  const matrixConfig = `${newAppDir}/matrix.config.json`

  replaceInFileSync({
    filePath: matrixConfig,
    replacements: [{ searchString: MATRIX_GITHUB_USERNAME_PLACEHOLDER, replacement: githubUsername }],
  })
}
