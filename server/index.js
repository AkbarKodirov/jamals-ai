import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { GoogleGenAI } from '@google/genai'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-me'
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const gemini = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null

if (JWT_SECRET === 'dev-only-change-me') console.warn('⚠  JWT_SECRET not set — using an insecure dev secret.')

/* ---------- tiny JSON user store (swap for Postgres later) ---------- */
const DATA_DIR = join(__dirname, 'data')
const USERS_FILE = join(DATA_DIR, 'users.json')
mkdirSync(DATA_DIR, { recursive: true })
const loadUsers = () => (existsSync(USERS_FILE) ? JSON.parse(readFileSync(USERS_FILE, 'utf8')) : {})
const saveUsers = (u) => writeFileSync(USERS_FILE, JSON.stringify(u, null, 2))

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, picture: u.picture, provider: u.provider }
}
function issue(u) {
  return { token: jwt.sign({ sub: u.id, email: u.email }, JWT_SECRET, { expiresIn: '30d' }), user: publicUser(u) }
}
function upsertUser(data) {
  const users = loadUsers()
  const key = data.email.toLowerCase()
  users[key] = { ...(users[key] || { id: crypto.randomUUID(), createdAt: Date.now() }), ...data, email: key }
  saveUsers(users)
  return users[key]
}

/* ---------- app ---------- */
const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true }))
app.use(express.json({ limit: '1mb' }))

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
    const user = upsertUser({ email: p.email, name: p.name, picture: p.picture, googleId: p.sub, provider: 'google' })
    res.json(issue(user))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Google sign-in failed on our side. Try again in a minute.' })
  }
})

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body || {}
  if (!email || !password || password.length < 8) return res.status(400).json({ error: 'Enter an email and a password of at least 8 characters.' })
  const users = loadUsers()
  if (users[email.toLowerCase()]?.passwordHash) return res.status(409).json({ error: 'An account with this email already exists. Log in instead.' })
  const user = upsertUser({ email, name: name || email.split('@')[0], passwordHash: await bcrypt.hash(password, 10), provider: 'email' })
  res.json(issue(user))
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  const u = loadUsers()[(email || '').toLowerCase()]
  if (!u?.passwordHash || !(await bcrypt.compare(password || '', u.passwordHash))) return res.status(401).json({ error: 'Email or password is incorrect.' })
  res.json(issue(u))
})

app.get('/api/me', auth, (req, res) => {
  const u = Object.values(loadUsers()).find((x) => x.id === req.user.sub)
  if (!u) return res.status(404).json({ error: 'Account not found.' })
  res.json({ user: publicUser(u) })
})

/* ---------- Humo ---------- */
const HUMO_SYSTEM = `You are Humo, the AI tutor of Jamals AI, the exam platform of Jamals Academy in Tashkent.
You are an expert Digital SAT and IELTS tutor with a warm, precise, encouraging style.
- Reply in the language the student writes in (English, O'zbekcha or Русский); keep exam terms in English.
- When a student is practising, give a hint first; give the full solution only if they ask.
- Explain step by step and name the exact mistake or trap.
- When asked for a study plan, ask for (or use) test date, target score and weak areas, then give a week-by-week plan.
- Keep answers short and scannable; use plain text, not markdown tables.
- Never claim to be affiliated with the College Board or IELTS.`

app.post('/api/chat', async (req, res) => {
  const { messages = [] } = req.body || {}
  if (!gemini) {
    return res.json({ reply: 'Humo is running without a Gemini key. Add GEMINI_API_KEY to .env and restart the server to get live answers.', tutor: 'Humo' })
  }
  try {
    const contents = messages.slice(-20).map((m) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: String(m.text).slice(0, 8000) }] }))
    const out = await gemini.models.generateContent({ model: GEMINI_MODEL, contents, config: { systemInstruction: HUMO_SYSTEM, temperature: 0.6 } })
    res.json({ reply: out.text, tutor: 'Humo' })
  } catch (e) {
    console.error(e)
    res.status(502).json({ error: 'Humo could not reach Gemini. Check GEMINI_API_KEY and try again.' })
  }
})

app.get('/api/health', (_, res) => res.json({ status: 'ok', platform: 'Jamals AI', tutor: 'Humo', gemini: !!gemini }))

app.listen(PORT, () => console.log(`Jamals AI backend running on http://localhost:${PORT}`))
