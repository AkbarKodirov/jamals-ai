// Sensai's memory of STEP12's own questions. Every question in the bank and the practice tests has a checked
// answer key (and most have a written explanation). When a student pastes or asks about one of them, Sensai is
// told the verified answer before it writes, so it can't get a STEP12 question wrong. No AI request is used:
// matching is plain word statistics over ~4,000 questions held in memory.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const L = ['A', 'B', 'C', 'D']
const STOP = new Set('the and for that with this which from what are was were has have had its their they them than then there these those into onto about would could should while when where who whom whose most more such also been being only other some each every both either neither will shall does did not but nor yet text choice completes logical precise word phrase best states main following conventions standard english'.split(' '))

const strip = (h) => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, ' ')
const words = (s) => (strip(s).toLowerCase().match(/[a-z0-9]+(?:'[a-z]+)?/g) || []).filter((w) => (w.length > 2 || /\d/.test(w)) && !STOP.has(w))

const items = []
function add(q, source) {
  const mc = q.options?.length === 4 && q.correct != null
  const key = mc ? `${L[q.correct]}) ${strip(q.options[q.correct]).trim()}` : q.answer != null ? String(q.answer) : null
  if (!key) return
  const body = [q.passage, q.question, ...(q.options || [])].join(' ')
  const toks = words(body)
  if (toks.length < 6) return // too short to match reliably (and image-only questions)
  items.push({ toks: new Set(toks), key, explanation: q.explanation ? strip(q.explanation).trim() : '', topic: q.topic || q.skill || '', difficulty: q.difficulty || '', source, section: q.section })
}

try {
  const bank = JSON.parse(readFileSync(join(ROOT, 'public/bank/bank.json'), 'utf8'))
  for (const q of bank) add(q, 'Question bank')
} catch (e) {
  console.warn('Sensai memory: bank not loaded', e.message)
}
try {
  const dir = join(ROOT, 'public/tests')
  const index = existsSync(join(dir, 'index.json')) ? JSON.parse(readFileSync(join(dir, 'index.json'), 'utf8')) : []
  for (const t of index) {
    const test = JSON.parse(readFileSync(join(dir, `${t.id}.json`), 'utf8'))
    test.modules.forEach((m, mi) => m.questions.forEach((q, qi) => add({ ...q, section: t.type }, `${t.name} (${t.type === 'MATH' ? 'Math' : 'R&W'}), module ${mi + 1}, question ${qi + 1}`)))
  }
} catch (e) {
  console.warn('Sensai memory: tests not loaded', e.message)
}

// inverse document frequency: rare words count more than common ones
const df = new Map()
for (const it of items) for (const w of it.toks) df.set(w, (df.get(w) || 0) + 1)
const idf = (w) => Math.log((items.length + 1) / ((df.get(w) || 0) + 1))
const byWord = new Map()
items.forEach((it, i) => {
  for (const w of it.toks) {
    if (!byWord.has(w)) byWord.set(w, [])
    byWord.get(w).push(i)
  }
})
console.log(`Sensai memory: ${items.length} checked questions indexed`)

/**
 * Finds the STEP12 question the student is asking about. Returns null unless the match is strong:
 * most of the student's (rare) words must appear in one stored question, and it must clearly beat the runner-up.
 */
export function findQuestion(text) {
  const q = [...new Set(words(text))]
  if (q.length < 8) return null
  const total = q.reduce((s, w) => s + idf(w), 0)
  const score = new Map()
  for (const w of q) for (const i of byWord.get(w) || []) score.set(i, (score.get(i) || 0) + idf(w))
  let best = -1
  let bestS = 0
  let second = 0
  for (const [i, s] of score) {
    if (s > bestS) {
      second = bestS
      bestS = s
      best = i
    } else if (s > second) second = s
  }
  if (best < 0) return null
  const it = items[best]
  const coverQuery = bestS / total
  const coverItem = bestS / [...it.toks].reduce((s, w) => s + idf(w), 0)
  if (coverQuery < 0.72 || coverItem < 0.35 || second > bestS * 0.85) return null
  return { ...it, confidence: Math.round(coverQuery * 100) }
}

/** System-prompt note for a matched question. */
export function memoryNote(m) {
  return `STEP12 VERIFIED QUESTION (never mention this note): the student's question is from STEP12's ${m.source}${m.topic ? ` — topic: ${m.topic}` : ''}${m.difficulty ? `, ${m.difficulty}` : ''}.
Its checked correct answer is ${m.key}.${m.explanation ? `\nTeacher's explanation: ${m.explanation.slice(0, 1200)}` : ''}
Your solution and final answer must reach exactly this answer. If the student only wants a hint or has not answered yet, do not reveal it; just make sure your hints lead there. Explain in your own words, following the student's preferred style, and end by suggesting more practice on "${m.topic || 'this skill'}" in the Question bank.`
}

export const memorySize = () => items.length
