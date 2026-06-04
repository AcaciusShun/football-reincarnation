// Core types for 足坛投胎模拟器 — an interactive-narrative engine where choices
// nudge hidden trait axes and a role, then match you to a real legend (or a
// tongue-in-cheek "meme" ending).

/** The five hidden trait axes (role is tracked separately). */
export type AxisId = 'talent' | 'guile' | 'loyalty' | 'composure' | 'flair'

export type Vec = Record<AxisId, number>

export type Role = 'GK' | 'DF' | 'MF' | 'FW'

export type Locale = 'zh' | 'en'
export type LocalizedText = Record<Locale, string>

/** A gate used both to pick a chapter variant and to trigger a meme ending. */
export interface Condition {
  role?: Role
  /** requires this flag to be set */
  flag?: string
  /** requires this flag to NOT be set */
  notFlag?: string
  /** each axis must be >= the given value */
  axisMin?: Partial<Vec>
  /** each axis must be <= the given value */
  axisMax?: Partial<Vec>
}

export interface Choice {
  id: string
  label: LocalizedText
  /** Opt-in explanation (jargon + homage), revealed on demand and recapped at the end. */
  note?: LocalizedText
  /** Deeper real-world background for the move/moment — shown in the end recap. */
  background?: LocalizedText
  effect?: Partial<Vec>
  setRole?: Role
  setFlag?: string
}

export interface Variant {
  /** shown when this matches the current state; omit for the default variant (put it last). */
  when?: Condition
  text: LocalizedText
  choices: Choice[]
}

/** One beat of the story. `seq` orders chapters; `variants` gives light branching. */
export interface Chapter {
  id: string
  seq: number
  variants: Variant[]
}

/** A nickname; `hei` marks a 黑称 (roast nickname) — masked in the UI, revealed on demand. */
export interface Nickname {
  text: LocalizedText
  hei?: boolean
}

export interface Legend {
  id: string
  name: LocalizedText
  role: Role
  vec: Vec
  /** 称号 */
  title: LocalizedText
  /** 名场面 */
  moment: LocalizedText
  /** 梗台词 */
  quote: LocalizedText
  nicknames?: Nickname[]
  honors?: LocalizedText[]
}

export interface Ending {
  id: string
  title: LocalizedText
  blurb: LocalizedText
  quote: LocalizedText
  /** trigger; checked before legend matching */
  when: Condition
  /** higher wins when several endings match (default 0) */
  priority?: number
}

export interface GameState {
  vec: Vec
  role: Role | null
  flags: string[]
  step: number
  /** chosen choice ids */
  history: string[]
  /** homages of chosen choices (note + background), for the end-of-run recap */
  moments: Moment[]
}

/** A recreated moment, accumulated for the result-page recap. */
export interface Moment {
  note: LocalizedText
  background?: LocalizedText
}
