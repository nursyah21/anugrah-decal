import test, { expect } from '@playwright/test';

test.beforeEach('setup login', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/#/login')

  await page.locator('input[name="email"]').fill('admin@gmail.com')
  await page.locator('input[name="password"]').fill('password')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/#/dashboard')

});

test('crud customer', async ({ page }) => {

  await page.goto('/#/dashboard/customer')
  await expect(page.locator('h2', { hasText: /customer/i })).toBeVisible()

  // create customer
  await page.locator('button', { hasText: /add customer/i }).click()
  
  await page.locator('input[name="nama"]').fill('customer1')
  await page.locator('input[name="no_hp"]').fill('081234567890')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'customer1' }).first()).toBeVisible()

  // update customer
  await page.locator('tr', { hasText: 'customer1' }).nth(0).locator('.btn-warning').click()

  await expect(page.locator('input[name="nama"]')).toHaveValue('customer1')
  await page.locator('input[name="nama"]').fill('customer1-update')

  await expect(page.locator('input[name="no_hp"]')).toHaveValue('081234567890')
  await page.locator('input[name="no_hp"]').fill('081234567891')

  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'customer1-update' }).first()).toBeVisible()

  // delete customer
  await page.locator('tr', { hasText: 'customer1-update' }).nth(0).locator('.btn-danger').click()

  await expect(page.locator('input[name="nama"]')).toHaveValue('customer1-update')
  await expect(page.locator('input[name="no_hp"]')).toHaveValue('081234567891')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'customer1-update' }).first()).not.toBeVisible()
})