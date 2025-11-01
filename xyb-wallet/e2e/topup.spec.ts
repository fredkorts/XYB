import { test, expect } from '@playwright/test'

test('user tops up successfully', async ({ page }) => {
  await page.goto('/')

  // Wait for app to load by checking for the main heading
  await expect(page.getByRole('heading', { name: /XYB Wallet/i })).toBeVisible()

  // Balance card should be visible
  await expect(page.getByText(/wallet balance|rahakoti jääk/i)).toBeVisible()

  // Wait for data to load
  await page.waitForTimeout(2000)
  
  // Get the current balance text (specifically from the balance card, not transactions)
  const balanceText = await page.locator('.ant-statistic-content-value').textContent()
  console.log('Current balance text:', balanceText)
  
  // Enter amount and submit
  const amountLabel = /top-up amount|laadimise summa/i
  await page.getByLabel(amountLabel).fill('25')
  await page.getByRole('button', { name: /top up|lae raha/i }).click()

  // Wait for the submission to complete
  await page.waitForTimeout(3000)

  // Verify the balance changed (should be different from initial)
  const newBalanceText = await page.locator('.ant-statistic-content-value').textContent()
  console.log('New balance text:', newBalanceText)
  
  expect(newBalanceText).not.toBe(balanceText) // Balance should have changed
  
  // Verify the app is still functional after topup
  await expect(page.getByText(/wallet balance|rahakoti jääk/i)).toBeVisible()
  await expect(page.locator('.payment-card')).toHaveCount(10)
  
  // Reload to ensure data persisted
  await page.reload()
  await expect(page.locator('.ant-statistic-content-value')).toHaveText(newBalanceText || '')
  await expect(page.locator('.payment-card')).toHaveCount(10)
})
