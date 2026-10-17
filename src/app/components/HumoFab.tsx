import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { HumoDrawer } from './HumoDrawer'
import { useStore } from '../store'

const PAGES: Record<string, { name: string; tips: string[] }> = {
  '/app': { name: 'their dashboard', tips: ['What should I do today?', 'How far am I from my target?', 'Make me a plan until my test'] },
  '/app/plan': { name: 'their study plan', tips: ['Is this plan realistic?', 'I only have 1 hour a day', 'What if I miss a day?'] },
  '/app/tests': { name: 'the practice tests list', tips: ['Which mode should I pick?', 'How do modules work?', 'How do I pace a module?'] },
  '/app/drills': { name: 'drills', tips: ['Which skill should I drill?', 'How many questions a day?'] },
  '/app/vocab': { name: 'vocabulary practice', tips: ['Quiz me on 5 hard words', 'How do I remember words faster?', 'Words-in-context strategy'] },
  '/app/lessons': { name: 'lessons', tips: ['Explain transitions simply', 'Command of evidence strategy', 'Linear equations in 2 minutes'] },
  '/app/analytics': { name: 'their analytics', tips: ['What is my weakest area?', 'Am I improving?'] },
  '/app/mistakes': { name: 'their mistakes notebook', tips: ['Why do I keep making these mistakes?', 'How should I review mistakes?'] },
}

/** Floating Humo button available on every app page. */
export function HumoFab() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const s = useStore()
  const page = PAGES[pathname] ?? { name: 'the Jamals AI app', tips: ['What should I study today?', 'Explain a hard SAT topic'] }
  const last = s.attempts[s.attempts.length - 1]
  const context = [
    `The student is on ${page.name}.`,
    `Goal: target ${s.profile.target}${s.profile.current ? `, current ${s.profile.current}` : ''}${s.profile.testDate ? `, SAT on ${s.profile.testDate}` : ', no test date set'}.`,
    last ? `Last test: ${last.testName}, ${last.raw}/${last.total} (${last.scaled}).` : 'No tests yet.',
    `${s.mistakes.filter((m) => !m.cleared).length} open mistakes; ${Object.values(s.vocab).filter((v) => v.reps >= 3).length} vocab words mastered.`,
  ].join(' ')

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Ask Humo"
        className="group fixed bottom-24 right-4 z-30 flex items-center gap-2 rounded-full bg-pine py-1.5 pl-1.5 pr-4 text-[14px] font-semibold text-cream shadow-xl shadow-pine/30 transition hover:scale-[1.04] md:bottom-6 md:right-6"
      >
        <span className="relative">
          <img src="/humo-mark.svg" alt="" className="size-9 rounded-full ring-2 ring-jg-500" />
          <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-jg-400 ring-2 ring-pine" />
        </span>
        Ask Humo
      </button>
      <HumoDrawer key={pathname} open={open} onClose={() => setOpen(false)} context={context} greeting={`Salom! I can see you're on ${page.name.replace('their', 'your')}. What can I help with?`} suggestions={page.tips} />
    </>
  )
}
