import React, { useEffect, useMemo, useState } from 'react'
import { ConfigProvider, theme as antdTheme, App as AntdApp } from 'antd'
import enUS from 'antd/locale/en_US'
import etEE from 'antd/locale/et_EE'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ThemeCtx } from './useThemeMode'

type ThemeMode = 'light' | 'dark'

const queryClient = new QueryClient()

const FALLBACK_TOKENS: Record<ThemeMode, { colorPrimary: string; colorError: string; colorSuccess: string }> = {
  light: { colorPrimary: '#00b894', colorError: '#d63031', colorSuccess: '#00b894' },
  dark: { colorPrimary: '#0e997d', colorError: '#ce4725', colorSuccess: '#2bd4af' },
}

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const stored = localStorage.getItem('theme') as ThemeMode | null
  if (stored) {
    return stored
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readCssTokens(mode: ThemeMode) {
  if (typeof window === 'undefined') {
    return FALLBACK_TOKENS[mode]
  }

  const rootStyles = getComputedStyle(document.documentElement)
  const read = (name: string) => rootStyles.getPropertyValue(name).trim()

  const colorPrimary = read('--color-primary') || FALLBACK_TOKENS[mode].colorPrimary
  const colorError = read('--color-cancel') || FALLBACK_TOKENS[mode].colorError
  const colorSuccess = read('--color-positive') || FALLBACK_TOKENS[mode].colorSuccess

  return { colorPrimary, colorError, colorSuccess }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()
  const [mode, setMode] = useState<ThemeMode>(() => {
    const initial = getInitialMode()
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = initial
    }
    return initial
  })

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = mode
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', mode)
    }
  }, [mode])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = i18n.language?.startsWith('et') ? 'et' : 'en'
    }
  }, [i18n.language])

  const algorithm = mode === 'dark' ? [antdTheme.darkAlgorithm] : [antdTheme.defaultAlgorithm]
  const token = useMemo(() => ({
    ...readCssTokens(mode),
    borderRadius: 12,
  }), [mode])
  const antdLocale = i18n.language?.startsWith('et') ? etEE : enUS

  return (
    <ThemeCtx.Provider value={{ mode, toggle: () => setMode(m => (m === 'dark' ? 'light' : 'dark')) }}>
      <ConfigProvider theme={{ algorithm, token }} locale={antdLocale}>
        <QueryClientProvider client={queryClient}>
          <AntdApp 
            notification={{
              placement: 'topRight',
              stack: { threshold: 3 },
              showProgress: true,
              pauseOnHover: true,
            }}
          >
            {children}
          </AntdApp>
        </QueryClientProvider>
      </ConfigProvider>
    </ThemeCtx.Provider>
  )
}
