// Adds verified original questions to the Question Bank without calling Gemini.
// Input: scripts/cache/bank-additions.json, an array of
//   {topic, difficulty, passage, question, options, correct, answer, explanation, figure}
// Every item there has already passed a second, independent solve that matched its key.
// Items already in the bank (same id) are skipped, so the script can be re-run safely.
// Usage: node scripts/add-bank.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { ALL_TOPICS, coarseOf } from '../shared/topics.js'
import { drawFigure } from './figure.mjs'

const ROOT = new URL('..', import.meta.url).pathname
const BANK = join(ROOT, 'public/bank/bank.json')
const bank = JSON.parse(readFileSync(BANK, 'utf8'))
const adds = JSON.parse(readFileSync(join(ROOT, 'scripts/cache/bank-additions.json'), 'utf8'))
const have = new Set(bank.map((q) => q.id))
mkdirSync(join(ROOT, 'public/qimg'), { recursive: true })

let added = 0
for (const g of adds) {
  const t = ALL_TOPICS.find((x) => x.name === g.topic)
  if (!t) throw new Error(`unknown topic: ${g.topic}`)
  const id = `j-${createHash('sha1').update(g.question + (g.passage || '')).digest('hex').slice(0, 10)}`
  if (have.has(id)) continue
  let image = null
  if (g.figure?.shapes?.length) {
    const name = `fig-${id.slice(2)}.svg`
    writeFileSync(join(ROOT, 'public/qimg', name), drawFigure(g.figure))
    image = `/qimg/${name}`
  }
  const mc = g.options?.length === 4
  bank.push({
    id,
    set: 'jamals',
    setName: 'Jamals originals',
    section: t.section,
    domain: t.domain,
    topic: t.name,
    skill: coarseOf(t.name, t.domain),
    difficulty: g.difficulty,
    passage: g.passage || null,
    passageImage: null,
    image,
    question: g.question,
    format: mc ? 'mc' : 'sa',
    options: mc ? g.options : [],
    correct: mc ? g.correct : null,
    answer: mc ? null : String(g.answer),
    explanation: g.explanation,
  })
  have.add(id)
  added++
}
writeFileSync(BANK, JSON.stringify(bank))
console.log(`added ${added}, bank now ${bank.length}`)
