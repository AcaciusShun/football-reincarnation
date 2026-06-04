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
  const { tx } = useI18n()
  const variant = pickVariant(chapter, state)
  if (!variant) return null

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
          <button
            key={c.id}
            onClick={() => onChoose(c)}
            className="block w-full rounded-2xl border-2 border-neutral-200 px-5 py-4 text-left transition hover:border-pitch hover:bg-pitch/5 active:scale-[0.99]"
          >
            <div className="flex items-start gap-2">
              {c.tag && (
                <span className="mt-1 shrink-0 rounded-full bg-pitch/10 px-2 py-0.5 text-xs text-pitch-dark">{tx(c.tag)}</span>
              )}
              <div>
                <div className="text-lg text-neutral-900">{tx(c.label)}</div>
                {c.note && <div className="mt-0.5 text-xs text-neutral-400">{tx(c.note)}</div>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
