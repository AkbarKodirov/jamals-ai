// Free backup for Humo: when every Gemini model is busy or out of quota, the same request goes to Groq
// (OpenAI-compatible API, free tier ~1,000 requests a day). Text goes to a strong reasoning model; requests
// with photos go to a model that can read images. Responses are shaped like Gemini's ({ text } / chunks with .text)
// so the rest of the server doesn't need to know which provider answered.
const KEY = process.env.GROQ_API_KEY || process.env.Groq_API_KEY || process.env.groq_api_key
const URL = 'https://api.groq.com/openai/v1/chat/completions'
const TEXT_MODEL = process.env.GROQ_TEXT_MODEL || 'openai/gpt-oss-120b'
const VISION_MODEL = process.env.GROQ_VISION_MODEL || 'qwen/qwen3.8-27b'

export const groqReady = !!KEY

function toMessages({ contents, config = {} }) {
  const messages = []
  const sys = typeof config.systemInstruction === 'string' ? config.systemInstruction : config.systemInstruction?.parts?.map((p) => p.text).join('\n')
  if (sys) messages.push({ role: 'system', content: sys })
  let images = false
  const list = typeof contents === 'string' ? [{ role: 'user', parts: [{ text: contents }] }] : contents || []
  for (const c of list) {
    const parts = (c.parts || []).map((p) => {
      if (p.text != null) return { type: 'text', text: p.text }
      if (p.inlineData) {
        images = true
        return { type: 'image_url', image_url: { url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}` } }
      }
      return null
    }).filter(Boolean)
    if (!parts.length) continue
    const role = c.role === 'model' ? 'assistant' : 'user'
    // only user turns may carry images; plain text keeps the request small
    messages.push({ role, content: role === 'user' && parts.some((p) => p.type === 'image_url') ? parts : parts.map((p) => p.text || '').join('\n') })
  }
  return { messages, images }
}

async function call(req, stream) {
  const { messages, images } = toMessages(req)
  const body = { model: images ? VISION_MODEL : TEXT_MODEL, messages, temperature: req.config?.temperature ?? 0.4, stream }
  if (req.config?.responseMimeType === 'application/json') body.response_format = { type: 'json_object' }
  const res = await fetch(URL, { method: 'POST', headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(60_000) })
  if (!res.ok) {
    const err = new Error(`Groq ${body.model} ${res.status}: ${(await res.text()).slice(0, 200)}`)
    err.status = res.status
    throw err
  }
  return { res, model: body.model }
}

export async function groqGenerate(req) {
  const { res } = await call(req, false)
  const j = await res.json()
  return { text: j.choices?.[0]?.message?.content || '' }
}

export async function groqStream(req) {
  const { res, model } = await call(req, true)
  const gen = (async function* () {
    const decoder = new TextDecoder()
    let buf = ''
    for await (const piece of res.body) {
      buf += decoder.decode(piece, { stream: true })
      let i
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).trim()
        buf = buf.slice(i + 1)
        if (!line.startsWith('data:')) continue
        const data = line.slice(5).trim()
        if (data === '[DONE]') return
        const t = JSON.parse(data).choices?.[0]?.delta?.content
        if (t) yield { text: t }
      }
    }
  })()
  gen.model = `groq:${model}`
  return gen
}
