import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, X } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { askHumo, HumoOffline, type ChatMsg } from '../humo'
import { RichText } from './RichText'

export function HumoMessages({ msgs, busy }: { msgs: ChatMsg[]; busy: boolean }) {
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [msgs, busy])
  return (
    <div className="space-y-4">
      {msgs.map((m, i) => (
        <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : ''}`}>
          {m.role === 'humo' && <img src="/humo-mark.svg" alt="" className="mt-0.5 size-7 shrink-0 rounded-lg" />}
          <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed ${m.role === 'user' ? 'bg-pine text-cream' : 'border border-[#ece6da] bg-white text-pine'}`}>
            {m.role === 'humo' ? <RichText text={m.text} /> : m.text}
          </div>
        </div>
      ))}
      {busy && (
        <div className="flex gap-2.5">
          <img src="/humo-mark.svg" alt="" className="size-7 rounded-lg" />
          <span className="flex items-center gap-1 rounded-2xl border border-[#ece6da] bg-white px-4 py-3">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1.5 animate-bounce rounded-full bg-jg-500" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </span>
        </div>
      )}
      <div ref={end} />
    </div>
  )
}

export function useHumoChat(greeting: string, context?: string) {
  const { token } = useAuth()
  const [msgs, setMsgs] = useState<ChatMsg[]>([{ role: 'humo', text: greeting }])
  const [busy, setBusy] = useState(false)
  async function send(text: string) {
    const t = text.trim()
    if (!t || busy) return
    const history = [...msgs, { role: 'user' as const, text: t }]
    setMsgs(history)
    setBusy(true)
    try {
      const reply = await askHumo(history, token, context)
      setMsgs((m) => [...m, { role: 'humo', text: reply }])
    } catch (e) {
      setMsgs((m) => [...m, { role: 'humo', text: e instanceof HumoOffline ? `I'm offline right now. ${e.message}` : (e as Error).message }])
    } finally {
      setBusy(false)
    }
  }
  return { msgs, busy, send }
}

/** Slide-over chat with Humo that already knows the test the student just took. */
export function HumoDrawer({ open, onClose, context, greeting, suggestions, prefill }: { open: boolean; onClose: () => void; context: string; greeting: string; suggestions: string[]; prefill?: string }) {
  const { msgs, busy, send } = useHumoChat(greeting, context)
  const [input, setInput] = useState('')
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
            aria-label="Chat with Humo"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream"
          >
            <div className="flex items-center gap-3 border-b border-[#e8e2d6] bg-white px-5 py-4">
              <img src="/humo-mark.svg" alt="" className="size-10 rounded-xl" />
              <div className="flex-1">
                <p className="text-[15px] font-semibold">Humo</p>
                <p className="text-[12px] text-moss">Knows your answers on this test</p>
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
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-[#e3dccf] bg-white px-3 py-1.5 text-[12.5px] text-pine hover:border-jg-500">
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
              className="m-4 mt-0 flex gap-2 rounded-2xl border border-[#e3dccf] bg-white p-1.5 focus-within:border-jg-500"
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
