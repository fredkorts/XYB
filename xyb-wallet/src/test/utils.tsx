/* eslint-disable react-refresh/only-export-components */
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n-test'
import React from 'react'

// Create a fresh client for each render
export function TestProviders({ children }: { children: React.ReactNode }) {
  const client = React.useMemo(() => new QueryClient({ 
    defaultOptions: { 
      queries: { retry: false },
      mutations: { retry: false }
    }
  }), [])
  
  return (
    <ConfigProvider locale={enUS}>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </I18nextProvider>
    </ConfigProvider>
  )
}

export const renderWithProviders = (ui: React.ReactElement) => {
  return render(<TestProviders>{ui}</TestProviders>)
}