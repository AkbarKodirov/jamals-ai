import { useRef, useState } from 'react'
import { Confetti } from '../../components/motion'
import { useSearchParams } from 'react-router-dom'
import { BookOpen, Calculator, Check, X } from 'lucide-react'
import { isCorrect, loadIndex, loadTest, markActive, setStore, skillOf, SKILLS, useStore, type Skill, type TestQuestion } from '../store'
import { HumoExplain } from '../components/HumoExplain'
import { Passage, QuestionBody } from './TakeTest'

type Item = { q: TestQuestion; testId: string; key: string }

async function buildDrill(subject: 'EBRW' | 'MATH', n: number, skill: Skill | null): Promise<Item[]> {
  const idx = (await loadIndex()).filter((t) => t.type === subject)
  const tests = await Promise.all(idx.map((t) => loadTest(t.id)))
  const items = tests
    .flatMap((t) => t.modules.flatMap((m, mi) => m.questions.map((q, qi) => ({ q, testId: t.id, key: `${mi}:${qi}` }))))
    .filter((it) => !skill || skillOf(it.q, subject) === skill)
  return items.sort(() => Math.random() - 0.5).slice(0, n)
}

export default function Drills() {
  const s = useStore()
  const [params] = useSearchParams()
  const initialSkill = (SKILLS as readonly string[]).includes(params.get('skill') ?? '') ? (params.get('skill') as Skill) : null
  const [subject, setSubject] = useState<'EBRW' | 'MATH'>(initialSkill ? (SKILLS.indexOf(initialSkill) >= 8 ? 'MATH' : 'EBRW') : params.get('subject') === 'MATH' ? 'MATH' : 'EBRW')
  const [skill, setSkill] = useState<Skill | null>(initialSkill)
  const [n, setN] = useState(10)
  const [items, setItems] = useState<Item[] | null>(null)
  const [i, setI] = useState(0)
  const [value, setValue] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [right, setRight] = useState(0)
  const [loading, setLoading] = useState(false)
  const started = useRef(0)

  async function start() {
    setLoading(true)
    setItems(await buildDrill(subject, n, skill))
    setLoading(false)
    setI(0)
    setRight(0)
    setValue(null)
    setChecked(false)
    started.current = Date.now()
  }

  function check() {
    if (!items) return
    setChecked(true)
    if (isCorrect(items[i].q, value)) setRight((r) => r + 1)
  }
  function next() {
    if (!items) return
    if (i + 1 >= items.length) {
      const secs = Math.round((Date.now() - started.current) / 1000)
      setStore((x) => ({ ...x, drills: [...x.drills, { at: Date.now(), subject, n: items.length, correct: right, seconds: secs }], practice: { solved: x.practice.solved + items.length, correct: x.practice.correct + right } }))
      markActive(secs, 'drill', subject)
      setI(items.length)
      return
    }
    setI((x) => x + 1)
    setValue(null)
    setChecked(false)
  }

  // setup screen
  if (!items)
    return (
      <div>
        <h1 className="display text-[clamp(2rem,4vw,2.75rem)]">Drills</h1>
        <p className="mt-2 max-w-xl text-[15px] text-moss">Short sets of questions, one at a time. Check each answer and Humo explains it on the spot.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(
            [
              ['EBRW', 'Reading & Writing', BookOpen, 'bg-jg-50 text-jg-700', '432 questions'],
              ['MATH', 'Math', Calculator, 'bg-sky-50 text-sky-700', '44 questions'],
            ] as const
          ).map(([id, name, Icon, c, count]) => (
            <button
              key={id}
              onClick={() => {
                setSubject(id)
                setSkill(null)
              }} aria-pressed={subject === id} className={`card p-6 text-left transition ${subject === id ? 'ring-2 ring-jg-500' : 'card-hover'}`}>
              <span className={`grid size-11 place-items-center rounded-2xl ${c}`}>
                <Icon className="size-5" />
              </span>
              <p className="mt-4 font-serif text-[24px]">{name}</p>
              <p className="text-[13px] text-moss">{count} in the pool</p>
            </button>
          ))}
        </div>
        <div className="card mt-3 p-5">
          <p className="text-[14px] font-medium">Skill</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => setSkill(null)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium ${!skill ? 'bg-pine text-cream' : 'bg-cream'}`}>
              Mixed
            </button>
            {SKILLS.slice(subject === 'MATH' ? 8 : 0, subject === 'MATH' ? 12 : 8).map((k) => (
              <button key={k} onClick={() => setSkill(k)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium ${skill === k ? 'bg-pine text-cream' : 'bg-cream'}`}>
                {k}
              </button>
            ))}
          </div>
        </div>
        <div className="card mt-3 flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-2 text-[14px]">
            <span className="font-medium">Questions</span>
            {[5, 10, 20].map((k) => (
              <button key={k} onClick={() => setN(k)} className={`rounded-full px-4 py-1.5 text-[13px] font-medium ${n === k ? 'bg-pine text-cream' : 'bg-cream'}`}>
                {k}
              </button>
            ))}
          </div>
          <button onClick={start} disabled={loading} className="btn btn-dark h-11 px-6 text-[14px]">
            {loading ? 'Preparing…' : 'Start drill'}
          </button>
        </div>
        {s.drills.length > 0 && (
          <div className="card mt-3 p-5">
            <p className="text-[14px] font-semibold">Recent drills</p>
            <ul className="mt-3 divide-y divide-[#efe9de] text-[13.5px]">
              {s.drills
                .slice(-6)
                .reverse()
                .map((d) => (
                  <li key={d.at} className="flex justify-between py-2">
                    <span>
                      {d.subject === 'MATH' ? 'Math' : 'Reading & Writing'} · {new Date(d.at).toLocaleDateString()}
                    </span>
                    <span className="tabular-nums text-moss">
                      {d.correct}/{d.n} · {Math.round(d.seconds / d.n)}s each
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    )

  if (i >= items.length)
    return (
      <div className="card relative mx-auto max-w-md p-8 text-center">
        <Confetti fire={right / items.length >= 0.8} />
        <img src="/humo-mark.svg" alt="" className="mx-auto size-14 rounded-2xl" />
        <h2 className="display mt-5 text-[40px] tabular-nums">
          {right}/{items.length}
        </h2>
        <p className="mt-1 text-[14px] text-moss">Missed questions are explained above each one — run another drill to lock it in.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={start} className="btn btn-dark h-11 px-5 text-[14px]">
            Another drill
          </button>
          <button onClick={() => setItems(null)} className="btn btn-ghost h-11 px-5 text-[14px]">
            Change settings
          </button>
        </div>
      </div>
    )

  const it = items[i]
  const ok = checked && isCorrect(it.q, value)
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between text-[13px] text-moss">
        <button onClick={() => setItems(null)} className="flex items-center gap-1 hover:text-pine">
          <X className="size-4" /> End drill
        </button>
        <span className="tabular-nums">
          {i + 1}/{items.length} · {right} correct
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#ece6da]">
        <div className="h-full rounded-full bg-jg-500 transition-all" style={{ width: `${(i / items.length) * 100}%` }} />
      </div>
      <div className="card mt-5 p-6 sm:p-7">
        {it.q.passage && (
          <div className="mb-5 rounded-2xl bg-cream p-4">
            <Passage html={it.q.passage} />
          </div>
        )}
        <QuestionBody q={it.q} />
        {it.q.format === 'mc' ? (
          <div className="mt-5 grid gap-2">
            {it.q.options.map((o, k) => {
              const picked = value === String(k)
              const r = checked && it.q.correct === k
              const w = checked && picked && it.q.correct !== k
              return (
                <button key={k} disabled={checked} onClick={() => setValue(String(k))} className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-[14.5px] ${r ? 'border-emerald-500 bg-emerald-50 animate-pop' : w ? 'border-red-400 bg-red-50 animate-shake' : picked ? 'border-pine bg-cream' : 'border-[#e6e0d3] hover:border-[#c9c0ad]'}`}>
                  <span className={`grid size-6 shrink-0 place-items-center rounded-full border-2 text-[11px] font-bold ${picked ? 'border-pine bg-pine text-cream' : 'border-pine/30'}`}>{'ABCD'[k]}</span>
                  <span className="prose-q flex-1" dangerouslySetInnerHTML={{ __html: o }} />
                  {r && <Check className="size-5 text-emerald-600" />}
                  {w && <X className="size-5 text-red-500" />}
                </button>
              )
            })}
          </div>
        ) : (
          <input disabled={checked} inputMode="decimal" value={value ?? ''} onChange={(e) => setValue(e.target.value.replace(/[^0-9./-]/g, '').slice(0, 6))} placeholder="Your answer" className="mt-5 w-48 rounded-xl border-2 border-[#e6e0d3] px-4 py-3 font-mono text-[18px] focus:border-pine focus:outline-none" />
        )}
        <div className="mt-5">
          {!checked ? (
            <button disabled={value == null || value === ''} onClick={check} className="btn btn-green h-10 px-5 text-[14px] disabled:opacity-40">
              Check answer
            </button>
          ) : (
            <div className="space-y-4">
              <p className={`text-[14px] font-semibold ${ok ? 'text-emerald-600' : 'text-red-600'}`}>{ok ? 'Correct!' : it.q.format === 'sa' ? `Not quite — the answer is ${it.q.answer}.` : 'Not quite.'}</p>
              <HumoExplain testId={it.testId} qKey={it.key} q={it.q} compact math={subject === 'MATH'} />
              <button onClick={next} className="btn btn-dark h-10 px-5 text-[14px]">
                {i + 1 < items.length ? 'Next question' : 'Finish drill'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
