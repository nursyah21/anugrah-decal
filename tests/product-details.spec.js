import test, { expect } from '@playwright/test';

test.beforeEach('setup login', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/#/login')

  await page.locator('input[name="email"]').fill('admin@gmail.com')
  await page.locator('input[name="password"]').fill('password')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/#/dashboard')

});

test('crud merk', async ({ page }) => {

  await page.goto('/#/dashboard/product-details/merk')
  await expect(page.locator('h2', { hasText: /product details/i })).toBeVisible()

  // create merk
  await page.locator('button', { hasText: /add merk/i }).click()

  await page.locator('input[name="merk"]').fill('merk1')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'merk1' }).first()).toBeVisible()

  // update merk
  await page.locator('tr', { hasText: 'merk1' }).nth(0).locator('.btn-warning').click()

  await expect(page.locator('input[name="merk"]')).toHaveValue('merk1')
  await page.locator('input[name="merk"]').fill('merk1-update')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'merk1-update' }).first()).toBeVisible()

  // delete merk
  await page.locator('tr', { hasText: 'merk1-update' }).nth(0).locator('.btn-danger').click()

  await expect(page.locator('input[name="merk"]')).toHaveValue('merk1-update')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'merk1-update' }).first()).not.toBeVisible()
})

test('crud model', async ({ page }) => {
  await page.goto('./#/dashboard/product-details/model')

  await expect(page.locator('h2', { hasText: /product details/i })).toBeVisible()

  // create model
  await page.locator('button', { hasText: /add model/i }).click()
  await page.locator('select[name="merk"]').selectOption({ index: 1 })

  await page.locator('input[name="model"]').fill('model1')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'model1' }).first()).toBeVisible()

  // update model
  await page.locator('tr', { hasText: 'model1' }).nth(0).locator('.btn-warning').click()

  await expect(page.locator('input[name="model"]')).toHaveValue('model1')

  await page.locator('input[name="model"]').fill('model1-update')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'model1-update' }).first()).toBeVisible()

  // delete model
  await page.locator('tr', { hasText: 'model1-update' }).nth(0).locator('.btn-danger').click()

  await expect(page.locator('input[name="model"]')).toHaveValue('model1-update')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'model1-update' }).first()).not.toBeVisible()
})

test('crud kategori', async ({ page }) => {
  await page.goto('./#/dashboard/product-details/kategori')

  await expect(page.locator('h2', { hasText: /product details/i })).toBeVisible()

  // create kategori
  await page.locator('button', { hasText: /add kategori/i }).click()

  await page.locator('input[name="kategori"]').fill('kategori1')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'kategori1' }).first()).toBeVisible()

  // update kategori
  await page.locator('tr', { hasText: 'kategori1' }).nth(0).locator('.btn-warning').click()

  await expect(page.locator('input[name="kategori"]')).toHaveValue('kategori1')

  await page.locator('input[name="kategori"]').fill('kategori1-update')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'kategori1-update' }).first()).toBeVisible()

  // delete kategori
  await page.locator('tr', { hasText: 'kategori1-update' }).nth(0).locator('.btn-danger').click()

  await expect(page.locator('input[name="kategori"]')).toHaveValue('kategori1-update')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'kategori1-update' }).first()).not.toBeVisible()
})

test('crud bahan', async ({ page }) => {
  await page.goto('./#/dashboard/product-details/bahan')

  await expect(page.locator('h2', { hasText: /product details/i })).toBeVisible()

  // create bahan
  await page.locator('button', { hasText: /add bahan/i }).click()

  await page.locator('input[name="bahan"]').fill('bahan1')
  await page.locator('input[name="price"]').fill('10000')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'bahan1' }).first()).toBeVisible()

  // update bahan
  await page.locator('tr', { hasText: 'bahan1' }).nth(0).locator('.btn-warning').click()

  await expect(page.locator('input[name="bahan"]')).toHaveValue('bahan1')

  await page.locator('input[name="bahan"]').fill('bahan1-update')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'bahan1-update' }).first()).toBeVisible()

  // delete bahan
  await page.locator('tr', { hasText: 'bahan1-update' }).nth(0).locator('.btn-danger').click()

  await expect(page.locator('input[name="bahan"]')).toHaveValue('bahan1-update')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'bahan1-update' }).first()).not.toBeVisible()
})

test('crud laminating', async ({ page }) => {
  await page.goto('./#/dashboard/product-details/laminating')

  await expect(page.locator('h2', { hasText: /product details/i })).toBeVisible()

  // create laminating
  await page.locator('button', { hasText: /add laminating/i }).click()

  await page.locator('input[name="laminating"]').fill('laminating1')
  await page.locator('input[name="price"]').fill('10000')

  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'laminating1' }).first()).toBeVisible()

  // update laminating
  await page.locator('tr', { hasText: 'laminating1' }).nth(0).locator('.btn-warning').click()

  await expect(page.locator('input[name="laminating"]')).toHaveValue('laminating1')

  await page.locator('input[name="laminating"]').fill('laminating1-update')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'laminating1-update' }).first()).toBeVisible()

  // delete laminating
  await page.locator('tr', { hasText: 'laminating1-update' }).nth(0).locator('.btn-danger').click()

  await expect(page.locator('input[name="laminating"]')).toHaveValue('laminating1-update')
  await page.click('button[type="submit"]')
  await expect(page.locator('td', { hasText: 'laminating1-update' }).first()).not.toBeVisible()
})