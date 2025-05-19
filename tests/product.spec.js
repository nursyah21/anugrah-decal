import test, { expect } from '@playwright/test';

test.beforeEach('setup login', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/#/login')

  await page.locator('input[name="email"]').fill('admin@gmail.com')
  await page.locator('input[name="password"]').fill('password')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/#/dashboard')

})

test('crud product', async ({ page }) => {

    await page.goto('/#/dashboard/product')
    await expect(page.locator('h2', { hasText: /product/i })).toBeVisible()

    // create product
    await page.locator('button', { hasText: /add product/i }).click()
    await page.locator('input[name="product"]').fill('product1')
    await page.locator('input[name="image"]').setInputFiles('./tests/assets/pic1.jpg')
    await page.locator('textarea[name="description"]').fill('deskripsi-product1')
    await page.locator('select[name="category"]').selectOption({ index: 1 })
    await page.locator('select[name="merk"]').selectOption({ index: 1 })
    await page.locator('select[name="model"]').selectOption({ index: 1 })

    await page.locator('select[name="model"]').selectOption({ index: 1 })
    await page.locator('input[name="price"]').fill('10000')

    await page.click('button[type="submit"]')
    await expect(page.locator('td', { hasText: 'product1' }).first()).toBeVisible()

    // update product
    await page.locator('tr', { hasText: 'product1' }).first().locator('.btn-warning').click()
    await expect(page.locator('input[name="product"]')).toHaveValue('product1')
    await page.locator('input[name="product"]').fill('product1-update')

    await page.click('button[type="submit"]')
    await expect(page.locator('td', { hasText: 'product1-update' }).first()).toBeVisible()

    // delete product
    await page.locator('tr', { hasText: 'product1-update' }).first().locator('.btn-danger').click()
    await expect(page.locator('input[name="product"]')).toHaveValue('product1-update')

    await page.click('button[type="submit"]')
    await expect(page.locator('td', { hasText: 'product1-update' }).first()).not.toBeVisible()

})