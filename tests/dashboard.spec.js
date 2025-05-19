import test, { expect } from '@playwright/test';

test.beforeEach('setup login', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/#/login')

  await page.locator('input[name="email"]').fill('admin@gmail.com')
  await page.locator('input[name="password"]').fill('password')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/#/dashboard')

})

test('view dashboard', async ({ page }) => {  
  await expect(page.locator('h2', { hasText: /dashboard/i })).toBeVisible()
})