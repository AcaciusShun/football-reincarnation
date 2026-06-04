import { useI18n } from '../i18n'

export default function Title({ onStart }: { onStart: () => void }) {
  const { t } = useI18n()
  return (
    <section className="mx-auto max-w-xl px-6 py-16 text-center">
      <div className="mb-4 text-6xl">⚽️🔄</div>
      <h1 className="text-4xl font-extrabold tracking-tight text-pitch-dark sm:text-5xl">{t('appName')}</h1>
      <p className="mt-3 text-lg font-medium text-neutral-700">{t('tagline')}</p>
      <p className="mt-4 text-neutral-500">{t('intro')}</p>
      <button
        onClick={onStart}
        className="mt-8 rounded-full bg-pitch px-10 py-3.5 text-lg font-semibold text-white shadow-lg shadow-pitch/30 transition hover:bg-pitch-dark active:scale-95"
      >
        {t('start')}
      </button>
    </section>
  )
}
