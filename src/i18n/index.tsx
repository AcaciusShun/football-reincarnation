import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Locale, LocalizedText } from '../engine/types'
import zh from './zh.json'
import en from './en.json'

type Dict = Record<string, string>
const DICTS: Record<Locale, Dict> = { zh, en }

interface I18nValue {
  locale: Locale
  toggle: () => void
  t: (key: string) => string
  tx: (text?: LocalizedText) => string
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('zh')
  const value = useMemo<I18nValue>(
    () => ({
      locale,
      toggle: () => setLocale((l) => (l === 'zh' ? 'en' : 'zh')),
      t: (key) => DICTS[locale][key] ?? key,
      // fall back to the other language so single-language data still renders
      tx: (text) => (text ? text[locale] || text.en || text.zh || '' : ''),
    }),
    [locale],
  )
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider>')
  return ctx
}
