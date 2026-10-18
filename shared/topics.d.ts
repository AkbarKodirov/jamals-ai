export type Topic = { section: 'EBRW' | 'MATH'; domain: string; name: string; code: string }
export const TOPICS: Record<'EBRW' | 'MATH', { domain: string; topics: [string, string][] }[]>
export const ALL_TOPICS: Topic[]
export const COARSE: Record<string, string>
export function coarseOf(topic: string, domain: string): string
