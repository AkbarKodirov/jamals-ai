import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { GoogleGenAI } from '@google/genai'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { answerValue, DESMOS_GUIDE, prepareScreen } from './desmos.js'
import { kvBackend, kvDel, kvGet, kvSet } from './kv.js'
import { createHash } from 'node:crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-me'
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '1007781081540-u54cner78n5lvsq76ftp185a9825ec4a.apps.googleusercontent.com'
// Free-tier models, tried in order: if one is rate-limited or retired, Humo falls back to the next.
const GEMINI_MODELS = (process.env.GEMINI_MODEL || 'gemini-3.8-flash,gemini-3.6-flash,gemini-3.5-flash-lite,gemini-3.1-flash-lite').split(',').map((m) => m.trim())
const genai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null
const gemini = genai && {
  models: {
    async generateContent(req) {
      let last
      for (const model of GEMINI_MODELS) {
        try {
          return await genai.models.generateContent({ ...req, model })
        } catch (e) {
          last = e
          const code = e?.status || e?.code
          if (![404, 429, 500, 503].includes(code)) throw e
          console.warn(`Gemini ${model} unavailable (${code}), trying next model`)
        }
      }
      throw last
    },
  },
}

if (JWT_SECRET === 'dev-only-change-me') console.warn('⚠  JWT_SECRET not set — using an insecure dev secret.')

/* ---------- users: stored in kv (Postgres when DATABASE_URL is set, else local files) ---------- */
const DATA_DIR = join(__dirname, 'data')
mkdirSync(DATA_DIR, { recursive: true })
console.log(`Storage: ${kvBackend}${kvBackend === 'files' ? ' (set DATABASE_URL so accounts and progress survive restarts)' : ''}`)

// one-time move of the old users.json into the kv store
const OLD_USERS = join(DATA_DIR, 'users.json')
if (existsSync(OLD_USERS)) {
  try {
    for (const u of Object.values(JSON.parse(readFileSync(OLD_USERS, 'utf8')))) if (u?.email && !(await kvGet('users', u.email))) await kvSet('users', u.email, { ...u, id: 'u_' + createHash('sha256').update(u.email).digest('hex').slice(0, 24) })
  } catch (e) {
    console.warn('users.json migration skipped', e.message)
  }
}

/** The same email always gets the same id — so a wiped disk never "forgets" who a student is. */
export const idFor = (email) => 'u_' + createHash('sha256').update(String(email).trim().toLowerCase()).digest('hex').slice(0, 24)
const getUser = (email) => kvGet('users', String(email || '').trim().toLowerCase())

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, picture: u.picture, provider: u.provider, createdAt: u.createdAt }
}
function issue(u) {
  return { token: jwt.sign({ sub: u.id, email: u.email }, JWT_SECRET, { expiresIn: '60d' }), user: publicUser(u) }
}
async function upsertUser(data) {
  const key = data.email.trim().toLowerCase()
  const prev = await getUser(key)
  const u = { createdAt: Date.now(), ...prev, ...data, email: key, id: idFor(key) }
  await kvSet('users', key, u)
  return u
}

/* ---------- app ---------- */
const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true }))
app.use(express.json({ limit: '12mb' }))

function auth(req, res, next) {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : null
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Your session has expired. Log in again.' })
  }
}

// Google: the frontend sends the OAuth access token; we confirm it with Google.
app.post('/api/auth/google', async (req, res) => {
  const { accessToken } = req.body || {}
  if (!accessToken) return res.status(400).json({ error: 'Missing Google token.' })
  try {
    if (GOOGLE_CLIENT_ID) {
      const info = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`).then((r) => r.json())
      if (info.aud !== GOOGLE_CLIENT_ID) return res.status(401).json({ error: 'This Google token was issued for a different app.' })
    }
    const r = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${accessToken}` } })
    if (!r.ok) return res.status(401).json({ error: 'Google could not verify this sign-in. Try again.' })
    const p = await r.json()
    if (!p.email_verified) return res.status(401).json({ error: 'Verify your Google email first.' })
    const prev = await getUser(p.email)
    const user = await upsertUser({ email: p.email, name: p.name, picture: p.picture, googleId: p.sub, provider: prev?.passwordHash ? prev.provider : 'google' })
    res.json(issue(user))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Google sign-in failed on our side. Try again in a minute.' })
  }
})

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body || {}
  if (!email || !password || password.length < 8) return res.status(400).json({ error: 'Enter an email and a password of at least 8 characters.' })
  if ((await getUser(email))?.passwordHash) return res.status(409).json({ error: 'An account with this email already exists. Log in instead.' })
  const user = await upsertUser({ email, name: name || email.split('@')[0], passwordHash: await bcrypt.hash(password, 10), provider: 'email' })
  res.json(issue(user))
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  const u = await getUser(email)
  if (!u?.passwordHash || !(await bcrypt.compare(password || '', u.passwordHash))) return res.status(401).json({ error: 'Email or password is incorrect.' })
  res.json(issue(u))
})

app.get('/api/me', auth, async (req, res) => {
  let u = await getUser(req.user.email)
  // the account record may have been lost with the server disk; the signed token is still proof of who this is
  if (!u && req.user.email) u = await upsertUser({ email: req.user.email, name: req.user.email.split('@')[0], provider: 'google' })
  if (!u) return res.status(404).json({ error: 'Account not found.' })
  res.json({ user: publicUser(u) })
})

app.delete('/api/me', auth, async (req, res) => {
  await kvDel('users', String(req.user.email || '').toLowerCase())
  await kvDel('progress', idFor(req.user.email || ''))
  res.json({ ok: true })
})

/* ---------- student progress sync (chats, plan, onboarding, results…) ---------- */
app.get('/api/progress', auth, async (req, res) => {
  const p = await kvGet('progress', idFor(req.user.email || ''))
  res.json({ progress: p?.data ?? null, updatedAt: p?.updatedAt ?? 0 })
})
app.put('/api/progress', express.json({ limit: '8mb' }), auth, async (req, res) => {
  const { data, updatedAt } = req.body || {}
  if (!data || typeof data !== 'object') return res.status(400).json({ error: 'Missing progress.' })
  const key = idFor(req.user.email || '')
  const prev = await kvGet('progress', key)
  if (prev && prev.updatedAt > (updatedAt || 0)) return res.status(409).json({ error: 'Newer progress on the server.', progress: prev.data, updatedAt: prev.updatedAt })
  await kvSet('progress', key, { data, updatedAt: updatedAt || Date.now() })
  res.json({ ok: true })
})

/* ---------- Humo ---------- */
const HUMO_SYSTEM = `You are Humo, the AI tutor of Jamals AI, the exam platform of Jamals Academy in Tashkent.
You are an expert Digital SAT tutor with a warm, precise, encouraging style.
- Reply in the language the student writes in (English, O'zbekcha or Русский); keep exam terms in English.
- When a student is practising, give a hint first; give the full solution only if they ask.
- Explain step by step and name the exact mistake or trap.
- When asked for a study plan, ask for (or use) test date, target score and weak areas, then give a week-by-week plan.
- Keep answers short and scannable; use plain text, not markdown tables. Write math in plain text (x², √2, 7/2, ≤), never LaTeX or $…$ delimiters; put Desmos lines in \`backticks\`.
- Never claim to be affiliated with the College Board.
- When you recommend practice, point to the Jamals AI features by name: Practice tests (Exam / Practice / Sprint mode), Question bank (filter by skill and difficulty, Question Rush), Desmos Lab (upload a photo of a math question), Learn courses (SAT Reading & Writing, Math & Desmos), Vocabulary (Practice, Word list, My words), Blitz, Study plan, Saved & mistakes (saved, mistakes log, notes, collections), Analytics. There are no Drills or Lessons pages any more.
- Digital SAT skills: Words in context, Transitions, Standard English conventions, Rhetorical synthesis, Command of evidence, Central ideas & details, Text structure & purpose, Inferences, Algebra, Advanced math, Problem solving & data, Geometry & trigonometry.`

const PLAN_GUIDE = `STUDY PLAN EDITS
The student's current weekly study plan is in the context as JSON (days[0] = Monday … days[6] = Sunday).
When the student asks you to build, change, lighten, move or rebalance their plan, reply with one or two sentences about what you changed,
then (as the LAST thing in your reply) a fenced code block with the language "plan" holding the WHOLE new week as JSON:
\`\`\`plan
{"days":[[{"kind":"drill-rw","title":"Drill: Reading & Writing, 20 questions","min":30}],[],[],[],[],[],[]]}
\`\`\`
Allowed kinds: drill-rw, drill-math, skill (add "skill" with one Digital SAT skill name), vocab, mistakes, lesson, blitz, test (full practice test),
review (review last test), desmos (Desmos Lab), custom (any other task). 0–5 tasks per day, 5–180 minutes each. Keep tasks the student did not ask to change.
The app shows your plan as a card with an "Apply" button right after your words; never claim it is already applied and don't write anything after the block.`

const HUMO_FULL = `${HUMO_SYSTEM}\n\n${DESMOS_GUIDE}\n\n${PLAN_GUIDE}`
const NO_KEY = 'Humo needs a Gemini API key. Add GEMINI_API_KEY to .env (free at aistudio.google.com) and restart the server.'

/* ---------- Humo replies: pull out checked Desmos screens and plan proposals ---------- */
const PLAN_KINDS = new Set(['drill-rw', 'drill-math', 'skill', 'vocab', 'mistakes', 'lesson', 'blitz', 'test', 'review', 'desmos', 'custom'])
export function cleanPlan(p) {
  if (!p || !Array.isArray(p.days) || p.days.length !== 7) return null
  const days = p.days.map((d) =>
    (Array.isArray(d) ? d : [])
      .filter((t) => t && PLAN_KINDS.has(t.kind))
      .slice(0, 6)
      .map((t) => ({ id: crypto.randomUUID().slice(0, 8), kind: t.kind, title: String(t.title || '').slice(0, 90) || t.kind, min: Math.max(5, Math.min(180, Math.round(Number(t.min) || 20))), ...(t.skill ? { skill: String(t.skill).slice(0, 40) } : {}) })),
  )
  return { days }
}

async function repairDesmos(spec, errors, question) {
  const out = await gemini.models.generateContent({
    contents: [{ role: 'user', parts: [{ text: `${question ? `Question:\n${question}\n\n` : ''}This Desmos screen spec was refused by the checker:\n${JSON.stringify(spec)}\n\nErrors:\n- ${errors.join('\n- ')}\n\nRecompute the math and return ONLY the corrected spec as JSON (same format).` }] }],
    config: { systemInstruction: DESMOS_GUIDE, temperature: 0.1, responseMimeType: 'application/json' },
  })
  return JSON.parse(out.text)
}

/** Replaces each ```desmos block with [[desmos:N]] (checked screen) and a ```plan block with [[plan]]. */
async function finishReply(text, { expect, question } = {}) {
  const desmos = []
  let plan = null
  const blocks = [...text.matchAll(/```desmos\s*([\s\S]*?)```/g)].slice(0, 3)
  for (const m of blocks) {
    let marker = ''
    try {
      let spec = JSON.parse(m[1])
      let r = prepareScreen(spec, { expect })
      if (r.errors.length && gemini) {
        spec = await repairDesmos(spec, r.errors, question)
        r = prepareScreen(spec, { expect })
      }
      if (!r.errors.length) {
        marker = `[[desmos:${desmos.length}]]`
        desmos.push(r.screen)
      } else console.warn('Desmos screen refused:', r.errors)
    } catch (e) {
      console.warn('Desmos block unreadable:', e.message)
    }
    text = text.replace(m[0], marker)
  }
  const pm = text.match(/```plan\s*([\s\S]*?)```/)
  if (pm) {
    try {
      plan = cleanPlan(JSON.parse(pm[1]))
    } catch {
      plan = null
    }
    text = text.replace(pm[0], plan ? '[[plan]]' : '')
  }
  return { text: text.replace(/\n{3,}/g, '\n\n').trim(), desmos, plan }
}

const DESMOS_LAB = `DESMOS LAB MODE: the student sends photos or screenshots of SAT Math questions (sometimes several, sometimes with a typed note).
First write the question you read in one or two lines ("I read: …") so the student can catch a misread. If the photo is unreadable or cut off, say what is missing and ask for a clearer photo instead of guessing.
Then solve it the Desmos way in the 8-part shape with exactly one desmos block. For a Reading & Writing question, answer normally without a desmos block.`

function toParts(m) {
  const parts = []
  for (const url of (m.images || []).slice(0, 3)) {
    const mm = /^data:(image\/(?:png|jpeg|webp|heic|heif));base64,(.+)$/.exec(String(url))
    if (mm) parts.push({ inlineData: { mimeType: mm[1], data: mm[2] } })
  }
  parts.push({ text: String(m.text || (parts.length ? 'Solve this question.' : '')).slice(0, 8000) })
  return parts
}

app.post('/api/chat', async (req, res) => {
  const { messages = [], context, space } = req.body || {}
  if (!gemini) return res.status(503).json({ error: NO_KEY })
  try {
    const recent = messages.slice(-20)
    // images are expensive: only the last two messages that carry them are sent
    let withImages = 0
    const contents = recent
      .map((m, i) => ({ m, i }))
      .reverse()
      .map(({ m }) => {
        const keep = m.images?.length && withImages < 2
        if (keep) withImages++
        return { role: m.role === 'user' ? 'user' : 'model', parts: toParts(keep ? m : { ...m, images: [], text: m.images?.length ? `${m.text || ''} [photo of a question sent earlier]` : m.text }) }
      })
      .reverse()
    let system = context ? `${HUMO_FULL}\n\nContext about what the student is working on right now:\n${String(context).slice(0, 14000)}` : HUMO_FULL
    if (space === 'desmos') system = `${system}\n\n${DESMOS_LAB}`
    const out = await gemini.models.generateContent({ contents, config: { systemInstruction: system, temperature: 0.4 } })
    const last = recent.filter((m) => m.role === 'user').pop()?.text
    const r = await finishReply(out.text || '', { question: last })
    res.json({ reply: r.text, desmos: r.desmos, plan: r.plan, tutor: 'Humo' })
  } catch (e) {
    console.error(e)
    res.status(502).json({ error: 'Humo could not reach Gemini. Check GEMINI_API_KEY and try again.' })
  }
})

/* ---------- "Similar question": Humo writes a fresh question on the same skill ---------- */
app.post('/api/similar', async (req, res) => {
  const { passage, question, options = [], skill, section } = req.body || {}
  if (!question && !passage) return res.status(400).json({ error: 'Missing question.' })
  if (!gemini) return res.status(503).json({ error: NO_KEY })
  try {
    const prompt = `Write ONE new, original Digital SAT ${section === 'MATH' ? 'Math' : 'Reading and Writing'} question that tests the same skill (${skill || 'same skill'}) at the same difficulty as this one, with different content and numbers.
Original for reference only (do not copy it):
${passage ? `Text: ${passage}\n` : ''}Question: ${question}
${options.length ? `Choices: ${options.join(' | ')}` : ''}

Return JSON: {"passage": "text or empty string", "question": "…", "options": ["…","…","…","…"], "correct": 0-3, "explanation": "2-4 sentences: why the answer is right and the trap in the best wrong choice"}.
Use plain text math (x², √, 7/2). Exactly four options, exactly one correct. Double-check the key.`
    const out = await gemini.models.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], config: { systemInstruction: HUMO_SYSTEM, temperature: 0.8, responseMimeType: 'application/json' } })
    const j = JSON.parse(out.text)
    if (!Array.isArray(j.options) || j.options.length !== 4 || !(j.correct >= 0 && j.correct <= 3)) throw new Error('bad shape')
    res.json({ passage: String(j.passage || ''), question: String(j.question), options: j.options.map(String), correct: Number(j.correct), explanation: String(j.explanation || '') })
  } catch (e) {
    console.error(e)
    res.status(502).json({ error: 'Humo could not write a similar question right now. Try again.' })
  }
})

/* ---------- Desmos solves (Desmos Lab bank + any math question), cached for every student ---------- */
const BANK_FILE = [join(__dirname, '..', 'dist', 'desmos', 'bank.json'), join(__dirname, '..', 'public', 'desmos', 'bank.json')].find((f) => existsSync(f))
const BANK = BANK_FILE ? Object.fromEntries(JSON.parse(readFileSync(BANK_FILE, 'utf8')).map((q) => [q.id, q])) : {}
const SOLVE_FILE = join(DATA_DIR, 'desmos-solves.json')
const solveCache = existsSync(SOLVE_FILE) ? JSON.parse(readFileSync(SOLVE_FILE, 'utf8')) : {}
const solving = new Map()

app.post('/api/desmos/solve', async (req, res) => {
  const b = req.body || {}
  const bank = b.bankId ? BANK[b.bankId] : null
  const id = bank ? `bank:${bank.id}` : b.id
  if (!id || (!bank && !b.question)) return res.status(400).json({ error: 'Missing question.' })
  if (solveCache[id]) return res.json({ ...solveCache[id], cached: true })
  if (!gemini) return res.status(503).json({ error: NO_KEY })
  const question = bank ? `${bank.question}${bank.choices ? `\nChoices:\n${Object.entries(bank.choices).map(([k, v]) => `${k}) ${v}`).join('\n')}` : ''}` : `${b.passage ? `${b.passage}\n` : ''}${b.question}${b.options?.length ? `\nChoices:\n${b.options.join('\n')}` : ''}`
  const correct = bank ? bank.answer : b.correct
  const letter = /^[A-D]$/.test(String(correct ?? ''))
  const correctValue = !letter ? correct : bank?.choices ? bank.choices[correct] : String(b.options?.['ABCD'.indexOf(correct)] ?? '').replace(/^[A-D]\)\s*/, '')
  const expect = answerValue(String(correctValue ?? '').replace(/^.*=\s*/, ''))
  try {
    if (!solving.has(id)) {
      const prompt = `Solve this Digital SAT math question the Desmos way.\n\n${question}\n\nVerified answer: ${correct}${bank ? `\nVerified Desmos route (follow it): ${bank.desmos.join(' | ')}\nLook for: ${bank.look_for}\nWhy: ${bank.why}\nTrap: ${bank.trap}\nRule: ${bank.rule}` : ''}\n\nUse the 8-part reply shape and include exactly one desmos block. The screen must show the answer${expect != null ? ` ${expect}` : ''} as a result, parameter or labeled point. Under 220 words besides the block. English.`
      solving.set(
        id,
        gemini.models
          .generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], config: { systemInstruction: `${HUMO_SYSTEM}\n\n${DESMOS_GUIDE}`, temperature: 0.2 } })
          .then((o) => finishReply(o.text || '', { expect: expect ?? undefined, question }))
          .then((r) => {
            const v = { text: r.text, desmos: r.desmos }
            if (r.desmos.length) {
              solveCache[id] = v
              writeFileSync(SOLVE_FILE, JSON.stringify(solveCache))
            }
            return v
          })
          .finally(() => solving.delete(id)),
      )
    }
    res.json(await solving.get(id))
  } catch (e) {
    console.error(e)
    res.status(502).json({ error: 'Humo could not finish the Desmos solve. Try again in a moment.' })
  }
})

/* ---------- Humo edits the study plan ---------- */
app.post('/api/plan', async (req, res) => {
  const { plan, profile, instruction } = req.body || {}
  if (!instruction) return res.status(400).json({ error: 'Tell Humo what to change.' })
  if (!gemini) return res.status(503).json({ error: NO_KEY })
  try {
    const prompt = `Student profile: ${JSON.stringify(profile || {}).slice(0, 2000)}\nCurrent plan: ${JSON.stringify(plan || {}).slice(0, 8000)}\n\nThe student says: "${String(instruction).slice(0, 600)}"\n\nReturn JSON: {"note": "one or two friendly sentences on what you changed", "days": [7 arrays of tasks]}.`
    const out = await gemini.models.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], config: { systemInstruction: `${HUMO_SYSTEM}\n\n${PLAN_GUIDE}`, temperature: 0.4, responseMimeType: 'application/json' } })
    const j = JSON.parse(out.text)
    const p = cleanPlan(j)
    if (!p) return res.status(502).json({ error: 'Humo returned a plan the app could not read. Try rephrasing.' })
    res.json({ plan: p, note: String(j.note || '').slice(0, 400) })
  } catch (e) {
    console.error(e)
    res.status(502).json({ error: 'Humo could not change the plan right now. Try again.' })
  }
})

/* ---------- per-question explanations, generated once and shared by every student ---------- */
const EXPL_FILE = join(DATA_DIR, 'explanations.json')
const explCache = existsSync(EXPL_FILE) ? JSON.parse(readFileSync(EXPL_FILE, 'utf8')) : {}
const inflight = new Map()

app.post('/api/explain', async (req, res) => {
  const { id, passage, question, options = [], correct, format } = req.body || {}
  if (!id || !question) return res.status(400).json({ error: 'Missing question.' })
  if (explCache[id]) return res.json({ explanation: explCache[id], cached: true })
  if (!gemini) return res.status(503).json({ error: NO_KEY })
  try {
    if (!inflight.has(id)) {
      const prompt = `Explain this ${format === 'sa' ? 'student-produced response' : 'multiple-choice'} Digital SAT question.
${passage ? `Text:\n${passage}\n` : ''}Question: ${question}
${options.length ? `Choices:\n${options.join('\n')}\n` : ''}Correct answer: ${correct}

Write the explanation Humo shows above the question in review:
1. One sentence naming the skill being tested.
2. Why the correct answer is right, step by step (show the math if it is a math question).
${options.length ? '3. One short line for each wrong choice saying exactly why it is wrong or what trap it sets.\n' : ''}Plain text, no markdown headings, under 170 words, English.`
      inflight.set(
        id,
        gemini.models
          .generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], config: { systemInstruction: HUMO_SYSTEM, temperature: 0.3 } })
          .then((o) => {
            explCache[id] = o.text.trim()
            writeFileSync(EXPL_FILE, JSON.stringify(explCache))
            return explCache[id]
          })
          .finally(() => inflight.delete(id)),
      )
    }
    res.json({ explanation: await inflight.get(id) })
  } catch (e) {
    console.error(e)
    res.status(502).json({ error: 'Humo could not reach Gemini. Try again in a moment.' })
  }
})

/* ---------- Blitz weekly leaderboard (shared by all students) ---------- */
const BLITZ_FILE = join(DATA_DIR, 'blitz.json')
const weekKey = () => {
  const d = new Date()
  const day = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - day)
  return d.toISOString().slice(0, 10)
}
const loadBlitz = () => (existsSync(BLITZ_FILE) ? JSON.parse(readFileSync(BLITZ_FILE, 'utf8')) : {})

app.post('/api/blitz', auth, async (req, res) => {
  const score = Math.max(0, Math.min(100000, Math.round(Number(req.body?.score) || 0)))
  const u = await getUser(req.user.email)
  if (!u) return res.status(404).json({ error: 'Account not found.' })
  const all = loadBlitz()
  const wk = weekKey()
  all[wk] = all[wk] || {}
  const prev = all[wk][u.id]
  if (!prev || score > prev.score) all[wk][u.id] = { name: u.name || 'Student', picture: u.picture || null, score, at: Date.now() }
  writeFileSync(BLITZ_FILE, JSON.stringify(all))
  res.json({ ok: true })
})

app.get('/api/blitz/leaderboard', (_, res) => {
  const rows = Object.entries(loadBlitz()[weekKey()] || {})
    .map(([id, r]) => ({ id, ...r }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
  res.json({ week: weekKey(), rows })
})

app.get('/api/health', (_, res) => res.json({ status: 'ok', platform: 'Jamals AI', tutor: 'Humo', gemini: !!gemini, storage: kvBackend }))

/* ---------- serve the built website from the same server (one free service on Render) ---------- */
const DIST = join(__dirname, '..', 'dist')
if (existsSync(join(DIST, 'index.html'))) {
  app.use(express.static(DIST, { maxAge: '1h', index: false, setHeaders: (res, p) => { if (p.endsWith('.json')) res.setHeader('Cache-Control', 'no-cache') } }))
  app.get(/^(?!\/api\/).*/, (_, res) => res.sendFile(join(DIST, 'index.html')))
}

app.listen(PORT, () => console.log(`Jamals AI backend running on http://localhost:${PORT}`))
