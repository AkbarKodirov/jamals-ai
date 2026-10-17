import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { setStore, today, useStore } from '../store'

type Task = { id: string; title: string; to: string; min: number }

// A balanced week used by Jamals Academy teachers: skill work early, a full test on Saturday, review on Sunday.
const WEEK: ((weak: string) => Task[])[] = [
  (w) => [{ id: 'drill-rw', title: 'Drill: Reading & Writing, 20 questions', to: '/app/drills', min: 30 }, { id: 'vocab', title: 'Daily 20 words', to: '/app/vocab', min: 10 }, { id: 'weak', title: `Drill: ${w}, 10 questions`, to: `/app/drills?skill=${encodeURIComponent(w)}`, min: 15 }],
  () => [{ id: 'drill-m', title: 'Drill: Math, 20 questions', to: '/app/drills', min: 30 }, { id: 'vocab', title: 'Daily 20 words', to: '/app/vocab', min: 10 }],
  () => [{ id: 'mistakes', title: 'Fix 10 mistakes from your notebook', to: '/app/mistakes', min: 25 }, { id: 'lesson', title: 'One lesson + Ask Humo', to: '/app/lessons', min: 20 }],
  (w) => [{ id: 'drill-weak', title: `Drill your weakest skill: ${w}`, to: `/app/drills?skill=${encodeURIComponent(w)}`, min: 30 }, { id: 'vocab', title: 'Daily 20 words', to: '/app/vocab', min: 10 }],
  () => [{ id: 'blitz', title: 'Two Blitz runs (pacing)', to: '/app/blitz', min: 15 }, { id: 'vocab-cards', title: 'Flashcards: due words', to: '/app/vocab', min: 15 }],
  () => [{ id: 'test', title: 'Full practice test in exam mode', to: '/app/tests', min: 70 }],
  () => [{ id: 'review', title: "Review Saturday's test with Humo", to: '/app/results', min: 30 }],
]

const iso = (d: Date) => d.toISOString().slice(0, 10)
function mondayOf(d: Date) {
  const x = new Date(d)
  const day = (x.getDay() + 6) % 7
  x.setDate(x.getDate() - day)
  x.setHours(12, 0, 0, 0)
  return x
}

export default function StudyPlan() {
  const s = useStore()
  const [offset, setOffset] = useState(0)
  const start = mondayOf(new Date())
  start.setDate(start.getDate() + offset * 7)
  const weak = s.weakSkills[0] ?? 'Words in context'
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    return { date: iso(d), d, tasks: WEEK[i](weak) }
  })
  const all = days.flatMap((d) => d.tasks.map((t) => `${d.date}:${t.id}`))
  const done = all.filter((k) => s.planDone[k]).length
  const weeksLeft = s.profile.testDate ? Math.max(0, Math.ceil((new Date(s.profile.testDate).getTime() - Date.now()) / (7 * 86400000))) : null
  const minutes = days.reduce((a, d) => a + d.tasks.reduce((b, t) => b + t.min, 0), 0)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[clamp(2rem,4vw,2.75rem)]">Study plan</h1>
          <p className="mt-2 text-[15px] text-moss">
            {weeksLeft != null ? `${weeksLeft} week${weeksLeft === 1 ? '' : 's'} until your SAT. ` : 'Set your test date on Home to count down. '}About {Math.round(minutes / 60)} hours a week, focused on {weak}.
          </p>
        </div>
        <div className="card flex items-center gap-1 p-1.5">
          <button aria-label="Previous week" onClick={() => setOffset((o) => o - 1)} className="rounded-xl p-2 hover:bg-cream">
            <ChevronLeft className="size-4" />
          </button>
          <span className="flex items-center gap-2 px-2 text-[13.5px] font-medium">
            <CalendarDays className="size-4 text-jg-600" />
            {days[0].d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – {days[6].d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          <button aria-label="Next week" onClick={() => setOffset((o) => o + 1)} className="rounded-xl p-2 hover:bg-cream">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="card mt-6 flex items-center gap-4 p-5">
        <div className="flex-1">
          <div className="flex justify-between text-[13px]">
            <span className="font-semibold">This week</span>
            <span className="tabular-nums text-moss">
              {done}/{all.length} tasks
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-cream">
            <div className="h-full rounded-full bg-gradient-to-r from-jg-700 to-jg-400 transition-all" style={{ width: `${(done / all.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {days.map(({ date, d, tasks }) => {
          const isToday = date === today()
          return (
            <section key={date} className={`card p-4 ${isToday ? 'ring-2 ring-jg-500' : ''}`}>
              <p className="flex items-center justify-between text-[13px]">
                <span className="font-semibold">{d.toLocaleDateString(undefined, { weekday: 'long' })}</span>
                <span className={isToday ? 'rounded-full bg-jg-500 px-2 py-0.5 text-[11px] font-semibold text-ink' : 'text-moss'}>{isToday ? 'Today' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </p>
              <ul className="mt-3 space-y-2">
                {tasks.map((t) => {
                  const k = `${date}:${t.id}`
                  const ok = !!s.planDone[k]
                  return (
                    <li key={k} className="flex items-start gap-2.5 rounded-xl border border-[#efe9de] p-2.5">
                      <button
                        aria-label={ok ? 'Mark not done' : 'Mark done'}
                        onClick={() => setStore((x) => ({ ...x, planDone: { ...x.planDone, [k]: !ok } }))}
                        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 ${ok ? 'border-jg-500 bg-jg-500 text-ink' : 'border-[#d6cdbb]'}`}
                      >
                        {ok && <Check className="size-3.5" strokeWidth={3} />}
                      </button>
                      <Link to={t.to} className={`min-w-0 flex-1 text-[13px] leading-snug hover:text-jg-700 ${ok ? 'text-moss line-through' : ''}`}>
                        {t.title}
                        <span className="block text-[11px] text-moss no-underline">{t.min} min</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
