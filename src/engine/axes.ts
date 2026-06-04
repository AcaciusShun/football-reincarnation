import type { AxisId, LocalizedText, Vec } from './types'

export interface AxisDef {
  id: AxisId
  neg: LocalizedText
  pos: LocalizedText
}

export const AXES: AxisDef[] = [
  { id: 'talent', neg: { zh: '苦练', en: 'Grind' }, pos: { zh: '天赋', en: 'Gift' } },
  { id: 'guile', neg: { zh: '磊落', en: 'Honest' }, pos: { zh: '狡黠', en: 'Sly' } },
  { id: 'loyalty', neg: { zh: '浪子', en: 'Nomad' }, pos: { zh: '忠诚', en: 'Loyal' } },
  { id: 'composure', neg: { zh: '玻璃心', en: 'Fragile' }, pos: { zh: '大心脏', en: 'Ice' } },
  { id: 'flair', neg: { zh: '谦逊', en: 'Humble' }, pos: { zh: '张扬', en: 'Showman' } },
]

export const AXIS_IDS: AxisId[] = AXES.map((a) => a.id)

export const zeroVec = (): Vec => ({ talent: 0, guile: 0, loyalty: 0, composure: 0, flair: 0 })
