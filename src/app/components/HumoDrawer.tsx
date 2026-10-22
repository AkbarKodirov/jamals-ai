import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, X } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { askHumo, HumoOffline, streamingText, type ChatMsg } from '../humo'
import { RichText } from './RichText'
import { DesmosScreen } from '../../desmos/DesmosScreen'
import { PlanProposal } from './PlanProposal'

/** Sensai's text with its checked Desmos screens and plan proposals placed where Sensai put them. */
export function HumoReply({ msg }: { msg: ChatMsg }) {
  const parts = msg.text.split(/(\[\[(?:desmos:\d+|plan)\]\])/g)
  const used = new Set<number>()
  return (
    <>
      {parts.map((part, i) => {
        const d = part.match(/^\[\[desmos:(\d+)\]\]$/)
        if (d) {
          const sc = msg.desmos?.[Number(d[1])]
          if (!sc) return null
          used.add(Number(d[1]))
          return <DesmosScreen key={i} screen={sc} />
        }
        if (part === '[[plan]]') return msg.plan ? <PlanProposal key={i} plan={msg.plan} /> : null
        return part.trim() ? <RichText key={i} text={part.replace(/^\n+|\n+$/g, '')} /> : null
      })}
      {msg.desmos?.map((sc, i) => (used.has(i) ? null : <DesmosScreen key={`x${i}`} screen={sc} />))}
      {msg.plan && !msg.text.includes('[[plan]]') && <PlanProposal plan={msg.plan} />}
    </>
  )
}

export function HumoMessages({ msgs, busy }: { msgs: ChatMsg[]; busy: boolean }) {
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [msgs, busy])
  return (
    <div className="space-y-4">
      {msgs.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: m.role === 'user' ? 'bottom right' : 'bottom left' }}
          className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : ''}`}
        >
          {m.role === 'humo' && <img src="/sensai-mark.png" alt="" className="mt-0.5 size-7 shrink-0 rounded-lg" />}
          <div className={`rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed ${m.role === 'user' ? 'max-w-[82%] bg-pine text-cream' : `border border-line bg-card text-pine ${m.desmos?.length || m.plan ? 'w-full max-w-[94%]' : 'max-w-[82%]'}`}`}>
            {m.role === 'humo' ? (
              <HumoReply msg={m} />
            ) : (
              <>
                {m.images?.length ? (
                  <span className="mb-1.5 flex flex-wrap gap-1.5">
                    {m.images.map((src, k) => (
                      <img key={k} src={src} alt="Question photo" className="max-h-48 rounded-xl ring-1 ring-white/20" />
                    ))}
                  </span>
                ) : null}
                {m.text}
              </>
            )}
          </div>
        </motion.div>
      ))}
      {busy && msgs[msgs.length - 1]?.role === 'user' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
          <span className="relative">
            <span className="absolute inset-0 animate-ping rounded-lg bg-jg-400/40" />
            <img src="/sensai-mark.png" alt="" className="relative size-7 rounded-lg" />
          </span>
          <span className="flex items-center gap-1 rounded-2xl border border-line bg-card px-4 py-3">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1.5 animate-bounce rounded-full bg-jg-500" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </span>
        </motion.div>
      )}
      <div ref={end} />
    </div>
  )
}

export function useHumoChat(greeting: string, context?: string, opts: { initial?: ChatMsg[]; onChange?: (msgs: ChatMsg[]) => void; space?: 'humo' | 'desmos' } = {}) {
  const { token } = useAuth()
  const [msgs, setMsgsRaw] = useState<ChatMsg[]>(() => opts.initial ?? [{ role: 'humo', text: greeting }])
  const [busy, setBusy] = useState(false)
  const onChange = useRef(opts.onChange)
  onChange.current = opts.onChange
  const setMsgs = (fn: (m: ChatMsg[]) => ChatMsg[]) =>
    setMsgsRaw((m) => {
      const next = fn(m)
      queueMicrotask(() => onChange.current?.(next))
      return next
    })
  async function send(text: string, images?: string[]) {
    const t = text.trim()
    if ((!t && !images?.length) || busy) return
    const history = [...msgs, { role: 'user' as const, text: t, at: Date.now(), ...(images?.length ? { images } : {}) }]
    setMsgs(() => history)
    setBusy(true)
    const at = Date.now()
    // the streaming reply is the message right after `history`; it is replaced by the checked answer at the end
    const put = (msg: ChatMsg) => setMsgs((m) => [...m.slice(0, history.length), msg])
    try {
      const r = await askHumo(history, token, context, opts.space, (t) => put({ role: 'humo', text: streamingText(t), at }))
      put({ role: 'humo', text: r.reply, desmos: r.desmos?.length ? r.desmos : undefined, plan: r.plan ?? undefined, at })
    } catch (e) {
      put({ role: 'humo', error: true, text: e instanceof HumoOffline ? `I'm offline right now. ${e.message}` : (e as Error).message, at: Date.now() })
    } finally {
      setBusy(false)
    }
  }
  function reset(next: ChatMsg[]) {
    setMsgsRaw(next)
  }
  return { msgs, busy, send, reset }
}

/** Slide-over chat with Sensai that already knows the test the student just took. */
export function HumoDrawer({ open, onClose, context, greeting, suggestions, prefill, subtitle = 'Your Digital SAT tutor', autoSend }: { open: boolean; onClose: () => void; context: string; greeting: string; suggestions: string[]; prefill?: string; subtitle?: string; autoSend?: string | null }) {
  const { msgs, busy, send } = useHumoChat(greeting, context)
  const [input, setInput] = useState('')
  const sent = useRef<string | null>(null)
  useEffect(() => {
    if (open && autoSend && sent.current !== autoSend) {
      sent.current = autoSend
      send(autoSend)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, autoSend])
  useEffect(() => {
    if (open && prefill) setInput(prefill)
  }, [open, prefill])
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-pine/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-label="Chat with Sensai"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream"
          >
            <div className="flex items-center gap-3 border-b border-line bg-card px-5 py-4">
              <img src="/sensai-mark.png" alt="" className="size-10 rounded-xl" />
              <div className="flex-1">
                <p className="text-[15px] font-semibold">Sensai</p>
                <p className="text-[12px] text-moss">{subtitle}</p>
              </div>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-moss hover:bg-cream">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <HumoMessages msgs={msgs} busy={busy} />
            </div>
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2 px-5 pb-3">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-line bg-card px-3 py-1.5 text-[12.5px] text-pine hover:border-jg-500">
                    {s}
                  </button>
                ))}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
                setInput('')
              }}
              className="m-4 mt-0 flex gap-2 rounded-2xl border border-line bg-card p-1.5 focus-within:border-jg-500"
            >
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about any question…" className="flex-1 bg-transparent px-3 text-[14.5px] placeholder:text-moss/60 focus:outline-none" />
              <button aria-label="Send" disabled={busy || !input.trim()} className="grid size-10 place-items-center rounded-xl bg-pine text-cream disabled:opacity-40">
                <Send className="size-4" />
              </button>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
