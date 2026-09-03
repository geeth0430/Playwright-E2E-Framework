import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration
 * - Runs across Chromium, Firefox, WebKit
 * - Tracing on first retry so failures are debuggable
 * - Screenshots on failure, video retained on failure
 * - HTML report with API base URL wired up for request-based test setup
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if test.only is left in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit workers on CI, use default locally
  workers: process.env.CI ? 2 : undefined,

  // Reporter to use
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    process.env.CI ? ['github'] : ['dot'],
  ],

  // Shared settings for all projects below
  use: {
    baseURL: 'https://automationexercise.com',

    // Collect trace on first retry of a failed test
    trace: 'on-first-retry',

    // Screenshot only on failure
    screenshot: 'only-on-failure',

    // Retain video only on failure
    video: 'retain-on-failure',

    // Web-first assertion timeout
    actionTimeout: 15_000,
    navigationTimeout: 30_000,

    ignoreHTTPSErrors: true,
  },

  // Visual regression comparison tolerance
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    },
    timeout: 10_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
