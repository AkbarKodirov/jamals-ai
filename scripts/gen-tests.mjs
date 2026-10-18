// Writes ORIGINAL full-length Math practice tests (2 modules × 22) and the missing second R&W module of
// Practice Test 13, on the Digital SAT blueprint. Every question is solved again independently without the
// key; only questions where the solver agrees with the key are kept. Cached in scripts/cache/tests-gen.json,
// so it can be stopped and resumed. Each finished test is written to public/tests immediately.
// Usage: node --env-file=.env scripts/gen-tests.mjs [math-tests=6]
import { GoogleGenAI } from '@google/genai'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { ALL_TOPICS } from '../shared/topics.js'
import { drawFigure } from './figure.mjs'

const ROOT = new URL('..', import.meta.url).pathname
const CACHE = join(ROOT, 'scripts/cache')
mkdirSync(CACHE, { recursive: true })
mkdirSync(join(ROOT, 'public/qimg'), { recursive: true })
const N_MATH = Number(process.argv[2] || 6)
const MODELS = (process.env.GEN_MODELS || 'gemini-3.6-flash,gemini-3.5-flash-lite,gemini-3.8-flash').split(',')
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const L = ['A', 'B', 'C', 'D']
const strip = (h) => (h || '').replace(/<li>/g, '\n- ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()

async function gen(prompt, { temperature = 0.4 } = {}) {
  let last
  for (let attempt = 0; attempt < 6; attempt++) {
    for (const model of MODELS) {
      try {
        const out = await ai.models.generateContent({ model, contents: [{ role: 'user', parts: [{ text: prompt }] }], config: { temperature, responseMimeType: 'application/json' } })
        return JSON.parse(out.text)
      } catch (e) {
        last = e
        const code = e?.status || e?.code
        if (code === 429 || code === 503 || code === 500) await sleep(4000 * (attempt + 1))
      }
    }
  }
  throw last
}

const STYLE = {
  EBRW: `Reading and Writing style rules: one short passage (25–150 words, or two short texts "Text 1"/"Text 2" for Cross-Text Connections, or a bulleted HTML list of student notes for Rhetorical Synthesis, or a passage plus a small HTML data table for quantitative Command of Evidence). Use a blank "______" where the question needs one. Exactly four choices, one unambiguously correct; wrong choices must be plausible traps. Use the official question wording for the topic. Topics varied: science, history, literature, art, economics. Passages must be ORIGINAL — do not reuse or paraphrase real SAT or College Board items.`,
  MATH: `Math style rules: plain-text math with Unicode (x², √, π, ≤, ≥, fractions like 3/4). Multiple choice has exactly four choices; student-produced response has an exact numeric answer of at most 5 characters (fractions allowed). Numbers must work out exactly. ORIGINAL questions only — do not reuse real SAT items. For geometry questions that need a picture, include "figure": {"width": 10, "height": 8, "shapes": [...]} using shapes:
 {"kind":"polygon","points":[[x,y],...]} · {"kind":"segment","from":[x,y],"to":[x,y]} · {"kind":"circle","center":[x,y],"r":n} · {"kind":"point","at":[x,y],"label":"A"} · {"kind":"label","at":[x,y],"text":"8"} · {"kind":"rightangle","at":[x,y],"dir":[[dx1,dy1],[dx2,dy2]]} · {"kind":"arc","center":[x,y],"r":n,"from":deg,"to":deg}
 in a coordinate box 0..width × 0..height (y up). Every number needed to solve must ALSO be stated in the question text; add "Note: Figure not drawn to scale." when appropriate.`,
}

const num = (s) => {
  const t = String(s).replace(/\s|,/g, '')
  if (/^-?\d+\/\d+$/.test(t)) {
    const [a, b] = t.split('/').map(Number)
    return a / b
  }
  return Number(t)
}
async function verified(q, section) {
  const mc = Array.isArray(q.options) && q.options.length === 4
  if (!q.question || (mc && !(q.correct >= 0 && q.correct <= 3)) || (!mc && q.answer == null)) return false
  const v = await gen(
    `Solve this Digital SAT ${section === 'MATH' ? 'Math' : 'Reading and Writing'} question carefully and independently. Work it out step by step in "work", then give your final answer.
${q.passage ? `Text: ${strip(q.passage)}\n` : ''}Question: ${q.question}
${mc ? `Choices:\n${q.options.map((o, i) => `${L[i]}) ${o}`).join('\n')}\nReturn JSON {"work": "...", "answer": "A|B|C|D", "ambiguous": true|false}` : 'Student-produced response. Return JSON {"work": "...", "answer": "number as a fraction or decimal", "ambiguous": true|false}'}`,
    { temperature: 0 },
  )
  return !v.ambiguous && (mc ? String(v.answer).trim().toUpperCase().startsWith(L[q.correct]) : Math.abs(num(v.answer) - num(String(q.answer).split('|')[0])) < 1e-3)
}

const topic = (name) => ALL_TOPICS.find((t) => t.name.startsWith(name))
const cachePath = join(CACHE, 'tests-gen.json')
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, 'utf8')) : {}
const save = () => writeFileSync(cachePath, JSON.stringify(cache))
const seen = (name) => Object.entries(cache).filter(([k]) => k.endsWith('|' + name)).flatMap(([, v]) => v).map((q) => (q.passage ? strip(q.passage) : q.question).slice(0, 50))

/** Fill one slot group: `diffs` is the list of difficulties wanted for this topic in this module. */
async function fill(key, name, diffs, sprShare) {
  const t = topic(name)
  const have = (cache[key] ||= [])
  let rounds = 0
  while (have.length < diffs.length && rounds++ < 8) {
    const want = diffs.slice(have.length)
    try {
      const out = await gen(
        `Write ${want.length} NEW, ORIGINAL Digital SAT ${t.section === 'MATH' ? 'Math' : 'Reading and Writing'} questions for the topic "${t.name}" (domain: ${t.domain}), with these difficulties in order: ${want.join(', ')}.
${t.section === 'MATH' ? `About ${Math.round(sprShare * 100)}% should be student-produced response (no choices); the rest multiple choice.` : ''}
${STYLE[t.section]}
Do not repeat these existing openings: ${seen(t.name).slice(-25).join(' | ')}
Return JSON: [{"difficulty":"Easy|Medium|Hard","passage":"HTML <p>…</p> or empty string","question":"…","options":["…","…","…","…"] or [],"correct":0-3 or null,"answer":"for student-produced response only, else null","explanation":"3-5 sentences: why the answer is right and why the best trap is wrong"${t.section === 'MATH' ? ',"figure": null or {…}' : ''}}]`,
        { temperature: 0.9 },
      )
      for (const q of Array.isArray(out) ? out : []) {
        if (have.length >= diffs.length) break
        let ok = false
        try {
          ok = await verified(q, t.section)
        } catch {}
        if (!ok) {
          process.stdout.write('x')
          continue
        }
        have.push({ ...q, difficulty: diffs[have.length], topic: t.name })
        process.stdout.write('.')
        save()
      }
    } catch (e) {
      console.warn('\ngen failed', name, e.message)
    }
  }
  return have.length >= diffs.length
}

const toQ = (q) => {
  const mc = Array.isArray(q.options) && q.options.length === 4
  let image = null
  if (q.figure?.shapes?.length) {
    const id = createHash('sha1').update(q.question).digest('hex').slice(0, 10)
    writeFileSync(join(ROOT, 'public/qimg', `fig-${id}.svg`), drawFigure(q.figure))
    image = `/qimg/fig-${id}.svg`
  }
  return { passage: q.passage || null, passageImage: null, image, question: q.question, format: mc ? 'mc' : 'sa', options: mc ? q.options : [], correct: mc ? q.correct : null, answer: mc ? null : String(q.answer), explanation: q.explanation, topic: q.topic, difficulty: q.difficulty }
}

/** Build one module from [topic, count] slots; difficulties spread by `mix` (counts of E/M/H). */
async function module(prefix, slots, mix, sprShare, sortByDifficulty) {
  const pool = [...Array(mix[0]).fill('Easy'), ...Array(mix[1]).fill('Medium'), ...Array(mix[2]).fill('Hard')]
  // deal difficulties across slots round-robin so every topic gets a spread
  const plan = slots.map(([name, n]) => [name, []])
  let i = 0
  for (const d of pool) {
    while (plan[i % plan.length][1].length >= slots[i % plan.length][1]) i++
    plan[i % plan.length][1].push(d)
    i++
  }
  const qs = []
  for (const [name, diffs] of plan) {
    const key = `${prefix}|${name}`
    if (!(await fill(key, name, diffs, sprShare))) return null
    qs.push(...cache[key].map(toQ))
  }
  const rank = { Easy: 0, Medium: 1, Hard: 2 }
  if (sortByDifficulty) qs.sort((a, b) => rank[a.difficulty] - rank[b.difficulty])
  return { questions: qs }
}

const DATA = ['One-variable data', 'Two-variable data', 'Probability', 'Inference from sample', 'Evaluating statistical claims']
const GEO = ['Right triangles', 'Circles', 'Area and volume', 'Lines, angles']
const mathSlots = (k, m) => [
  ['Linear equations in one variable', 2],
  ['Linear functions', 2],
  ['Linear equations in two variables', 1],
  ['Systems of two linear equations', 2],
  ['Linear inequalities', 1],
  ['Nonlinear functions', 3],
  ['Nonlinear equations in one variable', 3],
  ['Equivalent expressions', 2],
  [(k + m) % 2 ? 'Ratios, rates' : 'Percentages', 1],
  [DATA[(2 * k + m) % DATA.length], 1],
  [DATA[(2 * k + m + 2) % DATA.length], 1],
  [GEO[(2 * k + m) % GEO.length], 2],
  [GEO[(2 * k + m + 1) % GEO.length], 1],
]

// 1. second module of R&W Practice Test 13 (pairs with the single "Practice Test 11 B" module)
const m2path = join(CACHE, 'rw-pt13-m2.json')
if (!existsSync(m2path)) {
  const rw = [
    ['Words in Context', 4], ['Text Structure and Purpose', 2], ['Cross-Text Connections', 1],
    ['Central Ideas and Details', 2], ['Command of Evidence', 3], ['Inferences', 2],
    ['Boundaries', 4], ['Form, Structure, and Sense', 3],
    ['Transitions', 3], ['Rhetorical Synthesis', 3],
  ]
  const m = await module('rw13-m2', rw, [6, 10, 11], 0, false)
  if (m) {
    writeFileSync(m2path, JSON.stringify(m))
    console.log('\nR&W Practice Test 13 module 2 done')
  }
}

// 2. Math practice tests: module 1 mixed, module 2 harder; questions run easy → hard like the real test
for (let k = 1; k <= N_MATH; k++) {
  const file = join(ROOT, `public/tests/math-pt${k}.json`)
  if (existsSync(file)) continue
  const m1 = await module(`m${k}-1`, mathSlots(k, 1), [8, 8, 6], 0.27, true)
  const m2 = m1 && (await module(`m${k}-2`, mathSlots(k, 2), [4, 8, 10], 0.27, true))
  if (!m1 || !m2) {
    console.log(`\nMath Practice Test ${k}: incomplete, will resume next run`)
    continue
  }
  writeFileSync(file, JSON.stringify({ id: `math-pt${k}`, name: `Practice Test ${k}`, type: 'MATH', description: '', modules: [m1, m2] }))
  console.log(`\nMATH TEST ${k} done`)
}
execFileSync('node', [join(ROOT, 'scripts/restructure-tests.mjs')], { stdio: 'inherit' })
console.log('ALL DONE')
