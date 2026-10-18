import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { History, MessageSquarePlus, Pencil, Pin, PinOff, Search, Send, Trash2, X } from 'lucide-react'
import { HumoMessages, useHumoChat } from '../components/HumoDrawer'
import { setStore, useStore, type Chat, type ChatMsg } from '../store'
import { studentContext } from '../humoContext'
import { uid } from '../plan'

const GREETING = "Salom! I'm Humo. Send me any SAT question — I'll solve math the Desmos way with a real Desmos screen — or ask me to build or change your study plan."
const STARTERS = ['Solve x² − 5x + 6 = 0 with Desmos', 'Make my weekends lighter in my plan', 'Ikkinchi darajali tenglamalarni tushuntir', 'What should I study after my last test?']

function saveChat(id: string, msgs: ChatMsg[]) {
  if (msgs.filter((m) => m.role === 'user').length === 0) return
  const firstQ = msgs.find((m) => m.role === 'user')!.text
  setStore((s) => {
    const existing = s.chats.find((c) => c.id === id)
    const chat: Chat = existing
      ? { ...existing, msgs, updatedAt: Date.now() }
      : { id, title: firstQ.replace(/\s+/g, ' ').slice(0, 52) + (firstQ.length > 52 ? '…' : ''), createdAt: Date.now(), updatedAt: Date.now(), msgs }
    return { ...s, chats: [chat, ...s.chats.filter((c) => c.id !== id)].slice(0, 80) }
  })
}

function groupOf(t: number) {
  const d = new Date(t)
  const now = new Date()
  const days = Math.floor((new Date(now.toDateString()).getTime() - new Date(d.toDateString()).getTime()) / 86400000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return 'Previous 7 days'
  if (days < 30) return 'Previous 30 days'
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

function HistoryList({ active, onPick, onNew }: { active: string; onPick: (id: string) => void; onNew: () => void }) {
  const s = useStore()
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const list = s.chats.filter((c) => !q || c.title.toLowerCase().includes(q.toLowerCase()) || c.msgs.some((m) => m.text.toLowerCase().includes(q.toLowerCase())))
  const pinned = list.filter((c) => c.pinned)
  const rest = list.filter((c) => !c.pinned).sort((a, b) => b.updatedAt - a.updatedAt)
  const groups: [string, Chat[]][] = []
  for (const c of rest) {
    const g = groupOf(c.updatedAt)
    const last = groups[groups.length - 1]
    if (last && last[0] === g) last[1].push(c)
    else groups.push([g, [c]])
  }
  if (pinned.length) groups.unshift(['Pinned', pinned])

  return (
    <div className="flex h-full flex-col">
      <button onClick={onNew} className="btn btn-dark h-10 w-full text-[13.5px]">
        <MessageSquarePlus className="size-4" /> New chat
      </button>
      <label className="mt-3 flex items-center gap-2 rounded-xl border border-[#e6e0d3] bg-white px-3 py-2 focus-within:border-jg-500">
        <Search className="size-3.5 text-moss" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chats" className="w-full bg-transparent text-[13px] focus:outline-none" />
      </label>
      <div className="-mx-1 mt-3 flex-1 overflow-y-auto px-1">
        {groups.length === 0 && <p className="px-2 py-6 text-center text-[12.5px] text-moss">{q ? 'No chats match.' : 'Your conversations with Humo will appear here.'}</p>}
        {groups.map(([g, chats]) => (
          <div key={g} className="mb-3">
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-moss/80">{g}</p>
            <AnimatePresence initial={false}>
              {chats.map((c) => (
                <motion.div key={c.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} className={`group relative flex items-center rounded-xl ${c.id === active ? 'bg-white shadow-[0_4px_14px_-8px_rgb(27_41_37/.35)] ring-1 ring-[#e6e0d3]' : 'hover:bg-white/70'}`}>
                  {editing === c.id ? (
                    <input
                      autoFocus
                      defaultValue={c.title}
                      onBlur={(e) => {
                        const t = e.target.value.trim()
                        if (t) setStore((x) => ({ ...x, chats: x.chats.map((y) => (y.id === c.id ? { ...y, title: t.slice(0, 60) } : y)) }))
                        setEditing(null)
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                      className="m-1 w-full rounded-lg border border-jg-500 px-2 py-1.5 text-[13px] focus:outline-none"
                    />
                  ) : (
                    <button onClick={() => onPick(c.id)} className="min-w-0 flex-1 truncate px-2.5 py-2 text-left text-[13px]">
                      {c.msgs.some((m) => m.desmos?.length) && <span className="mr-1.5 inline-grid size-4 place-items-center rounded bg-[#2d70b3] align-[-2px] text-[9px] font-bold text-white">D</span>}
                      {c.title}
                    </button>
                  )}
                  {editing !== c.id && (
                    <span className="mr-1 hidden shrink-0 items-center group-hover:flex">
                      <button aria-label={c.pinned ? 'Unpin' : 'Pin'} onClick={() => setStore((x) => ({ ...x, chats: x.chats.map((y) => (y.id === c.id ? { ...y, pinned: !y.pinned } : y)) }))} className="rounded-md p-1 text-moss hover:bg-cream">
                        {c.pinned ? <PinOff className="size-3.5" /> : <Pin className="size-3.5" />}
                      </button>
                      <button aria-label="Rename" onClick={() => setEditing(c.id)} className="rounded-md p-1 text-moss hover:bg-cream">
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        aria-label="Delete chat"
                        onClick={() => {
                          setStore((x) => ({ ...x, chats: x.chats.filter((y) => y.id !== c.id) }))
                          if (c.id === active) onNew()
                        }}
                        className="rounded-md p-1 text-moss hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <p className="border-t border-[#e6e0d3] pt-2 text-[11px] text-moss">Saved on this device · {s.chats.length} chat{s.chats.length === 1 ? '' : 's'}</p>
    </div>
  )
}

function ChatPane({ id, initial }: { id: string; initial?: ChatMsg[] }) {
  const s = useStore()
  const context = studentContext(s, 'the Ask Humo page')
  const { msgs, busy, send } = useHumoChat(GREETING, context, { initial, onChange: (m) => saveChat(id, m) })
  const [input, setInput] = useState('')
  const box = useRef<HTMLTextAreaElement>(null)
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="card flex-1 overflow-y-auto bg-cream/40 p-4 sm:p-5">
        <HumoMessages msgs={msgs} busy={busy} />
        {msgs.length === 1 && (
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {STARTERS.map((t, i) => (
              <motion.button key={t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }} onClick={() => send(t)} className="rounded-2xl border border-[#e3dccf] bg-white px-4 py-3 text-left text-[13.5px] transition hover:-translate-y-0.5 hover:border-jg-500">
                {t}
              </motion.button>
            ))}
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
          setInput('')
        }}
        className="mt-3 flex items-end gap-2 rounded-2xl border border-[#e3dccf] bg-white p-1.5 focus-within:border-jg-500"
      >
        <textarea
          ref={box}
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            e.target.style.height = 'auto'
            e.target.style.height = `${Math.min(160, e.target.scrollHeight)}px`
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send(input)
              setInput('')
              if (box.current) box.current.style.height = 'auto'
            }
          }}
          placeholder="Ask Humo or paste a math question…"
          className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2.5 text-[14.5px] placeholder:text-moss/60 focus:outline-none"
        />
        <button aria-label="Send" disabled={busy || !input.trim()} className="grid size-11 place-items-center rounded-xl bg-pine text-cream disabled:opacity-40">
          <Send className="size-4" />
        </button>
      </form>
    </div>
  )
}

export default function HumoChat() {
  const s = useStore()
  const [params, setParams] = useSearchParams()
  const fresh = useMemo(() => uid(), [])
  const [newId, setNewId] = useState(fresh)
  const active = params.get('c') || newId
  const chat = s.chats.find((c) => c.id === active)
  const [drawer, setDrawer] = useState(false)

  const pick = (id: string) => {
    setParams({ c: id })
    setDrawer(false)
  }
  const startNew = () => {
    const id = uid()
    setNewId(id)
    setParams({})
    setDrawer(false)
  }

  return (
    <div className="mx-auto flex h-[calc(100svh-13rem)] max-w-6xl gap-5 md:h-[calc(100svh-8rem)]">
      <aside className="hidden w-64 shrink-0 lg:block">
        <HistoryList active={active} onPick={pick} onNew={startNew} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 pb-4">
          <img src="/humo-mark.svg" alt="" className="size-11 rounded-2xl" />
          <div className="min-w-0 flex-1">
            <h1 className="display truncate text-[26px] leading-none">{chat?.title ?? 'Humo'}</h1>
            <p className="mt-1 hidden text-[12.5px] text-moss sm:block">Digital SAT tutor · Desmos solves · edits your plan · English, O'zbekcha, Русский</p>
          </div>
          <button onClick={() => setDrawer(true)} className="btn btn-ghost h-10 px-3 text-[13px] lg:hidden">
            <History className="size-4" /> History
          </button>
          <button onClick={startNew} aria-label="New chat" className="btn btn-ghost h-10 px-3 text-[13px] lg:hidden">
            <MessageSquarePlus className="size-4" />
          </button>
        </div>
        <ChatPane key={active} id={active} initial={chat?.msgs} />
      </div>
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-pine/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed inset-y-0 left-0 z-50 w-[82%] max-w-xs bg-cream p-4 lg:hidden">
              <button onClick={() => setDrawer(false)} aria-label="Close" className="absolute right-3 top-3 rounded-full p-1.5 text-moss">
                <X className="size-5" />
              </button>
              <p className="mb-3 text-[15px] font-semibold">Chat history</p>
              <div className="h-[calc(100%-2.5rem)]">
                <HistoryList active={active} onPick={pick} onNew={startNew} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
