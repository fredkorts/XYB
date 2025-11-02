import { createContext, useContext } from 'react'

type ThemeMode = 'light' | 'dark'

export const ThemeCtx = createContext<{ mode: ThemeMode; toggle: () => void } | null>(null)

export const useThemeMode = () => useContext(ThemeCtx)!
