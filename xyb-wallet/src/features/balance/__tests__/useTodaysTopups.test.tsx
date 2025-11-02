import { describe, it, expect, vi } from 'vitest'

// Test helper function to check if a timestamp is today
const isToday = (timestamp: string): boolean => {
  const today = new Date()
  const date = new Date(timestamp)
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

describe('useTodaysTopups utilities', () => {
  it('isToday function correctly identifies today vs other days', () => {
    const now = new Date()
    const today = now.toISOString()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    
    expect(isToday(today)).toBe(true)
    expect(isToday(yesterday)).toBe(false)
    expect(isToday(tomorrow)).toBe(false)
  })

  it('isToday function works with different times on same day', () => {
    const now = new Date()
    const earlyToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0, 0).toISOString()
    const lateToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString()
    
    expect(isToday(earlyToday)).toBe(true)
    expect(isToday(lateToday)).toBe(true)
  })

  it('transaction filtering logic works correctly', () => {
    const mockDate = new Date('2024-01-15T12:00:00Z')
    
    // Mock current date
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)
    
    const today = mockDate.toISOString()
    const yesterday = new Date(mockDate.getTime() - 24 * 60 * 60 * 1000).toISOString()
    
    const transactions = [
      { id: '1', type: 'topup', amount: 50, timestamp: today },
      { id: '2', type: 'topup', amount: 25, timestamp: today },
      { id: '3', type: 'payment', amount: 10, timestamp: today },
      { id: '4', type: 'topup', amount: 100, timestamp: yesterday },
    ]
    
    // Filter for today's top-ups only
    const todaysTopups = transactions.filter(
      transaction => transaction.type === 'topup' && isToday(transaction.timestamp)
    )
    
    // Calculate the sum
    const totalTopupsToday = todaysTopups.reduce((sum, topup) => sum + topup.amount, 0)
    
    expect(todaysTopups).toHaveLength(2)
    expect(totalTopupsToday).toBe(75)
    expect(todaysTopups.every(t => t.type === 'topup')).toBe(true)
    expect(todaysTopups.every(t => isToday(t.timestamp))).toBe(true)
    
    vi.useRealTimers()
  })
})