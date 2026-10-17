import { Link } from 'react-router-dom'
import { useStore } from '../store'

export default function ResultsList() {
  const s = useStore()
  const list = [...s.attempts].reverse()
  const chart = s.attempts.slice(-12)
  return (
    <div>
      <h1 className="display text-[clamp(2rem,4vw,2.75rem)]">My results</h1>
      <p className="mt-2 text-[15px] text-moss">Every test you finish, with Humo's review.</p>

      {chart.length > 1 && (
        <section className="card mt-6 p-6">
          <p className="text-[14px] font-semibold">Score trend</p>
          <div className="mt-5 flex h-40 items-end gap-2">
            {chart.map((a) => (
              <Link key={a.id} to={`/app/results/${a.id}`} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5" title={`${a.testName}: ${a.scaled}`}>
                <span className="text-[11px] tabular-nums text-moss opacity-0 group-hover:opacity-100">{a.scaled}</span>
                <span className={`w-full max-w-10 rounded-t-lg ${a.type === 'MATH' ? 'bg-sky-400' : 'bg-jg-500'} group-hover:opacity-80`} style={{ height: `${((a.scaled - 200) / 600) * 100}%` }} />
              </Link>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-[11.5px] text-moss">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-jg-500" /> Reading & Writing
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-sky-400" /> Math
            </span>
          </div>
        </section>
      )}

      {list.length === 0 ? (
        <div className="card mt-6 p-12 text-center">
          <p className="text-[15px]">No results yet.</p>
          <Link to="/app/tests" className="btn btn-dark mt-5 h-11 px-6 text-[14px]">
            Take a practice test
          </Link>
        </div>
      ) : (
        <ul className="mt-5 space-y-2.5">
          {list.map((a) => (
            <li key={a.id}>
              <Link to={`/app/results/${a.id}`} className="card card-hover flex items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-semibold">{a.testName}</p>
                  <p className="mt-0.5 text-[12.5px] capitalize text-moss">
                    {a.mode} mode · {new Date(a.finishedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} · {Math.round((a.finishedAt - a.startedAt) / 60000)} min
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-[28px] leading-none tabular-nums">{a.scaled}</p>
                  <p className="mt-1 text-[12px] text-moss">
                    {a.raw}/{a.total} correct
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
