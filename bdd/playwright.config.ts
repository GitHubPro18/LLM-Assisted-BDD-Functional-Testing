import {defineConfig} from '@playwright/test';

export default defineConfig({
	use: {
		browserName: 'chromium',
		headless: true,
		trace: 'on-first-retry',
		actionTimeout: 10000, // deterministic timeout in ms
	},
	retries: 0,
	timeout: 30000, // test-level timeout in ms
	reporter: [['list'], ['html', { open: 'never' }]],
});