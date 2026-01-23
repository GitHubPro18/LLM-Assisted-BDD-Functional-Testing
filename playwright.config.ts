import {defineConfig} from '@playwright/test';
import {bddConfig} from './bdd/bdd.config.js';

export default defineConfig({
	//testDir : './bdd/steps',
  testDir : bddConfig,
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

/*
import { defineConfig } from '@playwright/test';
import { mergeTests } from 'playwright-bdd';
import bddConfig from './bdd.config.js';

export default mergeTests(
  defineConfig({
    use: {
      browserName: 'chromium',
      headless: true,
      trace: 'on-first-retry',
      actionTimeout: 10000,
    },
    retries: 0,
    timeout: 30000,
    reporter: [['list'], ['html', { open: 'never' }]],
  }),
  bddConfig
);
*/
