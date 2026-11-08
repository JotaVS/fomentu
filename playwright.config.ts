import { defineConfig } from '@playwright/test';
const slowMo = Number(process.env.PW_SLOWMO || 0);
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:5199',
    screenshot: 'on',
    trace: 'retain-on-failure',
    launchOptions: { slowMo },
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  webServer: { command: 'yarn dev --host 127.0.0.1 --port 5199 --strictPort', port: 5199, reuseExistingServer: false },
});
