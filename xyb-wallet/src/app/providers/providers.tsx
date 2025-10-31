import React, { useEffect, useMemo, useState } from 'react'
import { ConfigProvider, theme as antdTheme, App as AntdApp } from 'antd'
import enUS from 'antd/locale/en_US'
import etEE from 'antd/locale/et_EE'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ThemeCtx } from './useThemeMode'

type ThemeMode = 'light' | 'dark'

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  const [mode, setMode] = useState<ThemeMode>(
    (localStorage.getItem('theme') as ThemeMode) || (prefersDark ? 'dark' : 'light')
  )
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.dataset.theme = mode
    localStorage.setItem('theme', mode)
  }, [mode])

  useEffect(() => {
    document.documentElement.lang = i18n.language?.startsWith('et') ? 'et' : 'en'
  }, [i18n.language])

  const algorithm = mode === 'dark' ? [antdTheme.darkAlgorithm] : [antdTheme.defaultAlgorithm]
  const token = useMemo(() => ({ colorPrimary: mode === 'dark' ? '#60a5fa' : '#2563eb', borderRadius: 12 }), [mode])
  const antdLocale = i18n.language?.startsWith('et') ? etEE : enUS

  return (
    <ThemeCtx.Provider value={{ mode, toggle: () => setMode(m => (m === 'dark' ? 'light' : 'dark')) }}>
      <ConfigProvider theme={{ algorithm, token }} locale={antdLocale}>
        <QueryClientProvider client={queryClient}>
          <AntdApp>{children}</AntdApp>
        </QueryClientProvider>
      </ConfigProvider>
    </ThemeCtx.Provider>
  )
}
