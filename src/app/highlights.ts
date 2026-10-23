import { useSyncExternalStore } from 'react'
import type { Highlight } from './store'

/**
 * Highlights last only for the current practice session or test, like Bluebook: they live in memory,
 * are never saved to the device or the cloud, and are wiped when a new session or test starts.
 */
let map: Record<string, Highlight[]> = {}
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
const EMPTY: Highlight[] = []

export function useHighlights(key: string) {
  return useSyncExternalStore(subscribe, () => map[key] ?? EMPTY)
}
export function setHighlights(key: string, list: Highlight[]) {
  map = { ...map, [key]: list }
  emit()
}
export function clearHighlights() {
  map = {}
  emit()
}
