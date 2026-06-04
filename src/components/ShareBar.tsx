import { useState } from 'react'
import { useI18n } from '../i18n'

const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

export default function ShareBar({ url, text }: { url: string; text: string }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable — ignore
    }
  }

  function shareX() {
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(intent, '_blank', 'noopener,noreferrer')
  }

  async function shareNative() {
    try {
      await navigator.share({ text, url })
    } catch {
      // cancelled — ignore
    }
  }

  const btn =
    'rounded-full border border-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-pitch hover:text-pitch'

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <span className="text-sm font-semibold text-neutral-500">{t('shareTitle')}</span>
      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={copy} className={btn}>
          {copied ? t('shareCopied') : t('shareCopy')}
        </button>
        <button onClick={shareX} className={btn}>
          {t('shareX')}
        </button>
        {hasNativeShare && (
          <button onClick={shareNative} className={btn}>
            {t('shareNative')}
          </button>
        )}
      </div>
    </div>
  )
}
