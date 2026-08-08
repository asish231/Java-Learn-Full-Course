const { defineConfig, devices } = require('@playwright/test');
const os = require('os');
const path = require('path');

const storeFile = path.join(os.tmpdir(), 'java-dsa-studio-e2e-state.json');

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45000,
  outputDir: path.join(os.tmpdir(), 'java-dsa-studio-playwright-results'),
  globalTeardown: require.resolve('./tools/e2e-teardown'),
  use: {
    baseURL: 'http://127.0.0.1:3512',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome']
  },
  webServer: {
    command: 'node server.js',
    url: 'http://127.0.0.1:3512/api/bootstrap',
    timeout: 30000,
    reuseExistingServer: false,
    env: { PORT: '3512', DSA_STORE_FILE: storeFile, MERCURY_DISABLED: '1' }
  }
});