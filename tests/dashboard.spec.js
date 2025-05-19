import test, { expect } from '@playwright/test';
import './setupLogin'

test('view dashboard', async ({ page }) => {  
  await expect(page.locator('h2', { hasText: /dashboard/i })).toBeVisible()
})