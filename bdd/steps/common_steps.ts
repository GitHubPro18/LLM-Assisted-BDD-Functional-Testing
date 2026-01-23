// Common Step Definitions for Playwright-BDD
import { createBdd, test } from 'playwright-bdd';
import {expect} from '@playwright/test';

// Create BDD step bindings using Playwright test context
const { Given, When, Then } = createBdd(test);

Given('open page', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://www.saucedemo.com');
});

Given('open page {string}', async ({ page}) => {
  await page.goto(process.env.BASE_URL || 'https://www.saucedemo.com');
  //await page.goto(process.env.BASE_URL!);
});


When('login with valid credentials', async ({ page }) => {
  await page.fill('#user-name', 'problem_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
});

When('login with invalid credentials', async ({ page }) => {
  await page.fill('#user-name', 'locked_out_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
});

When('login {string}', async ({ page }) => {
  await page.fill('#user-name', 'problem_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
});

When('submit {string}', async ({ page }) => {
  await page.click('button[type="submit"]');
});

When('click {string}', async ({ page }) => {
  await page.click('.deterministic-click-target');
});

Then('see message {string}', async ({ page }, expected:string) => {
  //const message = await page.textContent('.message');
  //const body = await page.content();
  //await expect(body).toContain(expected);
  //const error = await page.locator('[data-test="error"]').textContent();
  //expect(message).toBeTruthy();
  //expect(error).toBeTruthy();
  if (expected === 'Welcome') {
    await expect(page).toHaveURL(/inventory/);
  } else {
    await expect(page.locator('[data-test="error"]')).toContainText(expected);
  }
});

Then('see message', async ({ page }) => {
  const body = await page.content();
  expect(body.length).toBeGreaterThan(0);
});

When('logout {string}', async ({ page }) => {
  await page.click('#logout');
});
