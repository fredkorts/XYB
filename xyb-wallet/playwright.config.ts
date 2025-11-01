import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
  webServer: [
    {
      command: 'pnpm dev',
      port: 3000,
      reuseExistingServer: true,
      cwd: '../backend',
    },
    {
      command: 'pnpm dev',
      port: 5173,
      reuseExistingServer: true,
      cwd: '.',
    },
  ],
})
