import { defineNitroConfig } from 'nitropack/config'

// https://nitro.build/config
export default defineNitroConfig({
  compatibilityDate: 'latest',
  srcDir: 'server',
  imports: false,
  serveStatic: true,
  publicAssets: [
    {
      baseURL: '/',
      dir: `${import.meta.dirname}/public`,
    },
  ],
})
