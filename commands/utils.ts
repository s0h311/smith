import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

export function replaceInFileSync({
  filePath,
  replacements,
}: {
  filePath: string
  replacements: { searchString: string; replacement: string }[]
}): void {
  const content = readFileSync(filePath, { encoding: 'utf-8' })

  let newContent = content

  for (const { searchString, replacement } of replacements) {
    newContent = newContent.replaceAll(searchString, replacement)
  }

  writeFileSync(filePath, newContent, { encoding: 'utf-8' })
}

export function appendToFileSync({
  filePath,
  appendingContent,
  leadingLineBreak,
}: {
  filePath: string
  appendingContent: string
  leadingLineBreak: boolean
}): void {
  const content = readFileSync(filePath, { encoding: 'utf-8' })

  const newContent = `${content}${leadingLineBreak ? '\n' : ''}${appendingContent}`

  writeFileSync(filePath, newContent, { encoding: 'utf-8' })
}

export function addNpmScript({
  name,
  cmd,
  packageJsonRoot,
}: {
  name: string
  cmd: string
  packageJsonRoot: string
}): void {
  execSync(`npm pkg set scripts.${name}="${cmd}"`, { cwd: packageJsonRoot })
}
