import type { Chapter, Choice, Condition, GameState, Variant } from './types'
import { AXIS_IDS, zeroVec } from './axes'

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x))

export const initState = (): GameState => ({
  vec: zeroVec(),
  role: null,
  flags: [],
  step: 0,
  history: [],
  moments: [],
  flops: [],
})

/** Does the current state satisfy a condition? (used for variants and endings) */
export function condMet(c: Condition | undefined, s: GameState): boolean {
  if (!c) return true
  if (c.role && s.role !== c.role) return false
  if (c.flag && !s.flags.includes(c.flag)) return false
  if (c.notFlag && s.flags.includes(c.notFlag)) return false
  for (const id of AXIS_IDS) {
    if (c.axisMin?.[id] !== undefined && s.vec[id] < c.axisMin[id]!) return false
    if (c.axisMax?.[id] !== undefined && s.vec[id] > c.axisMax[id]!) return false
  }
  return true
}

/** First variant whose `when` matches; the default (no `when`) should be last. */
export const pickVariant = (chapter: Chapter, s: GameState): Variant | undefined =>
  chapter.variants.find((v) => condMet(v.when, s))

/** Apply a choice's effects and advance one step. Returns a new state. */
export function applyChoice(s: GameState, choice: Choice): GameState {
  const vec = { ...s.vec }
  for (const id of AXIS_IDS) {
    if (choice.effect?.[id] !== undefined) vec[id] = clamp(vec[id] + choice.effect[id]!, -2, 2)
  }
  return {
    vec,
    role: choice.setRole ?? s.role,
    flags: choice.setFlag && !s.flags.includes(choice.setFlag) ? [...s.flags, choice.setFlag] : s.flags,
    step: s.step + 1,
    history: [...s.history, choice.id],
    moments: choice.note
      ? [...s.moments, { note: choice.note, background: choice.background }]
      : s.moments,
    flops: choice.flop ? [...s.flops, choice.label] : s.flops,
  }
}
