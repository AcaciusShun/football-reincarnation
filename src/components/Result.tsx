import type { LocalizedText } from '../engine/types'
import type { Outcome } from '../engine/outcome'
import { encodeOutcome } from '../engine/share'
import { useI18n } from '../i18n'
import ShareBar from './ShareBar'

interface Props {
  outcome: Outcome
  moments: LocalizedText[]
  onRestart: () => void
}

export default function Result({ outcome, moments, onRestart }: Props) {
  const { t, tx, locale } = useI18n()

  const name = outcome.kind === 'legend' ? tx(outcome.legend.name) : tx(outcome.ending.title)
  const shareUrl = `${window.location.origin}${window.location.pathname}#${encodeOutcome(outcome)}`
  const shareText =
    locale === 'zh'
      ? `我投胎成了「${name}」！来足坛投胎模拟器看你会成为谁 ⚽️🔄`
      : `I was reborn as ${name}! Find out who you'd become ⚽️🔄`

  return (
    <section className="mx-auto max-w-xl px-6 py-12 text-center">
      <p className="text-xs uppercase tracking-widest text-neutral-400">{t('youBecame')}</p>

      {outcome.kind === 'legend' ? (
        <>
          <h1 className="mt-3 text-4xl font-extrabold text-pitch-dark">{tx(outcome.legend.name)}</h1>
          <div className="mt-3 inline-block rounded-full bg-gold/10 px-3 py-1 text-sm font-semibold text-gold">
            {tx(outcome.legend.title)}
          </div>

          <h2 className="mb-2 mt-8 text-xs font-semibold uppercase tracking-wide text-neutral-400">{t('moment')}</h2>
          <p className="text-neutral-600">{tx(outcome.legend.moment)}</p>

          <blockquote className="mt-6 border-l-4 border-pitch pl-4 text-left text-lg italic text-neutral-700">
            “{tx(outcome.legend.quote)}”
          </blockquote>

          {outcome.legend.honors && outcome.legend.honors.length > 0 && (
            <>
              <h2 className="mb-2 mt-8 text-xs font-semibold uppercase tracking-wide text-neutral-400">{t('honors')}</h2>
              <ul className="space-y-1 text-neutral-700">
                {outcome.legend.honors.map((h, i) => (
                  <li key={i}>🏆 {tx(h)}</li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <>
          <div className="mt-4 text-6xl">🤡</div>
          <h1 className="mt-3 text-4xl font-extrabold text-neutral-800">{tx(outcome.ending.title)}</h1>
          <p className="mt-6 text-neutral-600">{tx(outcome.ending.blurb)}</p>
          <blockquote className="mt-6 border-l-4 border-neutral-300 pl-4 text-left text-lg italic text-neutral-700">
            “{tx(outcome.ending.quote)}”
          </blockquote>
        </>
      )}

      {moments.length > 0 && (
        <div className="mt-10 rounded-2xl bg-neutral-100 p-5 text-left">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">{t('momentsTitle')}</h2>
          <ul className="space-y-2 text-sm text-neutral-600">
            {moments.map((m, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0">💡</span>
                <span>{tx(m)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ShareBar url={shareUrl} text={shareText} />

      <button
        onClick={onRestart}
        className="mt-6 rounded-full border-2 border-pitch px-6 py-2.5 font-semibold text-pitch transition hover:bg-pitch hover:text-white"
      >
        {t('restart')}
      </button>
    </section>
  )
}
