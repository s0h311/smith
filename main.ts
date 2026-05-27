import { defineCommand, runMain } from 'citty'

const main = defineCommand({
  meta: {
    name: 'smith',
    version: '0.0.1',
    description: 'AI optimized web app starter template powered by TanStack Start',
  },
  setup: () => 'Setup',
  cleanup: () => 'Clean up',
  subCommands: {
    clone: () => import('./commands/clone.ts').then((m) => m.default),
  },
})

runMain(main)
