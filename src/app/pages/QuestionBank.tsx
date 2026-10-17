import { useEffect, useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import { fullQuestionBank, type Question } from '../../fullQuestionBank'
import { markActive, setStore } from '../store'

function QuestionCard({ q }: { q: Question }) {
  const [picked, setPicked] = useState<string | null>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    setPicked(null)
    setShown(false)
  }, [q.id])
  return (
    <div className="card p-6">
      <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
        <span className="rounded-full bg-pine px-2.5 py-1 text-cream">{q.exam}</span>
        <span className="rounded-full bg-cream px-2.5 py-1 text-moss">{q.topic}</span>
        <span className={`rounded-full px-2.5 py-1 ${q.difficulty === 'Hard' ? 'bg-red-50 text-red-700' : q.difficulty === 'Medium' ? 'bg-orange-50 text-orange-700' : 'bg-jg-50 text-jg-700'}`}>{q.difficulty}</span>
      </div>
      <p className="mt-4 text-[16px] font-medium leading-snug">{q.question}</p>
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
                  setStore((s) => ({ ...s, practice: { solved: s.practice.solved + 1, correct: s.practice.correct + (ok ? 1 : 0) } }))
                  markActive(30)
                }}
                className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-[14.5px] transition ${
                  state === 'right' ? 'border-emerald-500 bg-emerald-50 animate-pop' : state === 'wrong' ? 'border-red-400 bg-red-50 animate-shake' : state === 'reveal' ? 'border-emerald-300' : 'border-[#e6e0d3] hover:border-[#c9c0ad]'
                }`}
              >
                {c}
                {state === 'right' && <Check className="size-4 text-emerald-600" />}
                {state === 'wrong' && <X className="size-4 text-red-500" />}
              </button>
            )
          })}
        </div>
      ) : (
        <button onClick={() => setShown(true)} className="btn btn-ghost mt-5 h-10 px-4 text-[13px]">
          Show what examiners look for
        </button>
      )}
      {(picked || shown) && (
        <div className="mt-5 flex gap-3 rounded-2xl border border-jg-500/25 bg-jg-50 p-4">
          <img src="/humo-mark.svg" alt="" className="size-7 shrink-0 rounded-lg" />
          <p className="text-[14px] leading-relaxed">{q.explanation}</p>
        </div>
      )}
    </div>
  )
}

export default function QuestionBank() {
  const [exam, setExam] = useState<'All' | 'Math' | 'Reading & Writing'>('All')
  const [diff, setDiff] = useState<'All' | Question['difficulty']>('All')
  const list = useMemo(() => fullQuestionBank.filter((q) => (exam === 'All' || q.section === exam) && (diff === 'All' || q.difficulty === diff)), [exam, diff])
  const chip = (on: boolean) => `rounded-full px-4 py-2 text-[13px] font-medium transition ${on ? 'bg-pine text-cream' : 'bg-white ring-1 ring-[#e3dccf] hover:ring-[#cfc6b4]'}`
  return (
    <div>
      <h1 className="display text-[clamp(2rem,4vw,2.75rem)]">Question bank</h1>
      <p className="mt-2 text-[15px] text-moss">{list.length} single questions with explanations. For full sections, use Practice tests.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {(['All', 'Reading & Writing', 'Math'] as const).map((e) => (
          <button key={e} onClick={() => setExam(e)} className={chip(exam === e)}>
            {e}
          </button>
        ))}
        <span className="mx-1 w-px bg-[#e3dccf]" />
        {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
          <button key={d} onClick={() => setDiff(d)} className={chip(diff === d)}>
            {d === 'All' ? 'Any difficulty' : d}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {list.map((q) => (
          <QuestionCard key={q.id} q={q} />
        ))}
      </div>
    </div>
  )
}
