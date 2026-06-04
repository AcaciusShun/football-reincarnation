import { useI18n } from '../i18n'

export default function LangToggle() {
  const { locale, toggle } = useI18n()
  return (
    <button
      onClick={toggle}
      className="rounded-full border border-white/30 px-3 py-1 text-sm font-medium text-white/90 transition hover:bg-white/10"
      aria-label="Toggle language"
    >
      {locale === 'zh' ? 'EN' : '中文'}
    </button>
  )
}
