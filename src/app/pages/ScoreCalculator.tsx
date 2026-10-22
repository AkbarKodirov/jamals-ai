import { useState } from 'react'
import { scaleSection } from '../store'

function Slider({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-[14px] font-medium" htmlFor={label}>
          {label}
        </label>
        <span className="text-[13px] tabular-nums text-moss">
          {value} / {max} correct
        </span>
      </div>
      <input id={label} type="range" min={0} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-3 w-full accent-[#c8103f]" />
      <p className="mt-2 font-serif text-[34px] tabular-nums">{scaleSection(value, max)}</p>
    </div>
  )
}

export default function ScoreCalculator() {
  const [rw, setRw] = useState(40)
  const [m, setM] = useState(32)
  const total = scaleSection(rw, 54) + scaleSection(m, 44)
  return (
    <div>
      <h1 className="display text-[clamp(2rem,4vw,2.75rem)]">Score calculator</h1>
      <p className="mt-2 max-w-2xl text-[15px] text-moss">Move the sliders to see roughly what a raw score converts to. The real SAT is adaptive, so the exact score also depends on which questions you got right — treat this as an estimate.</p>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_0.8fr]">
        <section className="card p-6">
          <Slider label="Reading & Writing" value={rw} max={54} onChange={setRw} />
        </section>
        <section className="card p-6">
          <Slider label="Math" value={m} max={44} onChange={setM} />
        </section>
        <section className="flex flex-col justify-center rounded-[24px] bg-pine p-6 text-cream">
          <p className="text-[13px] text-cream/55">Estimated SAT total</p>
          <p className="display mt-1 text-[64px] leading-none tabular-nums">{total}</p>
          <p className="mt-3 text-[12.5px] text-cream/55">
            Likely range {Math.max(400, total - 40)}–{Math.min(1600, total + 40)}
          </p>
        </section>
      </div>
      <section className="card mt-4 p-6">
        <h2 className="text-[15px] font-semibold">What each 10 points costs</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-pine/80">
          Around the middle of the scale, one extra correct answer is worth roughly 10–20 section points. Near the top, single mistakes cost more — which is why fixing your repeated mistakes is the fastest way past 1400.
        </p>
      </section>
    </div>
  )
}
