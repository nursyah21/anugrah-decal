import test, { expect } from '@playwright/test';

test.beforeEach('setup login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/#/login')

    await page.locator('input[name="email"]').fill('admin@gmail.com')
    await page.locator('input[name="password"]').fill('password')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/#/dashboard')

});

test('crud transaksi', async ({ page }) => {

    await page.goto('/#/dashboard/transaksi')
    await expect(page.locator('h2', { hasText: /transaksi/i })).toBeVisible()

    const nProduct = await page.locator('btn-warning').count()

    // create transaksi
    await page.locator('button', { hasText: /add transaksi/i }).click()
    await page.locator('select[name="customer"]').selectOption({ index: 1 })
    await page.locator('select[name="status_pembayaran"]').selectOption({ index: 1 })
    await page.locator('select[name="status_pengerjaan"]').selectOption({ index: 1 })

    await page.locator('select[name="listProduct.0.product"]').selectOption({ index: 1 })
    await page.locator('select[name="listProduct.0.bahan"]').selectOption({ index: 1 })
    await page.locator('select[name="listProduct.0.laminating"]').selectOption({ index: 1 })
    await page.locator('input[name="listProduct.0.qty"]').fill('100')

    await page.click('button[type="submit"]')

    // update product
    await page.locator('.btn-warning').nth(0).click()
    await page.locator('select[name="status_pembayaran"]').selectOption({ index: 2 })
    await page.locator('select[name="status_pengerjaan"]').selectOption({ index: 3 })

    await page.click('button[type="submit"]')

    // delete product
    await page.locator('.btn-danger').nth(0).click()

    await page.click('button[type="submit"]')
    expect(await page.locator('btn-warning').count()).toEqual(nProduct)

})