import { useState } from 'react'
import { Send } from 'lucide-react'
import { HumoMessages, useHumoChat } from '../components/HumoDrawer'
import { useStore } from '../store'

export default function HumoChat() {
  const s = useStore()
  const last = s.attempts[s.attempts.length - 1]
  const context = [
    `Student goal: target ${s.profile.target}${s.profile.current ? `, current ${s.profile.current}` : ''}${s.profile.testDate ? `, SAT on ${s.profile.testDate}` : ''}.`,
    last ? `Last test: ${last.testName}, ${last.raw}/${last.total} (${last.scaled}) in ${last.mode} mode.` : 'No tests taken yet.',
    `${s.mistakes.filter((m) => !m.cleared).length} open mistakes in their notebook.`,
  ].join(' ')
  const { msgs, busy, send } = useHumoChat("Salom! I'm Humo. Ask me about any SAT question, or tell me your test date and target and I'll build a study plan.", context)
  const [input, setInput] = useState('')

  return (
    <div className="mx-auto flex h-[calc(100svh-13rem)] max-w-3xl flex-col md:h-[calc(100svh-8rem)]">
      <div className="flex items-center gap-3 pb-5">
        <img src="/humo-mark.svg" alt="" className="size-12 rounded-2xl" />
        <div>
          <h1 className="display text-[28px] leading-none">Humo</h1>
          <p className="mt-1 text-[13px] text-moss">Your Digital SAT tutor · English, O'zbekcha, Русский</p>
        </div>
      </div>
      <div className="card flex-1 overflow-y-auto bg-cream/40 p-5">
        <HumoMessages msgs={msgs} busy={busy} />
      </div>
      {msgs.length === 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {['Build me a 6-week SAT plan', 'Ikkinchi darajali tenglamalarni tushuntir', 'How is the Digital SAT scored?', 'What should I study after my last test?'].map((t) => (
            <button key={t} onClick={() => send(t)} className="rounded-full border border-[#e3dccf] bg-white px-3.5 py-1.5 text-[13px] hover:border-jg-500">
              {t}
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
        className="mt-3 flex gap-2 rounded-2xl border border-[#e3dccf] bg-white p-1.5 focus-within:border-jg-500"
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Humo anything…" className="flex-1 bg-transparent px-3 text-[15px] placeholder:text-moss/60 focus:outline-none" />
        <button aria-label="Send" disabled={busy || !input.trim()} className="grid size-11 place-items-center rounded-xl bg-pine text-cream disabled:opacity-40">
          <Send className="size-4" />
        </button>
      </form>
    </div>
  )
}
