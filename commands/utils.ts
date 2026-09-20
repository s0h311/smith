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
