// @ts-check
import { test, expect } from '@playwright/test';
import helper from './helper'

test.describe('Blog App ui LoginPage', () => {
  test.beforeEach(async ({ page }) => {
    await helper.resetAndCreateuser();
    await page.goto('/');
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  })
  test('login page have to have buttong', async ({ page }) => {
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  test('Login Success', async ({ page }) => {
    await page.getByLabel('Username').fill('root');
    await page.getByLabel('Password').fill('root');
    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByRole("heading", { name: "root is logged in" })).toBeVisible();
  });

  test('Login Failed wrong pass', async ({ page }) => {
    await page.getByLabel('Username').fill('root');
    await page.getByLabel('Password').fill('root22');
    await page.getByRole('button', { name: 'login' }).click();
    const errorDiv = page.locator('.error')
    await expect(errorDiv).toBeVisible();
  });

  test('Login Failed wrong username', async ({ page }) => {
    await page.getByLabel('Username').fill('root2');
    await page.getByLabel('Password').fill('root');
    await page.getByRole('button', { name: 'login' }).click();
    const errorDiv = page.locator('.error')
    await expect(errorDiv).toBeVisible();
  });
});