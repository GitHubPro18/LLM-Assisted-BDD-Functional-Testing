// Common Step Definitions for Playwright-BDD
import { createBdd, test } from 'playwright-bdd';
import {expect} from '@playwright/test';

// Create BDD step bindings using Playwright test context
const { Given, When, Then } = createBdd(test);

Given('open page', async ({ page }) => {
  //await page.goto(process.env.BASE_URL || 'https://www.saucedemo.com');
  await page.goto(process.env.BASE_URL!);
});

When('login', async ({ page }) => {
  await page.fill('#username', 'problem_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
});

When('submit', async ({ page }) => {
  await page.click('button[type="submit"]');
});

When('click', async ({ page }) => {
  await page.click('.deterministic-click-target');
});

Then('see message', async ({ page }) => {
  //const message = await page.textContent('.message');
  const error = await page.locator('[data-test="error"]').textContent();
  //expect(message).toBeTruthy();
  expect(error).toBeTruthy();
});

When('logout', async ({ page }) => {
  await page.click('#logout');
});
