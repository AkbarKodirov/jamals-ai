import { Link } from 'react-router-dom'
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
              <span className="flex items-center gap-2">
                {s.skill}
                {!dark && pct < 80 && (
                  <Link to={`/app/practice/run?skills=${encodeURIComponent(s.skill)}&status=unsolved&order=random&n=10`} className="rounded-full bg-pine px-2 py-0.5 text-[10.5px] font-semibold text-cream hover:bg-pine-2">
                    Practice
                  </Link>
                )}
              </span>
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
