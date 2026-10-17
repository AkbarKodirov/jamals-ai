import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

type Choice = { label: string; value: string; correct?: boolean; humo: string[] }

const QUESTION = {
  meta: 'Digital SAT Math, Module 1, Algebra',
  stem: 'If 3(x − 2) = 2x + 5, what is the value of x?',
  choices: [
    {
      label: 'A',
      value: '−1',
      humo: [
        'Close — your distribution was right: 3x − 6 = 2x + 5.',
        'The slip came next. When −6 moves to the right side it becomes +6, so x = 5 + 6, not 5 − 6.',
        "Sign errors when moving terms cost students more points than any hard topic. I'll add 4 quick sign-moving drills to your plan.",
      ],
    },
    {
      label: 'B',
      value: '7',
      humo: [
        'You wrote 3x − 2 = 2x + 5. The 3 has to multiply both terms inside the parentheses.',
        '3(x − 2) = 3x − 6. Then 3x − 6 = 2x + 5, so x = 11.',
        'This is the classic "partial distribution" trap — the SAT puts 7 there on purpose. Want 3 more like it?',
      ],
    },
    {
      label: 'C',
      value: '11',
      correct: true,
      humo: [
        'Exactly right. 3x − 6 = 2x + 5 → x = 11.',
        'Fast check: 3(11 − 2) = 27 and 2(11) + 5 = 27. Plugging back in takes 5 seconds and catches most slips.',
        "You're ready for the harder version: same idea, but with fractions in the parentheses.",
      ],
    },
    {
      label: 'D',
      value: '11/2',
      humo: [
        'You subtracted x from 3x instead of 2x, which left 2x = 11.',
        'Collect the x-terms carefully: 3x − 2x = x, so x = 11.',
        "When an answer turns into a fraction on an 'easy' question, that's a signal to recheck your last step.",
      ],
    },
  ] as Choice[],
}

function Typed({ lines }: { lines: string[] }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    setShown(0)
    const id = setInterval(() => setShown((n) => (n < lines.length ? n + 1 : n)), 650)
    return () => clearInterval(id)
  }, [lines])
  return (
    <div className="space-y-2.5">
      {lines.slice(0, shown).map((l, i) => (
        <motion.p key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-[14.5px] leading-relaxed text-white/80">
          {l}
        </motion.p>
      ))}
      {shown < lines.length && (
        <span className="inline-flex gap-1 pt-1" aria-label="Humo is typing">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-1.5 animate-bounce rounded-full bg-jg-400" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </span>
      )}
    </div>
  )
}

export function TryHumo() {
  const [picked, setPicked] = useState<Choice | null>(null)

  return (
    <section id="try" className="scroll-mt-20 border-t border-white/[0.07] py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:pt-6">
          <h2 className="display text-[clamp(2.1rem,4.4vw,3.5rem)]">Pick an answer. Humo tells you why.</h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/55">
            Most prep sites show the right answer and move on. Humo finds the exact step where your thinking went off, then builds practice around it.
          </p>
          <p className="mt-8 text-[13px] text-white/40">Try a wrong answer on purpose — that's where Humo is most useful.</p>
        </div>

        <div className="panel overflow-hidden rounded-[28px]">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3.5 text-[12px] text-white/45 sm:px-7">
            <span>{QUESTION.meta}</span>
            <span className="tabular-nums">Question 4 of 22</span>
          </div>
          <div className="p-5 sm:p-7">
            <p className="text-[19px] font-medium leading-snug tracking-tight sm:text-[21px]">{QUESTION.stem}</p>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {QUESTION.choices.map((c) => {
                const isPicked = picked?.value === c.value
                const reveal = picked && c.correct
                return (
                  <button
                    key={c.value}
                    onClick={() => setPicked(c)}
                    aria-pressed={isPicked}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-[15px] transition ${
                      isPicked && c.correct
                        ? 'border-emerald-400/60 bg-emerald-400/10'
                        : isPicked
                          ? 'border-red-400/50 bg-red-400/[0.08]'
                          : reveal
                            ? 'border-emerald-400/30'
                            : 'border-white/10 hover:border-white/25 hover:bg-white/[0.03]'
                    }`}
                  >
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-full border text-[12px] font-semibold ${
                        isPicked ? (c.correct ? 'border-emerald-400 bg-emerald-400 text-ink' : 'border-red-400 bg-red-400 text-ink') : 'border-white/20 text-white/60'
                      }`}
                    >
                      {isPicked ? c.correct ? <Check className="size-3.5" strokeWidth={3} /> : <X className="size-3.5" strokeWidth={3} /> : c.label}
                    </span>
                    <span className="tabular-nums">{c.value}</span>
                  </button>
                )
              })}
            </div>

            <AnimatePresence mode="wait">
              {picked ? (
                <motion.div
                  key={picked.value}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 flex gap-3.5 rounded-2xl border border-jg-500/20 bg-gradient-to-b from-jg-500/[0.08] to-transparent p-4 sm:p-5">
                    <img src="/humo-mark.svg" alt="" className="size-9 shrink-0 rounded-full ring-2 ring-jg-500/40" />
                    <div className="min-w-0 flex-1">
                      <p className="mb-2 text-[13px] font-semibold text-jg-300">Humo</p>
                      <Typed lines={picked.humo} />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <button onClick={() => setPicked(null)} className="text-[13px] text-white/50 hover:text-white">
                      Try another answer
                    </button>
                    <Link to="/signup" className="rounded-full bg-jg-500 px-4 py-2 text-[13px] font-semibold text-ink hover:bg-jg-400">
                      Get a full diagnostic
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 text-[13px] text-white/35">
                  Choose A, B, C or D.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
