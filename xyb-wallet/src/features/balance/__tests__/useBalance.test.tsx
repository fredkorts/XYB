import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBalance } from '../useBalance'
import { TestProviders } from '../../../test/utils'
import { seed } from '../../../test/msw/handlers'

describe('useBalance', () => {
  beforeEach(() => {
    // Reset state before each test
    seed({ balance: 100, payments: [] })
  })

  it('loads balance successfully', async () => {
    seed({ balance: 123 })
    const { result } = renderHook(() => useBalance(), { wrapper: TestProviders })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.balance).toBe(123)
  })
})
