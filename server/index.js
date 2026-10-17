import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const HUMO_SYSTEM = `You are Humo, the AI tutor for Jamals AI.
You are an expert SAT and IELTS preparation assistant with a warm, precise, and encouraging style.
- Give step-by-step explanations.
- Prefer hints first when students are practicing.
- Adapt difficulty based on student level.
- Focus on Uzbekistan and international university admissions goals.
- Never give away full answers immediately unless asked.`

app.post('/api/chat', async (req, res) => {
  const { message, subject = 'SAT', mode = 'explain' } = req.body

  const demoReply = mode === 'hint'
    ? `Hint from Humo: Think about the core concept first.`
    : `Humo here. Regarding "${message}" in ${subject}:\n\nHere's a clear breakdown...\n\n(Connect Gemini API for live responses.)`

  res.json({ reply: demoReply, tutor: 'Humo', subject, mode })
})

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', platform: 'Jamals AI', tutor: 'Humo' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Jamals AI backend running on http://localhost:${PORT}`)
})
