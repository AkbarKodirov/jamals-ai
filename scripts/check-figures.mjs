// Checks every generated geometry figure in the Math practice tests against its question text.
// Each SVG is rendered to PNG and shown to Gemini with the question; a figure that does not match
// exactly is removed (the question text already states every number needed to solve it).
// Usage: node --env-file=.env scripts/check-figures.mjs
import { GoogleGenAI } from '@google/genai'
import { chromium } from 'playwright'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { drawFigure } from './figure.mjs'

const ROOT = new URL('..', import.meta.url).pathname
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
const MODELS = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-3.5-flash-lite']
const cachePath = join(ROOT, 'scripts/cache/figure-checks.json')
const checked = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, 'utf8')) : {}
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 400, height: 340 } })

const SHAPES = `{"kind":"polygon","points":[[x,y],...]} · {"kind":"segment","from":[x,y],"to":[x,y]} · {"kind":"circle","center":[x,y],"r":n} · {"kind":"point","at":[x,y],"label":"A"} · {"kind":"label","at":[x,y],"text":"8"} · {"kind":"rightangle","at":[x,y],"dir":[[dx1,dy1],[dx2,dy2]]} · {"kind":"arc","center":[x,y],"r":n,"from":deg,"to":deg}`
async function redraw(q, problem) {
  const prompt = `Draw the figure for this SAT geometry question as JSON {"width": W, "height": H, "shapes": [...]} using only these shapes, in a box 0..W × 0..H with y pointing up: ${SHAPES}
Compute every coordinate exactly (e.g. the foot of a perpendicular must lie on the segment; points said to be on a circle must be at distance r from the center). Draw every segment the question mentions, label every named point, put right-angle marks only where stated, and do not show the answer. A previous attempt was wrong: ${problem}
Question: ${q.question}`
  for (const model of MODELS) {
    try {
      const out = await ai.models.generateContent({ model, contents: [{ role: 'user', parts: [{ text: prompt }] }], config: { temperature: 0.2, responseMimeType: 'application/json' } })
      return JSON.parse(out.text)
    } catch {}
  }
  return null
}
const shot = async (svg) => {
  await page.setContent(`<body style="margin:0;background:#fff"><div style="width:400px;height:340px;display:grid;place-items:center">${svg}</div><style>svg{max-width:400px;max-height:340px;width:auto;height:auto}</style></body>`)
  return page.screenshot({ clip: { x: 0, y: 0, width: 400, height: 340 }, timeout: 10000 })
}

async function judge(png, q) {
  const prompt = `You are checking a geometry figure for an SAT question. Question: ${q.question}${q.options?.length ? `\nChoices: ${q.options.join(' | ')}` : ''}
Does the figure match the question EXACTLY: every labelled point where the text says it is (e.g. a point "on segment PR" lies on PR), every segment the text mentions drawn between the right points, right-angle marks only where stated, and no contradictory labels or numbers? Shapes need not be to scale. Return JSON {"matches": true|false, "problem": "what is wrong, in one short sentence"}`
  for (const model of MODELS) {
    try {
      const out = await ai.models.generateContent({ model, contents: [{ role: 'user', parts: [{ inlineData: { mimeType: 'image/png', data: png.toString('base64') } }, { text: prompt }] }], config: { temperature: 0, responseMimeType: 'application/json' } })
      return JSON.parse(out.text)
    } catch {}
  }
  return { matches: false, problem: 'could not check' }
}

for (let k = 1; existsSync(join(ROOT, `public/tests/math-pt${k}.json`)); k++) {
  const file = join(ROOT, `public/tests/math-pt${k}.json`)
  const t = JSON.parse(readFileSync(file, 'utf8'))
  let changed = false
  for (const m of t.modules)
    for (const q of m.questions) {
      if (!q.image?.startsWith('/qimg/fig-')) continue
      if (!(q.image in checked)) {
        const path = join(ROOT, 'public', q.image)
        let v = await judge(await shot(readFileSync(path, 'utf8')), q)
        for (let tries = 0; !v.matches && tries < 3; tries++) {
          const spec = await redraw(q, v.problem)
          if (!spec?.shapes?.length) continue
          const svg = drawFigure(spec)
          const v2 = await judge(await shot(svg), q)
          if (v2.matches) {
            writeFileSync(path, svg)
            v = { matches: true, problem: 'redrawn' }
          } else v = v2
        }
        checked[q.image] = v
        writeFileSync(cachePath, JSON.stringify(checked, null, 1))
      }
      const v = checked[q.image]
      console.log(`math-pt${k}`, q.image, v.matches ? 'OK' : `REMOVED: ${v.problem}`)
      if (!v.matches) {
        if (/\b(figure|shown|diagram)\b/i.test(q.question)) console.log('  WARNING question refers to the figure:', q.question.slice(0, 100))
        q.image = null
        changed = true
      }
    }
  if (changed) writeFileSync(file, JSON.stringify(t))
}
await browser.close()
