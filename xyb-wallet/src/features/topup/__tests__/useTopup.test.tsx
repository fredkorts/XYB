import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useTopup } from '../useTopup'
import { useBalance } from '../../balance/useBalance'
import { usePayments } from '../../payments/usePayments'
import { server } from '../../../test/msw/server'
import { http, HttpResponse, delay } from 'msw'
import { seed } from '../../../test/msw/handlers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../test/i18n-test'
import React from 'react'

describe('useTopup optimistic updates', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    // Reset state before each test
    seed({ balance: 100, payments: [] })
    // Create fresh QueryClient for each test
    queryClient = new QueryClient({ 
      defaultOptions: { 
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
  })
  it('optimistically updates balance and payments, then reconciles on success', async () => {
    seed({ balance: 100, payments: [] })

    const SharedWrapper = ({ children }: { children: React.ReactNode }) => (
      <ConfigProvider locale={enUS}>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </I18nextProvider>
      </ConfigProvider>
    )

    const balanceHook = renderHook(() => useBalance(), { wrapper: SharedWrapper })
    const paymentsHook = renderHook(() => usePayments(10, 0), { wrapper: SharedWrapper })
    await waitFor(() => expect(balanceHook.result.current.isSuccess).toBe(true))
    await waitFor(() => expect(paymentsHook.result.current.isSuccess).toBe(true))

    // Verify initial state
    expect(balanceHook.result.current.data?.balance).toBe(100)
    expect(paymentsHook.result.current.data?.transactions.length).toBe(0)

    const topupHook = renderHook(() => useTopup(), { wrapper: SharedWrapper })

    await act(async () => {
      await topupHook.result.current.mutateAsync(25)
    })

    // After mutation settles, both queries should show updated data
    await waitFor(() => {
      expect(balanceHook.result.current.data?.balance).toBe(125)
    })

    await waitFor(() => {
      expect(paymentsHook.result.current.data?.transactions.length).toBe(1)
    })

    expect(paymentsHook.result.current.data?.transactions[0].type).toBe('topup')
  })

  it('rolls back on error', async () => {
    seed({ balance: 100, payments: [] })

    const SharedWrapper = ({ children }: { children: React.ReactNode }) => (
      <ConfigProvider locale={enUS}>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </I18nextProvider>
      </ConfigProvider>
    )

    const balanceHook = renderHook(() => useBalance(), { wrapper: SharedWrapper })
    const paymentsHook = renderHook(() => usePayments(10, 0), { wrapper: SharedWrapper })
    await waitFor(() => expect(balanceHook.result.current.isSuccess).toBe(true))
    await waitFor(() => expect(paymentsHook.result.current.isSuccess).toBe(true))

    const topupHook = renderHook(() => useTopup(), { wrapper: SharedWrapper })

    server.use(
      http.post('http://localhost:3000/account/topup', async () => {
        await delay(150)
        return new HttpResponse('Nope', { status: 400 })
      })
    )

    await act(async () => {
      await expect(topupHook.result.current.mutateAsync(25)).rejects.toBeTruthy()
    })

    // Rolled back
    expect(balanceHook.result.current.data?.balance).toBe(100)
    expect(paymentsHook.result.current.data?.transactions.length).toBe(0)
  })
})
