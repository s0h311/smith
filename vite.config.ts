import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  root: `${import.meta.dirname}`,
  build: {
    emptyOutDir: true,
    outDir: `${import.meta.dirname}/dist`,
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: resolve(import.meta.dirname, './app/pages'),
      generatedRouteTree: resolve(import.meta.dirname, './app/routeTree.gen.ts'),
    }),
    nitro(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './app'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
})
