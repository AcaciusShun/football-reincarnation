import { useEffect, useState } from 'react'
import type { Chapter, Choice, GameState } from '../engine/types'
import { pickVariant } from '../engine/story'
import { useI18n } from '../i18n'

interface Props {
  chapter: Chapter
  state: GameState
  total: number
  onChoose: (choice: Choice) => void
}

export default function Scene({ chapter, state, total, onChoose }: Props) {
  const { t, tx } = useI18n()
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  // reset the "what's this?" reveals whenever the scene changes
  useEffect(() => setRevealed(new Set()), [state.step])

  const variant = pickVariant(chapter, state)
  if (!variant) return null

  const toggle = (id: string) =>
    setRevealed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <section className="mx-auto max-w-xl px-6 py-10">
      <div className="mb-2 text-xs tabular-nums text-neutral-400">
        {state.step + 1} / {total}
      </div>
      <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-neutral-200">
        <div className="h-full bg-pitch transition-all" style={{ width: `${((state.step + 1) / total) * 100}%` }} />
      </div>

      <h2 className="mb-7 text-2xl font-bold leading-relaxed text-neutral-900">{tx(variant.text)}</h2>

      <div className="space-y-3">
        {variant.choices.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border-2 border-neutral-200 transition hover:border-pitch">
            <button
              onClick={() => onChoose(c)}
              className={`block w-full px-5 pt-4 text-left text-lg text-neutral-900 transition hover:bg-pitch/5 ${
                c.note ? 'pb-2' : 'pb-4'
              }`}
            >
              {tx(c.label)}
            </button>
            {c.note && (
              <button
                onClick={() => toggle(c.id)}
                className="block w-full px-5 pb-3 text-left text-xs leading-relaxed text-neutral-400 transition hover:text-pitch"
              >
                {revealed.has(c.id) ? `💡 ${tx(c.note)}` : t('whatsThis')}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
