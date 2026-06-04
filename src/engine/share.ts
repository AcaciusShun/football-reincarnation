import type { Outcome } from './outcome'
import { endingById, legendById } from '../data'

/** Encode an outcome into a URL hash payload, e.g. "o=legend.messi". */
export const encodeOutcome = (o: Outcome): string =>
  o.kind === 'legend' ? `o=legend.${o.legend.id}` : `o=ending.${o.ending.id}`

/** Decode a shared hash back into an outcome, or null if not a valid one. */
export function decodeOutcome(hash: string): Outcome | null {
  const raw = new URLSearchParams(hash.replace(/^#/, '')).get('o')
  if (!raw) return null
  const [kind, id] = raw.split('.')
  if (kind === 'legend') {
    const legend = legendById(id)
    return legend ? { kind: 'legend', legend } : null
  }
  if (kind === 'ending') {
    const ending = endingById(id)
    return ending ? { kind: 'ending', ending } : null
  }
  return null
}
