import { stripHtml, type TestQuestion } from './store'

export type ChatMsg = { role: 'user' | 'humo'; text: string }

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

export async function askHumo(messages: ChatMsg[], token: string | null, context?: string) {
  const d = await call<{ reply: string }>('/api/chat', { messages, context }, token)
  return d.reply
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
