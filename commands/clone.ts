import { cpSync, globSync, lstatSync, renameSync, existsSync } from 'node:fs'
import { defineCommand } from 'citty'
import { normalize } from 'node:path'
import { consola } from 'consola'
import { randomBytes } from 'node:crypto'
import { addNpmScript, appendToFileSync, replaceInFileSync } from './utils.ts'
import { execSync } from 'node:child_process'

const BASE_TEMPLATE_PATH = `${import.meta.dirname}/../templates/base`
const APP_NAME_PLACEHOLDER = '<app-name>'
const ENV_DB_PASSWORD_PLACEHOLDER = '<db-password>'
const MATRIX_PATH_PLACEHOLDER = '<path-to-matrix>'
const MATRIX_GITHUB_USERNAME_PLACEHOLDER = '<github-username>'
const DRIZZLE_ADDITIONAL_SCHEMAS_PLACEHOLDER = ' <additional-schemas>'

const AUTH_SCHEMA_DESTINATION = 'server/infrastructure/Database/schemas/auth.ts'
const AUTH_TEMPLATE_FILES = {
  [`${import.meta.dirname}/../templates/server/infrastructure/Auth`]: 'server/infrastructure/Auth',
  [`${import.meta.dirname}/../templates/server/infrastructure/Database/schemas/auth.ts`]: AUTH_SCHEMA_DESTINATION,
  [`${import.meta.dirname}/../templates/server/infrastructure/Mail`]: 'server/infrastructure/Mail',
  [`${import.meta.dirname}/../templates/server/infrastructure/Utils`]: 'server/infrastructure/Utils',
  [`${import.meta.dirname}/../templates/server/infrastructure/Utils`]: 'server/infrastructure/Utils',
  [`${import.meta.dirname}/../templates/app/libs/Auth`]: 'app/libs/Auth',
} as const

const AGENT_SKILLS = {
  'https://github.com/mattpocock/skills': ['grill-with-docs', 'grilling'],
} as const

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

  // CONFIGURE AUTH
  if (withAuth) {
    setupAuth(newAppDir)
  }

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
        {
          searchString: DRIZZLE_ADDITIONAL_SCHEMAS_PLACEHOLDER,
          replacement: withAuth ? `'${AUTH_SCHEMA_DESTINATION}',` : '',
        },
      ],
    })
  }

  // ADD AGENT SKILLS
  if (withSkills) {
    setupAgentSkills(newAppDir)
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

function setupAuth(newAppDir: string): void {
  for (const [template, destination] of Object.entries(AUTH_TEMPLATE_FILES)) {
    cpSync(template, `${newAppDir}/${destination}`, { recursive: true })
  }

  execSync('pnpm add better-auth pino react-email nodemailer', { cwd: newAppDir })
  execSync('pnpm add -D @react-email/ui pino-pretty', { cwd: newAppDir })

  const BETTER_AUTH_SECRET = randomBytes(32).toString('base64').replaceAll('+', 'a').replaceAll('/', 'z')

  const envVars = {
    BETTER_AUTH_SECRET,
    MAIL_SMTP_HOST: '',
    MAIL_SMTP_USER: '',
    MAIL_SMTP_PASSWORD: '',
    MAIL_FROM_NAME: '',
    MAIL_FROM_ADDRESS: '',
  }

  const appendingEnvLines = Object.entries(envVars)
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n')

  appendToFileSync({
    filePath: `${newAppDir}/.env`,
    appendingContent: appendingEnvLines,
    leadingLineBreak: true,
  })

  addNpmScript({
    name: 'gen:schema',
    cmd: 'pnpm dlx @better-auth/cli@latest generate --config ./server/infrastructure/Auth/auth.ts --output ./server/infrastructure/Database/schemas/auth.ts',
    packageJsonRoot: newAppDir,
  })
}

function setupAgentSkills(newAppDir: string): void {
  for (const [author, skills] of Object.entries(AGENT_SKILLS)) {
    const cmd = `pnpm dlx skills add ${author} --skill ${skills.join(' ')} -y`

    execSync(cmd, { cwd: newAppDir })
  }
}
