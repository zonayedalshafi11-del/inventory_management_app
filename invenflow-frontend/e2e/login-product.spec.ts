/**
 * Playwright E2E scenario (requires backend at localhost:8081 and `ng serve`).
 *
 * Install: npm i -D @playwright/test
 * Run: npx playwright test e2e/login-product.spec.ts
 */
import { test, expect } from '@playwright/test';

test.describe('InvenFlow E2E', () => {
  test('login and create product', async ({ page }) => {
    await page.goto('http://localhost:4200/login');

    await page.getByLabel('Email').fill('admin@invenflow.com');
    await page.getByLabel('Password').fill('admin');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/dashboard/);

    await page.getByRole('link', { name: 'Products' }).click();
    await page.getByRole('button', { name: 'Add Product' }).click();

    await page.getByLabel('Name').fill('E2E Test Product');
    await page.getByLabel('SKU').fill('E2E-001');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('E2E Test Product')).toBeVisible();
  });
});
