import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { BookOpen, Check, ChevronLeft, ChevronRight, Flag, Home, LogOut, MessageCircle, Send, Timer, X } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { fullQuestionBank, type Question } from '../fullQuestionBank'

const NAV = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/humo', label: 'Humo', icon: MessageCircle },
  { to: '/app/practice', label: 'Practice', icon: BookOpen },
  { to: '/app/mock', label: 'Mock test', icon: Timer },
]

function Avatar() {
  const { user } = useAuth()
  if (user?.picture) return <img src={user.picture} alt="" referrerPolicy="no-referrer" className="size-8 rounded-full" />
  return <span className="grid size-8 place-items-center rounded-full bg-jg-500 text-[13px] font-semibold text-ink">{user?.name?.[0]?.toUpperCase() ?? 'J'}</span>
}

export default function AppShell() {
  const { user, signOut } = useAuth()
  const nav = useNavigate()
  return (
    <div className="min-h-svh bg-ink pb-20 text-white md:pb-0 md:pl-60">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-white/[0.07] p-4 md:flex">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-2">
          <img src="/brand/jamals-mark.png" alt="" className="size-9 rounded-full" />
          <span className="text-[15px] font-semibold tracking-tight">Jamals AI</span>
        </Link>
        <nav className="mt-6 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition ${isActive ? 'bg-white/[0.07] text-white' : 'text-white/55 hover:bg-white/[0.04] hover:text-white'}`
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-3 rounded-xl border border-white/[0.07] p-2.5">
          <Avatar />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{user?.name}</p>
            <p className="truncate text-[11px] text-white/40">{user?.email}</p>
          </div>
          <button
            aria-label="Log out"
            onClick={() => {
              signOut()
              nav('/')
            }}
            className="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.06] hover:text-white"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/[0.07] bg-ink/80 px-4 backdrop-blur-xl md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <img src="/brand/jamals-mark.png" alt="" className="size-8 rounded-full" />
          <span className="text-[15px] font-semibold">Jamals AI</span>
        </Link>
        <Avatar />
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 md:py-12">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="humo" element={<HumoChat />} />
          <Route path="practice" element={<Practice />} />
          <Route path="mock" element={<MockTest />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-white/[0.07] bg-ink/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex flex-col items-center gap-1 py-2.5 text-[11px] ${isActive ? 'text-jg-400' : 'text-white/45'}`}>
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

/* ---------------- Dashboard ---------------- */

function Dashboard() {
  const { user } = useAuth()
  const first = user?.name?.split(' ')[0] ?? 'there'
  const weak = [
    ['Advanced math', 48],
    ['Transitions', 61],
    ['Geometry & trig', 66],
  ] as const
  return (
    <div>
      <h1 className="display text-[clamp(2rem,4vw,2.75rem)]">Salom, {first}.</h1>
      <p className="mt-2 text-[15px] text-white/50">Start with the diagnostic so Humo can build your plan.</p>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <Link to="/app/mock" className="group relative overflow-hidden rounded-[24px] border border-jg-500/30 bg-gradient-to-br from-jg-500/[0.14] to-transparent p-6 md:col-span-2">
          <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-jg-500/20 blur-3xl" />
          <p className="text-[13px] text-jg-300">Recommended next</p>
          <h2 className="mt-2 text-[24px] font-semibold tracking-tight">Take your 40-minute diagnostic</h2>
          <p className="mt-2 max-w-md text-[14px] text-white/55">A timed mix of every Digital SAT domain. You get an estimated score and a study plan straight after.</p>
          <span className="mt-6 inline-flex h-10 items-center rounded-full bg-jg-500 px-5 text-[14px] font-semibold text-ink group-hover:bg-jg-400">Start diagnostic</span>
        </Link>
        <div className="panel rounded-[24px] p-6">
          <p className="text-[13px] text-white/45">Target score</p>
          <p className="mt-2 text-[40px] font-semibold tracking-tight tabular-nums">1450</p>
          <p className="text-[13px] text-white/45">Test date not set</p>
          <button className="mt-5 text-[13px] text-jg-300 hover:text-jg-200">Set test date</button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="panel rounded-[24px] p-6">
          <h3 className="text-[15px] font-semibold">Focus areas</h3>
          <p className="mt-1 text-[12px] text-white/40">Sample until you finish the diagnostic</p>
          <ul className="mt-5 space-y-4">
            {weak.map(([k, v]) => (
              <li key={k}>
                <div className="flex justify-between text-[13px]">
                  <span>{k}</span>
                  <span className="tabular-nums text-white/50">{v}%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/[0.07]">
                  <div className="h-full rounded-full bg-gradient-to-r from-jg-700 to-jg-300" style={{ width: `${v}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/app/humo" className="panel group flex flex-col rounded-[24px] p-6 hover:border-white/20">
          <div className="flex items-center gap-3">
            <img src="/humo-mark.svg" alt="" className="size-10 rounded-full ring-2 ring-jg-500/40" />
            <div>
              <h3 className="text-[15px] font-semibold">Ask Humo</h3>
              <p className="text-[12px] text-white/40">English, O'zbekcha, Русский</p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {['Make me a 6-week plan for a 1450', 'Explain comma splices simply', 'Check my IELTS Task 2 intro'].map((s) => (
              <p key={s} className="rounded-xl border border-white/[0.07] px-3 py-2 text-[13px] text-white/65 group-hover:border-white/10">
                {s}
              </p>
            ))}
          </div>
        </Link>
      </div>
    </div>
  )
}

/* ---------------- Humo chat ---------------- */

type Msg = { role: 'user' | 'humo'; text: string }

function HumoChat() {
  const { token } = useAuth()
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'humo', text: "Salom! I'm Humo. Ask me about any SAT or IELTS question, or tell me your test date and target and I'll build a study plan." },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => end.current?.scrollIntoView({ behavior: 'smooth' }), [msgs, busy])

  async function send(text = input) {
    const t = text.trim()
    if (!t || busy) return
    const history = [...msgs, { role: 'user' as const, text: t }]
    setMsgs(history)
    setInput('')
    setBusy(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: history }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'offline')
      setMsgs((m) => [...m, { role: 'humo', text: data.reply }])
    } catch {
      setMsgs((m) => [...m, { role: 'humo', text: "I can't reach the Humo server right now. Start it with `npm run server` (and set GEMINI_API_KEY), then ask again." }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex h-[calc(100svh-11rem)] flex-col md:h-[calc(100svh-6rem)]">
      <div className="flex items-center gap-3 border-b border-white/[0.07] pb-5">
        <img src="/humo-mark.svg" alt="" className="size-11 rounded-full ring-2 ring-jg-500/40" />
        <div>
          <h1 className="text-[18px] font-semibold tracking-tight">Humo</h1>
          <p className="text-[12px] text-white/45">Your SAT and IELTS tutor</p>
        </div>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto py-6">
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role === 'humo' && <img src="/humo-mark.svg" alt="" className="mt-0.5 size-7 shrink-0 rounded-full" />}
            <p
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed ${m.role === 'user' ? 'bg-jg-500 text-ink' : 'border border-white/[0.08] bg-white/[0.03] text-white/85'}`}
            >
              {m.text}
            </p>
          </div>
        ))}
        {busy && (
          <div className="flex gap-3">
            <img src="/humo-mark.svg" alt="" className="size-7 rounded-full" />
            <span className="flex items-center gap-1 rounded-2xl border border-white/[0.08] px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-1.5 animate-bounce rounded-full bg-jg-400" style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </span>
          </div>
        )}
        <div ref={end} />
      </div>
      {msgs.length === 1 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {['Build me a 6-week SAT plan', 'Ikkinchi darajali tenglamalarni tushuntir', 'How is IELTS Writing scored?'].map((s) => (
            <button key={s} onClick={() => send(s)} className="rounded-full border border-white/10 px-3 py-1.5 text-[13px] text-white/65 hover:border-white/25 hover:text-white">
              {s}
            </button>
          ))}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
        className="flex gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 focus-within:border-jg-500/50"
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Humo anything…" className="flex-1 bg-transparent px-3 text-[15px] placeholder:text-white/30 focus:outline-none" />
        <button aria-label="Send" disabled={busy || !input.trim()} className="grid size-10 place-items-center rounded-xl bg-jg-500 text-ink disabled:opacity-40">
          <Send className="size-4" />
        </button>
      </form>
    </div>
  )
}

/* ---------------- Practice ---------------- */

function QuestionCard({ q, onAnswer }: { q: Question; onAnswer?: (ok: boolean) => void }) {
  const [picked, setPicked] = useState<string | null>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    setPicked(null)
    setShown(false)
  }, [q.id])
  return (
    <div className="panel rounded-[24px] p-6">
      <div className="flex flex-wrap gap-2 text-[11px]">
        <span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-white/70">{q.exam}</span>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-white/50">{q.topic}</span>
        <span className={`rounded-full px-2.5 py-1 ${q.difficulty === 'Hard' ? 'bg-red-400/10 text-red-300' : q.difficulty === 'Medium' ? 'bg-jg-500/10 text-jg-300' : 'bg-emerald-400/10 text-emerald-300'}`}>{q.difficulty}</span>
      </div>
      <p className="mt-4 text-[16.5px] font-medium leading-snug">{q.question}</p>
      {q.choices ? (
        <div className="mt-5 grid gap-2">
          {q.choices.map((c) => {
            const ok = c === q.correct
            const state = picked ? (c === picked ? (ok ? 'right' : 'wrong') : ok ? 'reveal' : '') : ''
            return (
              <button
                key={c}
                disabled={!!picked}
                onClick={() => {
                  setPicked(c)
                  onAnswer?.(ok)
                }}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-[14.5px] transition ${
                  state === 'right' ? 'border-emerald-400/60 bg-emerald-400/10' : state === 'wrong' ? 'border-red-400/50 bg-red-400/[0.08]' : state === 'reveal' ? 'border-emerald-400/30' : 'border-white/10 hover:border-white/25'
                }`}
              >
                {c}
                {state === 'right' && <Check className="size-4 text-emerald-300" />}
                {state === 'wrong' && <X className="size-4 text-red-300" />}
              </button>
            )
          })}
        </div>
      ) : (
        <button onClick={() => setShown(true)} className="mt-5 rounded-full border border-white/15 px-4 py-2 text-[13px] hover:border-white/30">
          Show what examiners look for
        </button>
      )}
      {(picked || shown) && (
        <div className="mt-5 flex gap-3 rounded-xl border border-jg-500/20 bg-jg-500/[0.06] p-4">
          <img src="/humo-mark.svg" alt="" className="size-7 shrink-0 rounded-full" />
          <p className="text-[14px] leading-relaxed text-white/80">{q.explanation}</p>
        </div>
      )}
    </div>
  )
}

function Practice() {
  const [exam, setExam] = useState<'All' | 'SAT' | 'IELTS'>('All')
  const [diff, setDiff] = useState<'All' | Question['difficulty']>('All')
  const list = useMemo(() => fullQuestionBank.filter((q) => (exam === 'All' || q.exam === exam) && (diff === 'All' || q.difficulty === diff)), [exam, diff])
  const chip = (on: boolean) => `rounded-full px-3.5 py-1.5 text-[13px] transition ${on ? 'bg-cream text-ink' : 'border border-white/10 text-white/60 hover:border-white/25'}`
  return (
    <div>
      <h1 className="display text-[clamp(2rem,4vw,2.75rem)]">Practice</h1>
      <p className="mt-2 text-[15px] text-white/50">{list.length} questions. Humo explains each one after you answer.</p>
      <div className="mt-7 flex flex-wrap gap-2">
        {(['All', 'SAT', 'IELTS'] as const).map((e) => (
          <button key={e} onClick={() => setExam(e)} className={chip(exam === e)}>
            {e}
          </button>
        ))}
        <span className="mx-1 w-px bg-white/10" />
        {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
          <button key={d} onClick={() => setDiff(d)} className={chip(diff === d)}>
            {d === 'All' ? 'Any difficulty' : d}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        {list.map((q) => (
          <QuestionCard key={q.id} q={q} />
        ))}
      </div>
    </div>
  )
}

/* ---------------- Mock test ---------------- */

const SECTIONS = [
  { name: 'Reading & Writing', minutes: 32, filter: (q: Question) => q.exam === 'SAT' && q.section === 'Reading & Writing' },
  { name: 'Math', minutes: 35, filter: (q: Question) => q.exam === 'SAT' && q.section === 'Math' },
]

function MockTest() {
  const [started, setStarted] = useState(false)
  const [sec, setSec] = useState(0)
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [flags, setFlags] = useState<Set<number>>(new Set())
  const [left, setLeft] = useState(SECTIONS[0].minutes * 60)
  const [done, setDone] = useState(false)
  const qs = useMemo(() => fullQuestionBank.filter(SECTIONS[sec].filter), [sec])

  useEffect(() => {
    if (!started || done) return
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [started, done])

  const nextSection = () => {
    if (sec < SECTIONS.length - 1) {
      setSec(sec + 1)
      setIdx(0)
      setLeft(SECTIONS[sec + 1].minutes * 60)
    } else setDone(true)
  }
  useEffect(() => {
    if (started && left === 0) nextSection()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left])

  if (!started)
    return (
      <div>
        <h1 className="display text-[clamp(2rem,4vw,2.75rem)]">Mock test</h1>
        <p className="mt-2 max-w-lg text-[15px] text-white/50">A short Digital SAT-style mock: one Reading & Writing section and one Math section, each timed. You can flag questions and move freely inside a section.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <div key={s.name} className="panel rounded-[20px] p-5">
              <p className="text-[15px] font-semibold">{s.name}</p>
              <p className="mt-1 text-[13px] text-white/45">
                {fullQuestionBank.filter(s.filter).length} questions, {s.minutes} minutes
              </p>
            </div>
          ))}
        </div>
        <button onClick={() => setStarted(true)} className="mt-8 h-11 rounded-full bg-jg-500 px-6 text-[14px] font-semibold text-ink hover:bg-jg-400">
          Start mock
        </button>
      </div>
    )

  if (done) {
    const all = fullQuestionBank.filter((q) => SECTIONS.some((s) => s.filter(q)))
    const correct = all.filter((q) => answers[q.id] === q.correct).length
    return (
      <div className="text-center">
        <img src="/humo-mark.svg" alt="" className="mx-auto size-14 rounded-2xl" />
        <h1 className="display mt-6 text-[clamp(2rem,4vw,2.75rem)]">Mock complete</h1>
        <p className="mt-3 text-[48px] font-semibold tabular-nums">
          {correct}
          <span className="text-white/30">/{all.length}</span>
        </p>
        <p className="text-[14px] text-white/50">Ask Humo to walk through the ones you missed.</p>
        <Link to="/app/humo" className="mt-8 inline-flex h-11 items-center rounded-full bg-jg-500 px-6 text-[14px] font-semibold text-ink">
          Review with Humo
        </Link>
      </div>
    )
  }

  const q = qs[idx]
  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')
  return (
    <div>
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
        <div>
          <p className="text-[12px] text-white/40">
            Section {sec + 1} of {SECTIONS.length}
          </p>
          <p className="text-[16px] font-semibold">{SECTIONS[sec].name}</p>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-[15px] font-semibold tabular-nums ${left < 300 ? 'bg-red-400/15 text-red-300' : 'bg-jg-500/10 text-jg-300'}`}>
          {mm}:{ss}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {qs.map((x, i) => (
          <button
            key={x.id}
            onClick={() => setIdx(i)}
            className={`relative grid size-8 place-items-center rounded-lg text-[12px] tabular-nums ${i === idx ? 'bg-cream text-ink' : answers[x.id] ? 'bg-jg-500/80 text-ink' : 'border border-white/10 text-white/50'}`}
          >
            {i + 1}
            {flags.has(x.id) && <Flag className="absolute -right-1 -top-1 size-3 fill-red-400 text-red-400" />}
          </button>
        ))}
      </div>

      <div className="panel mt-5 rounded-[24px] p-6">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[16.5px] font-medium leading-snug">{q.question}</p>
          <button
            aria-label="Flag question"
            onClick={() =>
              setFlags((f) => {
                const n = new Set(f)
                n.has(q.id) ? n.delete(q.id) : n.add(q.id)
                return n
              })
            }
            className={`shrink-0 rounded-lg p-2 ${flags.has(q.id) ? 'text-red-300' : 'text-white/35 hover:text-white'}`}
          >
            <Flag className="size-4" />
          </button>
        </div>
        <div className="mt-5 grid gap-2">
          {q.choices?.map((c, i) => (
            <button
              key={c}
              onClick={() => setAnswers({ ...answers, [q.id]: c })}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-[14.5px] ${answers[q.id] === c ? 'border-jg-500/60 bg-jg-500/10' : 'border-white/10 hover:border-white/25'}`}
            >
              <span className="grid size-6 place-items-center rounded-full border border-white/20 text-[11px]">{String.fromCharCode(65 + i)}</span>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button disabled={idx === 0} onClick={() => setIdx(idx - 1)} className="inline-flex items-center gap-1 rounded-full border border-white/10 px-4 py-2 text-[13px] disabled:opacity-30">
          <ChevronLeft className="size-4" /> Back
        </button>
        {idx < qs.length - 1 ? (
          <button onClick={() => setIdx(idx + 1)} className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-ink">
            Next <ChevronRight className="size-4" />
          </button>
        ) : (
          <button onClick={nextSection} className="rounded-full bg-jg-500 px-5 py-2 text-[13px] font-semibold text-ink">
            {sec < SECTIONS.length - 1 ? 'Finish section' : 'Finish mock'}
          </button>
        )}
      </div>
    </div>
  )
}
