import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePayments } from '../usePayments'
import { TestProviders } from '../../../test/utils'
import { seed } from '../../../test/msw/handlers'

describe('usePayments', () => {
  beforeEach(() => {
    // Reset state before each test
    seed({ balance: 100, payments: [] })
  })

  it('paginates results', async () => {
    const payments = Array.from({ length: 25 }).map((_, i) => ({
      id: String(i + 1),
      type: 'topup' as const,
      amount: 1,
      createdAt: new Date().toISOString(),
      status: 'completed' as const,
    }))
    seed({ payments })
    
    // Test first page
    const { result: firstPage } = renderHook(() => usePayments(10, 0), {
      wrapper: TestProviders,
    })
    await waitFor(() => expect(firstPage.current.isSuccess).toBe(true))
    expect(firstPage.current.data?.transactions).toHaveLength(10)
    expect(firstPage.current.data?.transactions?.[0]?.id).toBe('1')

    // Test second page 
    const { result: secondPage } = renderHook(() => usePayments(10, 10), {
      wrapper: TestProviders,
    })
    await waitFor(() => expect(secondPage.current.isSuccess).toBe(true))
    expect(secondPage.current.data?.transactions?.[0]?.id).toBe('11')
  })
})
