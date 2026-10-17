import { useEffect, useState } from 'react'
import { RotateCw } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { explain, HumoOffline } from '../humo'
import type { TestQuestion } from '../store'
import { RichText } from './RichText'

/** Humo's explanation card — shown above each question in review, and after "Check answer" in practice mode. */
export function HumoExplain({ testId, qKey, q, compact = false, onAsk }: { testId: string; qKey: string; q: TestQuestion; compact?: boolean; onAsk?: () => void }) {
  const { token } = useAuth()
  const [state, setState] = useState<{ text?: string; error?: string; offline?: boolean }>({})
  const [n, setN] = useState(0)

  useEffect(() => {
    let alive = true
    setState({})
    explain(testId, qKey, q, token)
      .then((text) => alive && setState({ text }))
      .catch((e) => alive && setState({ error: e.message, offline: e instanceof HumoOffline }))
    return () => {
      alive = false
    }
  }, [testId, qKey, q, token, n])

  return (
    <div className={`flex gap-3 rounded-2xl border border-jg-500/25 bg-gradient-to-b from-jg-50 to-white ${compact ? 'p-3.5' : 'p-4 sm:p-5'}`}>
      <img src="/humo-mark.svg" alt="" className="size-9 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[13px] font-semibold text-jg-700">Humo explains</p>
          {onAsk && (
            <button onClick={onAsk} className="text-[12px] font-medium text-jg-700 hover:text-jg-600">
              Ask a follow-up
            </button>
          )}
        </div>
        {state.text ? (
          <div className="mt-1.5 text-[14px] leading-relaxed text-pine/85">
            <RichText text={state.text} />
          </div>
        ) : state.error ? (
          <div className="mt-1.5 text-[13.5px] text-pine/75">
            <p>{state.offline ? 'Humo is offline right now.' : state.error}</p>
            {state.offline && <p className="mt-1 text-[12px] text-moss">{state.error}</p>}
            {!state.offline && (
              <button onClick={() => setN((x) => x + 1)} className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-jg-700">
                <RotateCw className="size-3" /> Try again
              </button>
            )}
          </div>
        ) : (
          <div className="mt-2.5 space-y-2" aria-label="Humo is writing">
            <div className="h-2.5 w-11/12 animate-pulse rounded-full bg-jg-500/15" />
            <div className="h-2.5 w-4/5 animate-pulse rounded-full bg-jg-500/15" />
            <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-jg-500/15" />
          </div>
        )}
      </div>
    </div>
  )
}
