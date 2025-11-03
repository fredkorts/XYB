import { test, expect } from '@playwright/test'

test('user tops up successfully', async ({ page }) => {
  await page.goto('/')

  // Wait for app to load by checking for the main heading
  await expect(page.getByRole('heading', { name: /XYB Wallet/i })).toBeVisible()

  // Balance card should be visible
  await expect(page.getByText(/current balance|praegune jääk/i)).toBeVisible()

  // Wait for data to load
  await page.waitForTimeout(2000)
  
  // Get the current balance text (specifically from the balance card, not transactions)
  const balanceText = await page.locator('.ant-statistic-content-value').first().textContent()
  if (!balanceText) {
    throw new Error('Failed to read initial balance')
  }
  
  // Click the "Top up" button to open the top-up form
  await page.getByRole('button', { name: /top up/i }).click()
  
  // Remove debugging
  // Try to find the quick amount button with more flexible matching
  await page.getByRole('button', { name: /25/ }).click()
  
  // Click the submit button (should show "Confirm")
  await page.getByRole('button', { name: /confirm/i }).click()

  // Wait for balance to update and form to close
  await expect(page.locator('.ant-statistic-content-value').first()).not.toHaveText(balanceText)
  
  // Wait a bit more for the form to close and balance to stabilize
  await page.waitForTimeout(1000)

  // Verify the balance increased by 25
  const newBalanceText = await page.locator('.ant-statistic-content-value').first().textContent()
  if (!newBalanceText) {
    throw new Error('Failed to read new balance')
  }
  
  // Parse balances and verify increase
  const initialBalance = parseFloat(balanceText.replace(/[€,\s]/g, ''))
  const newBalance = parseFloat(newBalanceText.replace(/[€,\s]/g, ''))
  
  expect(newBalance).toBe(initialBalance + 25)
  
  // Verify the app is still functional after topup
  await expect(page.getByText(/current balance|praegune jääk/i)).toBeVisible()
  
  // Use a more specific selector for payment transaction cards (exclude balance card)
  await expect(page.locator('.ant-card').filter({ hasNotText: /current balance|praegune jääk/i }).filter({ hasText: /€/ })).toHaveCount(10)
  
  // Reload to ensure data persisted
  await page.reload()
  await expect(page.locator('.ant-statistic-content-value').first()).toHaveText(newBalanceText || '')
  await expect(page.locator('.ant-card').filter({ hasNotText: /current balance|praegune jääk/i }).filter({ hasText: /€/ })).toHaveCount(10)
})
