import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { isCorrect, loadTest, markActive, setStore, useAsync, useStore } from '../store'
import { HumoExplain } from '../components/HumoExplain'
import { Passage, QuestionBody } from './TakeTest'

function MistakeCard({ k, testId, module, index }: { k: string; testId: string; module: number; index: number }) {
  const { data: test } = useAsync(() => loadTest(testId), [testId])
  const [value, setValue] = useState<string | null>(null)
  const [show, setShow] = useState(false)
  if (!test) return <div className="card h-40 animate-pulse" />
  const q = test.modules[module].questions[index]
  const done = value != null && value !== ''
  const ok = done && isCorrect(q, value)

  function submit(v: string) {
    setValue(v)
    markActive(30)
    if (isCorrect(q, v)) setTimeout(() => setStore((s) => ({ ...s, mistakes: s.mistakes.map((m) => (m.key === k ? { ...m, cleared: true } : m)) })), 1600)
  }

  return (
    <article className="card p-5 sm:p-6">
      <p className="text-[12.5px] text-moss">
        {test.name} · Module {module + 1}, question {index + 1}
      </p>
      {q.passage && (
        <div className="mt-4 rounded-2xl bg-cream p-4">
          <Passage html={q.passage} />
        </div>
      )}
      <QuestionBody q={q} className="mt-4" />
      {q.format === 'mc' ? (
        <div className="mt-4 grid gap-2">
          {q.options.map((o, i) => {
            const right = done && q.correct === i
            const wrong = value === String(i) && q.correct !== i
            return (
              <button key={i} disabled={done} onClick={() => submit(String(i))} className={`flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-[14.5px] ${right ? 'border-emerald-500 bg-emerald-50' : wrong ? 'border-red-400 bg-red-50' : 'border-[#e6e0d3] hover:border-[#c9c0ad]'}`}>
                <span className="grid size-6 shrink-0 place-items-center rounded-full border border-pine/30 text-[11px] font-bold">{'ABCD'[i]}</span>
                <span className="prose-q flex-1" dangerouslySetInnerHTML={{ __html: o }} />
                {right && <Check className="size-5 text-emerald-600" />}
                {wrong && <X className="size-5 text-red-500" />}
              </button>
            )
          })}
        </div>
      ) : (
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            const v = new FormData(e.currentTarget).get('a') as string
            if (v) submit(v)
          }}
        >
          <input name="a" disabled={done} className="w-40 rounded-xl border-2 border-[#e6e0d3] px-3 py-2 font-mono focus:border-pine focus:outline-none" />
          <button disabled={done} className="btn btn-dark h-11 px-4 text-[13px]">
            Check
          </button>
        </form>
      )}
      {done && <p className={`mt-3 text-[14px] font-semibold ${ok ? 'text-emerald-600' : 'text-red-600'}`}>{ok ? 'Fixed — removing it from your notebook.' : q.format === 'sa' ? `Not yet. The answer is ${q.answer}.` : 'Not yet. Read Humo below.'}</p>}
      {(done || show) && (
        <div className="mt-4">
          <HumoExplain testId={testId} qKey={`${module}:${index}`} q={q} compact />
        </div>
      )}
      {!done && !show && (
        <button onClick={() => setShow(true)} className="mt-4 text-[13px] font-medium text-jg-700 hover:text-jg-600">
          Show Humo's explanation
        </button>
      )}
    </article>
  )
}

export default function Mistakes() {
  const s = useStore()
  const open = s.mistakes.filter((m) => !m.cleared).slice(-40).reverse()
  const cleared = s.mistakes.filter((m) => m.cleared).length
  return (
    <div>
      <h1 className="display text-[clamp(2rem,4vw,2.75rem)]">Mistakes</h1>
      <p className="mt-2 text-[15px] text-moss">
        Every question you miss lands here. Get it right once and it leaves the notebook. {cleared > 0 && `${cleared} fixed so far.`}
      </p>
      {open.length === 0 ? (
        <div className="card mt-6 p-12 text-center">
          <p className="text-[15px]">Your notebook is empty.</p>
          <p className="mt-1 text-[13px] text-moss">Take a practice test — anything you miss will show up here.</p>
          <Link to="/app/tests" className="btn btn-dark mt-5 h-11 px-6 text-[14px]">
            Go to practice tests
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {open.map((m) => (
            <MistakeCard key={m.key} k={m.key} testId={m.testId} module={m.module} index={m.index} />
          ))}
        </div>
      )}
    </div>
  )
}
