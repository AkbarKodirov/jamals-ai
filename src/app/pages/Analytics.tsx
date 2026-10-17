import { Link } from 'react-router-dom'
import { WORDS } from '../../data/vocab'
import { loadTest, skillBreakdown, useAsync, useStore, type Test } from '../store'
import { SkillBars } from '../components/SkillBars'

function Bar({ label, value, sub, tone = 'from-jg-700 to-jg-400' }: { label: string; value: number | null; sub?: string; tone?: string }) {
  return (
    <div>
      <div className="flex justify-between text-[13px]">
        <span>{label}</span>
        <span className="tabular-nums text-moss">{value == null ? '–' : `${value}%`}</span>
      </div>
      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-cream">
        <div className={`h-full rounded-full bg-gradient-to-r ${tone}`} style={{ width: `${value ?? 0}%` }} />
      </div>
      {sub && <p className="mt-1 text-[11.5px] text-moss">{sub}</p>}
    </div>
  )
}

export default function Analytics() {
  const s = useStore()
  const section = (type: 'EBRW' | 'MATH') => {
    const att = s.attempts.filter((a) => a.type === type)
    const dr = s.drills.filter((d) => d.subject === type)
    const total = att.reduce((x, a) => x + a.total, 0) + dr.reduce((x, d) => x + d.n, 0)
    const right = att.reduce((x, a) => x + a.raw, 0) + dr.reduce((x, d) => x + d.correct, 0)
    const secs = att.reduce((x, a) => x + a.answers.reduce((y, q) => y + q.seconds, 0), 0) + dr.reduce((x, d) => x + d.seconds, 0)
    return { acc: total ? Math.round((right / total) * 100) : null, total, pace: total ? Math.round(secs / total) : null }
  }
  const rw = section('EBRW')
  const m = section('MATH')

  // pacing: Digital SAT gives ~71s per R&W question and ~95s per Math question
  const pace = (v: number | null, target: number) => (v == null ? null : Math.min(100, Math.round((target / Math.max(v, 1)) * 100)))

  // activity heatmap, last 12 weeks
  const days = new Set(s.activeDays)
  const cells = Array.from({ length: 84 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (83 - i))
    const k = d.toISOString().slice(0, 10)
    return { k, on: days.has(k) }
  })

  const vocabAll = [...WORDS.map((w) => w.word), ...s.customWords.map((w) => w.word)]
  const mastered = vocabAll.filter((w) => (s.vocab[w]?.reps ?? 0) >= 3).length
  const learning = vocabAll.filter((w) => s.vocab[w] && s.vocab[w].reps < 3).length

  const ids = [...new Set(s.attempts.map((a) => a.testId))].join(',')
  const { data: tests } = useAsync(() => Promise.all(ids ? ids.split(',').map((id) => loadTest(id).catch(() => null)) : []), [ids])
  const byId = new Map((tests ?? []).filter(Boolean).map((t) => [(t as Test).id, t as Test]))
  const skills = skillBreakdown(
    s.attempts.flatMap((a) => {
      const t = byId.get(a.testId)
      return t ? a.answers.filter((x) => t.modules[x.module]?.questions[x.index]).map((x) => ({ q: t.modules[x.module].questions[x.index], type: a.type, correct: x.correct })) : []
    }),
  )
  const modeCount = (mode: string) => s.attempts.filter((a) => a.mode === mode).length
  const trend = s.attempts.slice(-12)

  if (!s.attempts.length && !s.drills.length)
    return (
      <div>
        <h1 className="display text-[clamp(2rem,4vw,2.75rem)]">Analytics</h1>
        <div className="card mt-6 p-12 text-center">
          <p className="text-[15px]">Your analytics appear after your first test or drill.</p>
          <div className="mt-5 flex justify-center gap-2">
            <Link to="/app/tests" className="btn btn-dark h-11 px-5 text-[14px]">
              Take a practice test
            </Link>
            <Link to="/app/drills" className="btn btn-ghost h-11 px-5 text-[14px]">
              Start a drill
            </Link>
          </div>
        </div>
      </div>
    )

  return (
    <div>
      <h1 className="display text-[clamp(2rem,4vw,2.75rem)]">Analytics</h1>
      <p className="mt-2 text-[15px] text-moss">From every test, drill and vocab session on this device.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="card space-y-5 p-6">
          <h2 className="text-[15px] font-semibold">Accuracy by section</h2>
          <Bar label="Reading & Writing" value={rw.acc} sub={`${rw.total} questions answered`} />
          <Bar label="Math" value={m.acc} sub={`${m.total} questions answered`} tone="from-sky-700 to-sky-400" />
        </section>
        <section className="card space-y-5 p-6">
          <h2 className="text-[15px] font-semibold">Pacing</h2>
          <Bar label={`Reading & Writing · ${rw.pace ?? '–'}s per question`} value={pace(rw.pace, 71)} sub="Test day allows about 71 seconds per question" tone="from-orange-600 to-orange-400" />
          <Bar label={`Math · ${m.pace ?? '–'}s per question`} value={pace(m.pace, 95)} sub="Test day allows about 95 seconds per question" tone="from-orange-600 to-orange-400" />
        </section>

        {skills.length > 0 && (
          <section className="card p-6 lg:col-span-2">
            <h2 className="text-[15px] font-semibold">Accuracy by skill, weakest first</h2>
            <p className="mt-1 text-[12.5px] text-moss">Across all your tests. Drill and read the lesson for the top two.</p>
            <div className="mt-5 ">
              <SkillBars stats={skills} />
            </div>
          </section>
        )}
        <section className="card p-6">
          <h2 className="text-[15px] font-semibold">Score trend</h2>
          {trend.length < 2 ? (
            <p className="mt-6 text-[13px] text-moss">Take two or more tests to see your trend.</p>
          ) : (
            <div className="mt-5 flex h-36 items-end gap-2">
              {trend.map((a) => (
                <Link key={a.id} to={`/app/results/${a.id}`} title={`${a.testName}: ${a.scaled}`} className="group flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <span className="text-[10.5px] tabular-nums text-moss">{a.scaled}</span>
                  <span className={`w-full max-w-9 rounded-t-md ${a.type === 'MATH' ? 'bg-sky-400' : 'bg-jg-500'} group-hover:opacity-80`} style={{ height: `${((a.scaled - 200) / 600) * 100}%` }} />
                </Link>
              ))}
            </div>
          )}
          <p className="mt-4 text-[12px] text-moss">
            Modes used: exam {modeCount('exam')}, practice {modeCount('practice')}, sprint {modeCount('sprint')}
          </p>
        </section>

        <section className="card p-6">
          <h2 className="text-[15px] font-semibold">Activity, last 12 weeks</h2>
          <div className="mt-4 grid w-fit grid-flow-col grid-rows-7 gap-1">
            {cells.map((c) => (
              <span key={c.k} title={c.k} className={`size-3.5 rounded-[3px] sm:size-4 ${c.on ? 'bg-jg-500' : 'bg-[#efe9de]'}`} />
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              ['Mastered words', mastered],
              ['Learning', learning],
              ['Study hours', (s.studySeconds / 3600).toFixed(1)],
            ].map(([l, v]) => (
              <div key={l as string} className="rounded-2xl bg-cream p-3">
                <p className="font-serif text-[22px] tabular-nums">{v}</p>
                <p className="text-[11.5px] text-moss">{l}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
