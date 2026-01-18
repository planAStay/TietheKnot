/**
 * Sri Lankan Provinces - Service Area Options
 * These are the provinces that vendors can select to indicate their service coverage
 */
export const PROVINCES = [
  'Islandwide (Sri Lanka)',
  'Western province',
  'Central Province',
  'Southern Province',
  'Northern Province',
  'Eastern Province',
  'North Western Province',
  'North Central Province',
  'Uva Province',
  'Sabaragamuwa Province',
] as const

export type Province = typeof PROVINCES[number]

