import { useState } from 'react'
import type { LocalizedText, Nickname } from '../engine/types'
import type { Outcome } from '../engine/outcome'
import { encodeOutcome } from '../engine/share'
import { useI18n } from '../i18n'
import ShareBar from './ShareBar'

interface Props {
  outcome: Outcome
  moments: { note: LocalizedText; background?: LocalizedText }[]
  flops: LocalizedText[]
  onRestart: () => void
}

/** A 黑称 (roast nickname): a black-on-black bar; the text turns white on hover. */
function HeiNick({ text, label, tooltip }: { text: string; label: string; tooltip: string }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <span className="inline-flex items-center gap-1">
      <button
        type="button"
        title={tooltip}
        onClick={() => setRevealed((r) => !r)}
        className={`cursor-help rounded bg-black px-2 py-0.5 text-sm font-medium transition-colors hover:text-white ${
          revealed ? 'text-white' : 'text-black'
        }`}
      >
        {text}
      </button>
      <span className="rounded bg-neutral-400/40 px-1 text-[10px] font-semibold text-neutral-600">{label}</span>
    </span>
  )
}

function Nicknames({ nicknames }: { nicknames: Nickname[] }) {
  const { t, tx } = useI18n()
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {nicknames.map((n, i) =>
        n.hei ? (
          <HeiNick key={i} text={tx(n.text)} label={t('heiTag')} tooltip={t('heiTooltip')} />
        ) : (
          <span key={i} className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600">
            {tx(n.text)}
          </span>
        ),
      )}
    </div>
  )
}

export default function Result({ outcome, moments, flops, onRestart }: Props) {
  const { t, tx, locale } = useI18n()

  const name = outcome.kind === 'legend' ? tx(outcome.legend.name) : tx(outcome.ending.title)
  const shareUrl = `${window.location.origin}${window.location.pathname}#${encodeOutcome(outcome)}`
  const shareText =
    locale === 'zh'
      ? `我投胎成了「${name}」！来足坛投胎模拟器看你会成为谁 ⚽️ #足坛投胎模拟器`
      : `I was reborn as ${name}! Find out who you'd become ⚽️ #FootballReincarnation`

  return (
    <section className="mx-auto max-w-xl px-6 py-12 text-center">
      <p className="text-xs uppercase tracking-widest text-neutral-400">{t('youBecame')}</p>

      {outcome.kind === 'legend' ? (
        <>
          <h1 className="mt-3 text-4xl font-extrabold text-pitch-dark">{tx(outcome.legend.name)}</h1>
          <div className="mt-3 inline-block rounded-full bg-gold/10 px-3 py-1 text-sm font-semibold text-gold">
            {tx(outcome.legend.title)}
          </div>

          {outcome.legend.nicknames && outcome.legend.nicknames.length > 0 && (
            <Nicknames nicknames={outcome.legend.nicknames} />
          )}

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
          <ul className="space-y-3">
            {moments.map((m, i) => (
              <li key={i}>
                <div className="flex gap-2 text-sm">
                  <span className="shrink-0">💡</span>
                  <span className="font-medium text-neutral-700">{tx(m.note)}</span>
                </div>
                {m.background && <p className="mt-1 pl-6 text-xs leading-relaxed text-neutral-500">{tx(m.background)}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {flops.length > 0 && (
        <div className="mt-6 rounded-2xl bg-amber-50 p-5 text-left ring-1 ring-amber-100">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-amber-700/70">{t('flopsTitle')}</h2>
          <ul className="space-y-2 text-sm text-neutral-600">
            {flops.map((f, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0">🤦</span>
                <span>{tx(f)}</span>
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
