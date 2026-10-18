import { useEffect, useState } from 'react'
import { Check, Sparkles, X } from 'lucide-react'
import { isCorrect, loadIndex, loadTest, markActive, setStore, today, useStore, type TestQuestion } from '../store'
import { HumoExplain } from './HumoExplain'
import { Passage } from '../pages/TakeTest'

/** One question per day, the same for every student — a reason to open the app daily. */
export function DailyQuestion() {
  const s = useStore()
  const [item, setItem] = useState<{ q: TestQuestion; testId: string; key: string } | null>(null)
  const day = today()
  const answered = s.planDone[`daily:${day}`]
  const [value, setValue] = useState<string | null>(null)

  useEffect(() => {
    const n = Math.floor(Date.now() / 86400000)
    loadIndex().then(async (idx) => {
      const t = await loadTest(idx[n % idx.length].id)
      const flat = t.modules.flatMap((m, mi) => m.questions.map((q, qi) => ({ q, key: `${mi}:${qi}` }))).filter((x) => x.q.format === 'mc')
      const pick = flat[(n * 7) % flat.length]
      setItem({ ...pick, testId: t.id })
    })
  }, [])

  const streakDays = Object.keys(s.planDone).filter((k) => k.startsWith('daily:') && !k.endsWith(':ok')).length
  if (!item) return <div className="skeleton h-48 rounded-[24px]" />
  const chosen = value ?? (answered ? (s.planDone[`daily:${day}:ok`] ? String(item.q.correct) : null) : null)
  const done = answered || value != null

  function answer(k: number) {
    if (done) return
    setValue(String(k))
    const ok = isCorrect(item!.q, String(k))
    setStore((x) => ({ ...x, planDone: { ...x.planDone, [`daily:${day}`]: true, [`daily:${day}:ok`]: ok }, practice: { solved: x.practice.solved + 1, correct: x.practice.correct + (ok ? 1 : 0) } }))
    markActive(60, 'daily')
  }

  return (
    <section className="card p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[16px] font-semibold">
          <Sparkles className="size-4 text-jg-600" /> Daily question
        </h2>
        <span className="text-[12px] text-moss">{streakDays} answered so far</span>
      </div>
      {item.q.passage && (
        <div className="mt-4 max-h-56 overflow-y-auto rounded-2xl bg-cream p-4">
          <Passage html={item.q.passage} />
        </div>
      )}
      <p className="mt-4 whitespace-pre-wrap text-[15px] font-medium">{item.q.question}</p>
      <div className="mt-4 grid gap-2">
        {item.q.options.map((o, k) => {
          const right = done && item.q.correct === k
          const wrong = done && chosen === String(k) && item.q.correct !== k
          return (
            <button key={k} disabled={done} onClick={() => answer(k)} className={`flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-[14px] ${right ? 'border-emerald-500 bg-emerald-50 animate-pop' : wrong ? 'border-red-400 bg-red-50 animate-shake' : 'border-[#e6e0d3] hover:border-[#c9c0ad]'}`}>
              <span className="grid size-6 shrink-0 place-items-center rounded-full border border-pine/30 text-[11px] font-bold">{'ABCD'[k]}</span>
              <span className="prose-q flex-1" dangerouslySetInnerHTML={{ __html: o }} />
              {right && <Check className="size-5 text-emerald-600" />}
              {wrong && <X className="size-5 text-red-500" />}
            </button>
          )
        })}
      </div>
      {done && (
        <div className="mt-4">
          <HumoExplain testId={item.testId} qKey={item.key} q={item.q} compact />
          <p className="mt-3 text-[12px] text-moss">A new question appears tomorrow.</p>
        </div>
      )}
    </section>
  )
}
