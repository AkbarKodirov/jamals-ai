import { useCallback, useEffect, useState } from 'react'

/* ---------------- types ---------------- */

export type TestMeta = { id: string; name: string; type: 'EBRW' | 'MATH'; modules: number; questions: number; minutesPerModule: number }
export type TestQuestion = {
  passage: string | null
  passageImage: string | null
  image: string | null
  question: string
  format: 'mc' | 'sa'
  options: string[]
  correct: number | null
  answer: string | null
}
export type Test = { id: string; name: string; type: 'EBRW' | 'MATH'; description: string; modules: { questions: TestQuestion[] }[] }

export type Mode = 'exam' | 'practice' | 'sprint'

export type AttemptAnswer = { module: number; index: number; value: string | null; correct: boolean; seconds: number; flagged: boolean }
export type Attempt = {
  id: string
  testId: string
  testName: string
  type: 'EBRW' | 'MATH'
  mode: Mode
  startedAt: number
  finishedAt: number
  answers: AttemptAnswer[]
  raw: number
  total: number
  scaled: number
}

export type VocabProgress = { ease: number; interval: number; reps: number; due: number; seen: number; correct: number }

export type Profile = { target: number; current: number | null; testDate: string | null }

type State = {
  profile: Profile
  attempts: Attempt[]
  vocab: Record<string, VocabProgress>
  activeDays: string[] // yyyy-mm-dd
  studySeconds: number
  practice: { solved: number; correct: number }
  blitzBest: number
  mistakes: { key: string; testId: string; module: number; index: number; addedAt: number; cleared: boolean }[]
  customWords: CustomWord[]
  saved: { key: string; testId: string; module: number; index: number; at: number }[]
  planDone: Record<string, boolean>
  drills: { at: number; subject: 'EBRW' | 'MATH'; n: number; correct: number; seconds: number }[]
}
export type CustomWord = { word: string; pos: 'adj' | 'verb' | 'noun' | 'adv'; def: string; ex: string; syn: string[]; level: 'mine'; addedAt: number }

const initial: State = {
  profile: { target: 1450, current: null, testDate: null },
  attempts: [],
  vocab: {},
  activeDays: [],
  studySeconds: 0,
  practice: { solved: 0, correct: 0 },
  blitzBest: 0,
  mistakes: [],
  customWords: [],
  saved: [],
  planDone: {},
  drills: [],
}

/* ---------------- tiny global store (per user, localStorage) ---------------- */

let uid = 'guest'
let state: State = initial
const listeners = new Set<() => void>()
const keyFor = (id: string) => `jamals.progress.${id}`

function load(id: string) {
  uid = id
  try {
    const raw = localStorage.getItem(keyFor(id))
    state = raw ? { ...initial, ...JSON.parse(raw) } : initial
  } catch {
    state = initial
  }
  listeners.forEach((l) => l())
}

function save() {
  try {
    localStorage.setItem(keyFor(uid), JSON.stringify(state))
  } catch {
    /* storage full or blocked */
  }
}

export function setStore(fn: (s: State) => State) {
  state = fn(state)
  save()
  listeners.forEach((l) => l())
}

export function useStore() {
  const [, force] = useState(0)
  useEffect(() => {
    const l = () => force((n) => n + 1)
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  }, [])
  return state
}

/** Loads this user's saved progress synchronously, before anything reads the store. */
export function useBindStore(userId: string | undefined) {
  if (userId && userId !== uid) load(userId)
}

/* ---------------- helpers ---------------- */

export const today = () => new Date().toISOString().slice(0, 10)

export function markActive(seconds = 0) {
  setStore((s) => ({
    ...s,
    activeDays: s.activeDays.includes(today()) ? s.activeDays : [...s.activeDays, today()].slice(-400),
    studySeconds: s.studySeconds + seconds,
  }))
}

export function streak(days: string[]) {
  const set = new Set(days)
  let n = 0
  const d = new Date()
  // today not done yet doesn't break the streak
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1)
  while (set.has(d.toISOString().slice(0, 10))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

/** Approximate Digital SAT section scale (200–800) from raw percentage. Practice estimate only. */
export function scaleSection(raw: number, total: number) {
  if (!total) return 200
  const p = raw / total
  // gentle S-curve that matches typical published conversions within ~30 points
  const curved = p < 0.5 ? p * 0.92 : 0.46 + (p - 0.5) * 1.08
  return Math.max(200, Math.min(800, Math.round((200 + curved * 600) / 10) * 10))
}

export function isCorrect(q: TestQuestion, value: string | null) {
  if (value == null || value === '') return false
  if (q.format === 'mc') return Number(value) === q.correct
  const norm = (s: string) => s.replace(/\s/g, '').replace(/^\+/, '')
  const toNum = (s: string) => {
    const t = norm(s)
    if (/^-?\d+\/\d+$/.test(t)) {
      const [a, b] = t.split('/').map(Number)
      return b ? a / b : NaN
    }
    return Number(t)
  }
  const accepted = (q.answer || '').split(/[|,;]| or /).map((a) => a.trim()).filter(Boolean)
  return accepted.some((a) => norm(a) === norm(value) || Math.abs(toNum(a) - toNum(value)) < 1e-4)
}

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps)
  useEffect(() => {
    let alive = true
    setData(null)
    setError(null)
    run()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(String(e.message || e)))
    return () => {
      alive = false
    }
  }, [run])
  return { data, error }
}

const testCache = new Map<string, Promise<Test>>()
export function loadTest(id: string) {
  if (!testCache.has(id)) testCache.set(id, fetch(`/tests/${id}.json`).then((r) => (r.ok ? r.json() : Promise.reject(new Error('Test not found')))))
  return testCache.get(id)!
}
export const loadIndex = () => fetch('/tests/index.json').then((r) => r.json() as Promise<TestMeta[]>)

export const stripHtml = (h: string | null) => (h || '').replace(/<li>/g, '\n• ').replace(/<[^>]+>/g, ' ').replace(/\s+\n/g, '\n').replace(/[ \t]+/g, ' ').trim()

export function toggleSaved(testId: string, module: number, index: number) {
  const key = `${testId}:${module}:${index}`
  setStore((s) => ({ ...s, saved: s.saved.some((x) => x.key === key) ? s.saved.filter((x) => x.key !== key) : [{ key, testId, module, index, at: Date.now() }, ...s.saved] }))
}
