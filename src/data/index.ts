import type { Chapter, Ending, Legend } from '../engine/types'

// The scenario bank. Adding content is drop-in: a new JSON file in any folder is
// auto-loaded — no central list to edit.
const chapterModules = import.meta.glob('./chapters/*.json', { eager: true, import: 'default' })
const legendModules = import.meta.glob('./legends/*.json', { eager: true, import: 'default' })
const endingModules = import.meta.glob('./endings/*.json', { eager: true, import: 'default' })

/** Chapters in play order (by `seq`). */
export const CHAPTERS: Chapter[] = (Object.values(chapterModules) as Chapter[]).sort((a, b) => a.seq - b.seq)

export const LEGENDS: Legend[] = Object.values(legendModules) as Legend[]

/** Endings, highest `priority` first (so the most specific meme ending wins). */
export const ENDINGS: Ending[] = (Object.values(endingModules) as Ending[]).sort(
  (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
)

export const legendById = (id: string): Legend | undefined => LEGENDS.find((l) => l.id === id)
export const endingById = (id: string): Ending | undefined => ENDINGS.find((e) => e.id === id)
