import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookMarked, CalendarDays, CheckCircle2, Clock, NotebookPen, Pencil, Target, Trophy, Zap } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { setStore, today, useStore } from '../store'
import { WORDS } from '../../data/vocab'

const HumoScene = lazy(() => import('../../three/HumoScene'))

function Countdown({ date }: { date: string | null }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])
  const diff = date ? Math.max(0, new Date(date + 'T08:00:00').getTime() - now) : 0
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        [d, 'days'],
        [h, 'hours'],
        [m, 'mins'],
      ].map(([v, l]) => (
        <div key={l as string} className="rounded-2xl bg-cream px-2 py-3 text-center">
          <p className="font-serif text-[28px] leading-none tabular-nums">{String(v).padStart(2, '0')}</p>
          <p className="mt-1.5 text-[11px] text-moss">{l}</p>
        </div>
      ))}
    </div>
  )
}

function EditableScore({ label, value, onSave, accent }: { label: string; value: number | null; onSave: (n: number) => void; accent?: boolean }) {
  const [edit, setEdit] = useState(false)
  const [v, setV] = useState(String(value ?? ''))
  return (
    <div>
      {edit ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const n = Math.round(Number(v) / 10) * 10
            if (n >= 400 && n <= 1600) onSave(n)
            setEdit(false)
          }}
        >
          <input autoFocus type="number" min={400} max={1600} step={10} value={v} onChange={(e) => setV(e.target.value)} onBlur={() => setEdit(false)} className="w-28 rounded-xl border border-[#e3dccf] px-3 py-1.5 font-serif text-[30px] focus:border-jg-500 focus:outline-none" />
        </form>
      ) : (
        <button onClick={() => setEdit(true)} className="group flex items-center gap-2">
          <span className={`font-serif text-[40px] leading-none tabular-nums ${accent ? 'text-jg-600' : ''}`}>{value ?? '—'}</span>
          <Pencil className="size-3.5 text-moss opacity-50 group-hover:opacity-100" />
        </button>
      )}
      <p className="mt-1.5 text-[13px] text-moss">{label}</p>
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()
  const s = useStore()
  const first = user?.name?.split(' ')[0] ?? 'there'

  const answered = s.attempts.reduce((a, t) => a + t.answers.filter((x) => x.value != null).length, 0) + s.practice.solved
  const correct = s.attempts.reduce((a, t) => a + t.answers.filter((x) => x.correct).length, 0) + s.practice.correct
  const accuracy = answered ? Math.round((correct / answered) * 100) : null
  const last30 = s.activeDays.filter((d) => Date.now() - new Date(d).getTime() < 30 * 86400000).length
  const hours = s.studySeconds / 3600
  const current = s.profile.current ?? (s.attempts.length ? Math.max(...s.attempts.filter((a) => a.type === 'EBRW').map((a) => a.scaled), 0) * 2 || null : null)
  const progress = current ? Math.min(100, Math.max(4, ((current - 400) / (s.profile.target - 400)) * 100)) : 4

  const dueWords = WORDS.filter((w) => {
    const p = s.vocab[w.word]
    return !p || p.due <= Date.now()
  }).length
  const openMistakes = s.mistakes.filter((m) => !m.cleared).length
  const plan = [
    s.attempts.length === 0
      ? { icon: Trophy, title: 'Take Practice Test 1 in practice mode', sub: 'Your first full test sets your starting score.', to: '/app/tests', done: false }
      : { icon: Trophy, title: 'Full test in exam mode', sub: 'Timed, no hints — like test day.', to: '/app/tests', done: s.attempts.some((a) => new Date(a.finishedAt).toISOString().slice(0, 10) === today()) },
    { icon: BookMarked, title: `Daily 20 words`, sub: `${Math.min(20, dueWords)} words due for review`, to: '/app/vocab', done: dueWords === 0 },
    openMistakes
      ? { icon: NotebookPen, title: `Review ${openMistakes} mistake${openMistakes > 1 ? 's' : ''}`, sub: 'Fix them before they repeat on test day.', to: '/app/mistakes', done: false }
      : { icon: Zap, title: 'One Blitz run', sub: '60 seconds a question, three lives.', to: '/app/blitz', done: false },
  ]

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[28px] bg-pine text-cream">
        <div className="absolute inset-y-0 right-0 hidden w-[46%] lg:block">
          <Suspense fallback={null}>
            <HumoScene layout="compact" />
          </Suspense>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-pine to-transparent" />
        </div>
        <div className="relative max-w-xl p-7 sm:p-10">
          <div className="flex items-center gap-2.5 lg:hidden">
            <img src="/humo-mark.svg" alt="" className="size-10 rounded-xl" />
          </div>
          <h1 className="display mt-4 text-[clamp(2rem,4vw,2.9rem)] lg:mt-0">Salom, {first}.</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-cream/65">
            {s.attempts.length ? "Here's today's plan. Humo has reviewed your last test." : "Let's find your starting score. Take your first practice test and Humo will plan the rest."}
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link to="/app/tests" className="btn btn-green h-11 px-5 text-[14px]">
              {s.attempts.length ? 'Start a practice test' : 'Take your first test'}
            </Link>
            <Link to="/app/humo" className="btn h-11 border border-white/15 px-5 text-[14px] text-cream hover:bg-white/[0.06]">
              Ask Humo
            </Link>
          </div>
        </div>
      </section>

      {/* Scores + countdown */}
      <section className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
        <div className="card p-6 sm:p-7">
          <div className="flex items-center gap-2 text-[14px] font-semibold">
            <Target className="size-4 text-jg-600" /> Score goal
          </div>
          <div className="mt-5 flex flex-wrap items-end gap-10">
            <EditableScore label="Current score" value={current} onSave={(n) => setStore((x) => ({ ...x, profile: { ...x.profile, current: n } }))} />
            <EditableScore label="Target score" value={s.profile.target} accent onSave={(n) => setStore((x) => ({ ...x, profile: { ...x.profile, target: n } }))} />
          </div>
          <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-cream">
            <div className="h-full rounded-full bg-gradient-to-r from-jg-700 to-jg-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-moss">
            <span>400</span>
            <span>{s.profile.target}</span>
          </div>
        </div>
        <div className="card p-6 sm:p-7">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-[14px] font-semibold">
              <CalendarDays className="size-4 text-jg-600" /> Exam countdown
            </span>
            <input
              type="date"
              value={s.profile.testDate ?? ''}
              min={today()}
              onChange={(e) => setStore((x) => ({ ...x, profile: { ...x.profile, testDate: e.target.value || null } }))}
              className="rounded-lg border border-[#e3dccf] px-2 py-1 text-[12px] text-moss focus:border-jg-500 focus:outline-none"
              aria-label="Exam date"
            />
          </div>
          <div className="mt-5">
            <Countdown date={s.profile.testDate} />
          </div>
          <p className="mt-3 text-[12px] text-moss">{s.profile.testDate ? `SAT on ${new Date(s.profile.testDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}` : 'Pick your test date to start the countdown.'}</p>
        </div>
      </section>

      {/* Analytics strip */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { icon: CheckCircle2, color: 'text-jg-600 bg-jg-50', label: 'Questions solved', value: answered || '–' },
          { icon: Target, color: 'text-rose-600 bg-rose-50', label: 'Accuracy', value: accuracy != null ? `${accuracy}%` : '–' },
          { icon: Clock, color: 'text-sky-600 bg-sky-50', label: 'Study time', value: hours ? (hours < 1 ? `${Math.round(hours * 60)} min` : `${hours.toFixed(1)} h`) : '–' },
          { icon: CalendarDays, color: 'text-fuchsia-600 bg-fuchsia-50', label: 'Active days', value: `${last30} of 30` },
        ].map(({ icon: Icon, color, label, value }) => (
          <div key={label} className="card flex items-center gap-4 p-5">
            <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${color}`}>
              <Icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[12.5px] text-moss">{label}</p>
              <p className="font-serif text-[24px] leading-tight tabular-nums">{value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Plan + recent */}
      <section className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold">Today's plan</h2>
            <Link to="/app/plan" className="text-[13px] text-jg-600 hover:text-jg-700">
              Weekly plan
            </Link>
          </div>
          <ul className="mt-4 space-y-2.5">
            {plan.map(({ icon: Icon, title, sub, to, done }) => (
              <li key={title}>
                <Link to={to} className="card-hover flex items-center gap-4 rounded-2xl border border-[#efe9de] p-4">
                  <span className={`grid size-10 place-items-center rounded-xl ${done ? 'bg-jg-500 text-ink' : 'bg-cream text-pine'}`}>{done ? <CheckCircle2 className="size-5" /> : <Icon className="size-5" />}</span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-[14.5px] font-medium ${done ? 'text-moss line-through' : ''}`}>{title}</span>
                    <span className="block text-[12.5px] text-moss">{sub}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold">Recent tests</h2>
            <Link to="/app/results" className="text-[13px] text-jg-600 hover:text-jg-700">
              See all
            </Link>
          </div>
          {s.attempts.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#e3dccf] p-8 text-center text-[13px] text-moss">No tests yet. Your results will show up here.</div>
          ) : (
            <ul className="mt-4 divide-y divide-[#efe9de]">
              {s.attempts
                .slice(-5)
                .reverse()
                .map((a) => (
                  <li key={a.id}>
                    <Link to={`/app/results/${a.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-jg-700">
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-medium">{a.testName}</span>
                        <span className="text-[12px] capitalize text-moss">
                          {a.mode} mode, {new Date(a.finishedAt).toLocaleDateString()}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block font-serif text-[20px] tabular-nums">{a.scaled}</span>
                        <span className="text-[11px] text-moss">
                          {a.raw}/{a.total}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
