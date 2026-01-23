import { defineBddConfig } from 'playwright-bdd';

export const bddConfig = defineBddConfig({
  features: ['bdd/features/**/*.feature'],
  steps: ['bdd/steps/**/*.ts'],
});
