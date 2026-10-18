import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Calculator, Check, ChevronRight, Lightbulb, Shuffle, Sparkles, X } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { desmosSolve, HumoOffline, type DesmosSolve } from '../humo'
import { markActive, setStore, useStore } from '../store'
import { LiveDesmos } from '../../desmos/DesmosScreen'
import { HumoReply } from '../components/HumoDrawer'
import { ScoreRing } from '../../components/motion'

type BankQ = {
  id: string
  domain: string
  skill: string
  difficulty: 'hard' | 'very hard'
  type: 'spr' | 'mcq'
  question: string
  choices?: Record<string, string>
  answer: string
  hints: string[]
  desmos: string[]
  look_for: string
  why: string
  trap: string
  rule: string
}

let bankP: Promise<BankQ[]> | null = null
const loadBank = () => (bankP ??= fetch('/desmos/bank.json').then((r) => r.json()))

const DOMAINS = ['All', 'Algebra', 'Advanced Math', 'Problem-Solving and Data Analysis', 'Geometry and Trigonometry']
const SHORT: Record<string, string> = { 'Problem-Solving and Data Analysis': 'Data analysis', 'Geometry and Trigonometry': 'Geometry & trig' }

function value(s: string) {
  const t = s.replace(/\s/g, '').replace(/^\+/, '')
  if (/^-?\d+\/\d+$/.test(t)) {
    const [a, b] = t.split('/').map(Number)
    return b ? a / b : NaN
  }
  return Number(t)
}
function same(given: string, answer: string) {
  const a = answer.split(/\s*(?:or|,|;|\|)\s*/).filter(Boolean)
  return a.some((x) => x.replace(/\s/g, '').toLowerCase() === given.replace(/\s/g, '').toLowerCase() || Math.abs(value(x) - value(given)) < 1e-3)
}

function HumoScreen({ q }: { q: BankQ }) {
  const { token } = useAuth()
  const [st, setSt] = useState<{ data?: DesmosSolve; error?: string }>({})
  useEffect(() => {
    let alive = true
    desmosSolve({ bankId: q.id }, token)
      .then((data) => alive && setSt({ data }))
      .catch((e) => alive && setSt({ error: e instanceof HumoOffline ? `Humo is offline: ${e.message}` : e.message }))
    return () => {
      alive = false
    }
  }, [q.id, token])
  if (st.error) return <p className="rounded-xl bg-cream px-4 py-3 text-[13px] text-moss">{st.error} The walkthrough above is complete without it.</p>
  if (!st.data)
    return (
      <div className="rounded-2xl border border-[#dcd5c6] bg-white p-4">
        <p className="flex items-center gap-2 text-[13px] font-medium text-pine">
          <span className="size-4 animate-spin rounded-full border-2 border-[#2d70b3] border-t-transparent" /> Humo is typing it into Desmos and checking every number…
        </p>
        <div className="mt-3 grid grid-cols-[1fr_1.2fr] gap-2">
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-9 rounded-lg" />
            ))}
          </div>
          <div className="skeleton h-32 rounded-lg" />
        </div>
      </div>
    )
  return (
    <div className="text-[14px] leading-relaxed text-pine">
      <HumoReply msg={{ role: 'humo', text: st.data.text, desmos: st.data.desmos }} />
    </div>
  )
}

export default function DesmosLab() {
  const s = useStore()
  const [bank, setBank] = useState<BankQ[] | null>(null)
  const [domain, setDomain] = useState('All')
  const [hard, setHard] = useState<'all' | 'hard' | 'very hard'>('all')
  const [cur, setCur] = useState<BankQ | null>(null)
  const [given, setGiven] = useState('')
  const [result, setResult] = useState<null | boolean>(null)
  const [hints, setHints] = useState(0)
  const [solved, setSolved] = useState(false)
  const [calc, setCalc] = useState(false)
  const [wrong, setWrong] = useState(0)

  useEffect(() => {
    loadBank().then(setBank)
  }, [])

  const pool = useMemo(() => (bank ?? []).filter((q) => (domain === 'All' || q.domain === domain) && (hard === 'all' || q.difficulty === hard)), [bank, domain, hard])
  const done = Object.values(s.desmosLab).filter((d) => d.solved).length

  function pick() {
    if (!pool.length) return
    const fresh = pool.filter((q) => !s.desmosLab[q.id]?.solved && q.id !== cur?.id)
    const from = fresh.length ? fresh : pool
    setCur(from[Math.floor(Math.random() * from.length)])
    setGiven('')
    setResult(null)
    setHints(0)
    setSolved(false)
    setWrong(0)
  }
  useEffect(() => {
    if (bank && !cur) pick()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank])

  function check(v = given) {
    if (!cur || !v.trim()) return
    const ok = same(v, cur.answer)
    setResult(ok)
    if (!ok) setWrong((w) => w + 1)
    if (ok || wrong + 1 >= 2) setSolved(ok ? solved : true)
    setStore((x) => ({ ...x, desmosLab: { ...x.desmosLab, [cur.id]: { tries: (x.desmosLab[cur.id]?.tries ?? 0) + 1, solved: ok || !!x.desmosLab[cur.id]?.solved, at: Date.now() } } }))
    markActive(45, 'desmos', 'MATH')
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-[28px] bg-pine p-6 text-cream sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-[#2d70b3]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-40 size-60 rounded-full bg-jg-500/25 blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-6">
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-jg-300">
              <Sparkles className="size-3.5" /> The only Desmos AI tutor in Uzbekistan
            </p>
            <h1 className="display mt-3 text-[clamp(2rem,4vw,2.9rem)] leading-[1.05]">Desmos Lab</h1>
            <p className="mt-2 max-w-xl text-[14.5px] text-cream/75">132 hard, verified Math questions in the patterns the Digital SAT keeps using. Solve them in Desmos, climb the hint ladder, then watch Humo type the solution into a real Desmos screen.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
            <ScoreRing value={done} max={bank?.length ?? 132} size={68} stroke={7}>
              <span className="text-[15px] font-semibold tabular-nums">{done}</span>
            </ScoreRing>
            <div className="text-[12.5px] text-cream/70">
              solved of {bank?.length ?? 132}
              <br />
              {Object.keys(s.desmosLab).length} tried
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {DOMAINS.map((d) => (
          <button key={d} onClick={() => setDomain(d)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${domain === d ? 'bg-pine text-cream' : 'bg-white ring-1 ring-[#e3dccf] hover:ring-jg-500'}`}>
            {SHORT[d] ?? d}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-[#e3dccf]" />
        {(['all', 'hard', 'very hard'] as const).map((h) => (
          <button key={h} onClick={() => setHard(h)} className={`rounded-full px-3 py-1.5 text-[12.5px] capitalize ${hard === h ? 'bg-[#2d70b3] text-white' : 'bg-white ring-1 ring-[#e3dccf]'}`}>
            {h}
          </button>
        ))}
        <button onClick={pick} className="btn btn-green ml-auto h-10 px-4 text-[13.5px]">
          <Shuffle className="size-4" /> Random question
        </button>
      </div>

      <AnimatePresence mode="wait">
        {cur && (
          <motion.div key={cur.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className={`mt-5 grid gap-4 ${calc ? 'xl:grid-cols-2' : ''}`}>
            <article className="card p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2 text-[12px]">
                <span className="rounded-full bg-[#2d70b3]/10 px-2.5 py-1 font-semibold text-[#2d70b3]">{cur.id}</span>
                <span className="rounded-full bg-cream px-2.5 py-1 text-moss">{cur.domain}</span>
                <span className={`rounded-full px-2.5 py-1 font-medium ${cur.difficulty === 'very hard' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{cur.difficulty}</span>
                {s.desmosLab[cur.id]?.solved && <span className="rounded-full bg-jg-50 px-2.5 py-1 font-medium text-jg-700">Solved before</span>}
                <button onClick={() => setCalc((c) => !c)} className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${calc ? 'bg-[#2d70b3] text-white' : 'bg-white text-[#2d70b3] ring-1 ring-[#2d70b3]/30'}`}>
                  <Calculator className="size-3.5" /> {calc ? 'Hide Desmos' : 'Open Desmos'}
                </button>
              </div>
              <p className="mt-2 text-[12.5px] text-moss">{cur.skill}</p>
              <p className="mt-4 whitespace-pre-line font-serif text-[18px] leading-[1.7] text-pine">{cur.question}</p>

              {cur.type === 'mcq' && cur.choices ? (
                <div className="mt-5 grid gap-2">
                  {Object.entries(cur.choices).map(([k, v]) => {
                    const chosen = given === k
                    const right = result != null && solved && k === cur.answer
                    return (
                      <button
                        key={k}
                        disabled={result === true}
                        onClick={() => {
                          setGiven(k)
                          check(k)
                        }}
                        className={`flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-[15px] transition ${right || (chosen && result) ? 'animate-pop border-emerald-500 bg-emerald-50' : chosen && result === false ? 'animate-shake border-red-400 bg-red-50' : 'border-[#e6e0d3] hover:border-[#c9c0ad]'}`}
                      >
                        <span className="grid size-6 shrink-0 place-items-center rounded-full border border-pine/30 text-[11px] font-bold">{k}</span>
                        <span className="flex-1 font-mono text-[14px]">{v}</span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <form
                  className="mt-5 flex flex-wrap items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    check()
                  }}
                >
                  <input value={given} onChange={(e) => setGiven(e.target.value.slice(0, 7))} disabled={result === true} placeholder="Your answer" className={`w-44 rounded-xl border-2 px-3 py-2.5 font-mono text-[16px] focus:outline-none ${result === false ? 'animate-shake border-red-400' : result ? 'border-emerald-500 bg-emerald-50' : 'border-[#e6e0d3] focus:border-pine'}`} />
                  <button disabled={result === true || !given.trim()} className="btn btn-dark h-12 px-5 text-[14px] disabled:opacity-50">
                    Check
                  </button>
                  <span className="text-[12px] text-moss">Fractions like 7/2 are fine.</span>
                </form>
              )}

              <AnimatePresence>
                {result != null && (
                  <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 flex items-center gap-2 text-[14.5px] font-semibold ${result ? 'text-emerald-600' : 'text-red-600'}`}>
                    {result ? <Check className="size-5" /> : <X className="size-5" />}
                    {result ? 'Correct — the Desmos route below shows the fastest way.' : wrong >= 2 ? 'Two misses — here is the full Desmos solve.' : `Not yet. Watch for this trap: ${cur.trap.split(/[.(]/)[0]}.`}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* hint ladder */}
              {!solved && result !== true && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {hints < cur.hints.length && (
                    <button onClick={() => setHints((h) => h + 1)} className="btn btn-ghost h-10 px-4 text-[13px]">
                      <Lightbulb className="size-4 text-amber-500" /> Hint {hints + 1}
                    </button>
                  )}
                  <button onClick={() => setSolved(true)} className="btn btn-ghost h-10 px-4 text-[13px]">
                    Solve it with Desmos <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
              <div className="mt-3 space-y-2">
                {cur.hints.slice(0, hints).map((h, i) => (
                  <motion.p key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-[13.5px] text-amber-900">
                    <span className="font-semibold">Hint {i + 1}.</span> {h}
                  </motion.p>
                ))}
              </div>

              {(solved || result === true) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-[#e6e0d3] bg-[#fbfaf7] p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-[#2d70b3]">Type this in Desmos</p>
                    <ol className="mt-2 space-y-1.5">
                      {cur.desmos.map((l, i) => (
                        <li key={i} className="flex gap-3 text-[14px]">
                          <span className="grid size-6 shrink-0 place-items-center rounded-md bg-white text-[11px] font-semibold text-moss ring-1 ring-[#e6e0d3]">{i + 1}</span>
                          <span className="font-mono text-[13.5px] leading-6 text-pine">{l}</span>
                        </li>
                      ))}
                    </ol>
                    <dl className="mt-4 grid gap-3 text-[13.5px] sm:grid-cols-2">
                      <div>
                        <dt className="font-semibold">Look for</dt>
                        <dd className="text-pine/80">{cur.look_for}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Answer</dt>
                        <dd className="font-mono text-[15px] font-bold text-jg-700">{cur.type === 'mcq' && cur.choices ? `${cur.answer}) ${cur.choices[cur.answer]}` : cur.answer}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Why</dt>
                        <dd className="text-pine/80">{cur.why}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Trap</dt>
                        <dd className="text-pine/80">{cur.trap}</dd>
                      </div>
                    </dl>
                    <p className="mt-4 rounded-xl bg-jg-50 px-3.5 py-2.5 text-[13.5px] text-jg-700">
                      <span className="font-semibold">Next time: </span>
                      {cur.rule}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold">
                      <img src="/humo-mark.svg" alt="" className="size-5 rounded-md" /> Humo's Desmos screen
                    </p>
                    <HumoScreen q={cur} />
                  </div>
                  <button onClick={pick} className="btn btn-dark h-11 w-full text-[14px]">
                    Next question <ChevronRight className="size-4" />
                  </button>
                </motion.div>
              )}
            </article>
            {calc && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="card overflow-hidden xl:sticky xl:top-6 xl:self-start">
                <LiveDesmos screen={{ lines: [], curves: [], points: [], window: [-10, 10, -10, 10] }} className="h-[70vh]" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {!bank && <div className="skeleton mt-5 h-80 rounded-[24px]" />}
      {bank && !pool.length && <p className="mt-6 text-center text-moss">No questions for this filter.</p>}
      <p className="mt-6 text-[12px] text-moss">Original questions written in the style of recurring Digital SAT patterns — predictions of question types, not leaked or official questions. Every answer was checked with a computer algebra system.</p>
    </div>
  )
}

