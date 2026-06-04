import type { Ending, GameState, Legend, Vec } from './types'
import { AXIS_IDS } from './axes'
import { ENDINGS, LEGENDS } from '../data'
import { condMet } from './story'

const dot = (a: Vec, b: Vec) => AXIS_IDS.reduce((s, k) => s + a[k] * b[k], 0)
const mag = (a: Vec) => Math.sqrt(AXIS_IDS.reduce((s, k) => s + a[k] * a[k], 0))
export const cosine = (a: Vec, b: Vec): number => {
  const m = mag(a) * mag(b)
  return m === 0 ? 0 : dot(a, b) / m
}

export type Outcome = { kind: 'legend'; legend: Legend } | { kind: 'ending'; ending: Ending }

/** Meme endings (extreme/troll paths) take priority; otherwise nearest legend in your role. */
export function resolveOutcome(s: GameState): Outcome {
  const ending = ENDINGS.find((e) => condMet(e.when, s))
  if (ending) return { kind: 'ending', ending }

  const pool = LEGENDS.filter((l) => l.role === s.role)
  const candidates = pool.length ? pool : LEGENDS
  let best = candidates[0]
  let bestScore = -Infinity
  for (const l of candidates) {
    const score = cosine(s.vec, l.vec)
    if (score > bestScore) {
      bestScore = score
      best = l
    }
  }
  return { kind: 'legend', legend: best }
}
