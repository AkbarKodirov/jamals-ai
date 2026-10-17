import type { SkillStat } from '../store'

/** Weakest skills first — the order students should fix them in. */
export function SkillBars({ stats, dark = false }: { stats: SkillStat[]; dark?: boolean }) {
  return (
    <ul className="grid gap-x-10 gap-y-3 md:grid-cols-2">
      {stats.map((s) => {
        const pct = Math.round((s.right / s.total) * 100)
        const tone = pct >= 80 ? 'from-jg-700 to-jg-400' : pct >= 60 ? 'from-orange-600 to-orange-400' : 'from-red-600 to-red-400'
        return (
          <li key={s.skill}>
            <div className="flex justify-between text-[13px]">
              <span>{s.skill}</span>
              <span className={`tabular-nums ${dark ? 'text-cream/55' : 'text-moss'}`}>
                {s.right}/{s.total} · {pct}%
              </span>
            </div>
            <div className={`mt-1.5 h-2 overflow-hidden rounded-full ${dark ? 'bg-white/10' : 'bg-cream'}`}>
              <div className={`h-full rounded-full bg-gradient-to-r ${tone}`} style={{ width: `${Math.max(pct, 3)}%` }} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
