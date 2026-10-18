import { stripHtml, type ChatMsg, type Profile, type TestQuestion, type WeekPlan } from './store'
import type { DesmosScreen } from '../../shared/desmos-render.js'

export type { ChatMsg }

export class HumoOffline extends Error {}

async function call<T>(url: string, body: unknown, token: string | null): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
  } catch {
    throw new HumoOffline('The Humo server is not running. Start it with npm run dev:all.')
  }
  const data = await res.json().catch(() => ({}))
  if (res.status === 503) throw new HumoOffline(data.error || 'Humo needs a Gemini API key.')
  if (!res.ok) throw new Error(data.error || 'Humo could not answer. Try again.')
  return data as T
}

export async function askHumo(messages: ChatMsg[], token: string | null, context?: string, space?: 'humo' | 'desmos') {
  // text (and question photos) go to the model; Desmos screens and plans stay on this device
  const slim = messages.map((m) => ({ role: m.role, text: m.text, ...(m.images?.length ? { images: m.images } : {}) }))
  return call<{ reply: string; desmos?: DesmosScreen[]; plan?: WeekPlan | null }>('/api/chat', { messages: slim, context, space }, token)
}

export type Similar = { passage: string; question: string; options: string[]; correct: number; explanation: string }
export function similarQuestion(q: TestQuestion, skill: string, section: string, token: string | null) {
  const p = questionPayload(q, null)
  return call<Similar>('/api/similar', { passage: p.passage, question: p.question, options: p.options, skill, section }, token)
}

export type DesmosSolve = { text: string; desmos: DesmosScreen[] }
const solves = new Map<string, Promise<DesmosSolve>>()
/** Humo's Desmos walkthrough + checked Desmos screen. Bank questions by id, any other question by payload. */
export function desmosSolve(body: { bankId: string } | ({ id: string } & ReturnType<typeof questionPayload>), token: string | null) {
  const key = 'bankId' in body ? body.bankId : body.id
  if (!solves.has(key)) {
    const p = call<DesmosSolve>('/api/desmos/solve', body, token)
    p.catch(() => solves.delete(key))
    solves.set(key, p)
  }
  return solves.get(key)!
}

export function editPlan(plan: WeekPlan, profile: Profile, instruction: string, token: string | null) {
  return call<{ plan: WeekPlan; note: string }>('/api/plan', { plan, profile, instruction }, token)
}

export function questionPayload(q: TestQuestion, chosen: string | null) {
  const letters = ['A', 'B', 'C', 'D']
  return {
    passage: stripHtml(q.passage),
    question: q.question,
    options: q.options.map((o, i) => `${letters[i]}) ${stripHtml(o)}`),
    correct: q.format === 'mc' ? letters[q.correct ?? 0] : q.answer,
    chosen: chosen == null || chosen === '' ? null : q.format === 'mc' ? letters[Number(chosen)] : chosen,
    format: q.format,
  }
}

const memo = new Map<string, Promise<string>>()
/** One explanation per question, cached on the server for every student and in memory here. */
export function explain(testId: string, key: string, q: TestQuestion, token: string | null) {
  const id = `${testId}:${key}`
  if (!memo.has(id)) {
    const p = call<{ explanation: string }>('/api/explain', { id, ...questionPayload(q, null) }, token).then((d) => d.explanation)
    p.catch(() => memo.delete(id))
    memo.set(id, p)
  }
  return memo.get(id)!
}
