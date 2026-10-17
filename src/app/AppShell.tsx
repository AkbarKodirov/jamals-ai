import { lazy, Suspense } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { BookMarked, BookOpen, ClipboardList, Flame, Home, LogOut, MessageCircle, NotebookPen, Trophy, Zap } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { streak, useBindStore, useStore } from './store'

const HomePage = lazy(() => import('./pages/Home'))
const HumoChat = lazy(() => import('./pages/HumoChat'))
const Tests = lazy(() => import('./pages/Tests'))
const TakeTest = lazy(() => import('./pages/TakeTest'))
const Results = lazy(() => import('./pages/Results'))
const ResultsList = lazy(() => import('./pages/ResultsList'))
const QuestionBank = lazy(() => import('./pages/QuestionBank'))
const Vocabulary = lazy(() => import('./pages/Vocabulary'))
const Blitz = lazy(() => import('./pages/Blitz'))
const Mistakes = lazy(() => import('./pages/Mistakes'))

type Item = { to: string; label: string; icon: typeof Home; end?: boolean }
const GROUPS: { label: string | null; items: Item[] }[] = [
  {
    label: null,
    items: [
      { to: '/app', label: 'Home', icon: Home, end: true },
      { to: '/app/humo', label: 'Ask Humo', icon: MessageCircle },
    ],
  },
  {
    label: 'Practice',
    items: [
      { to: '/app/tests', label: 'Practice tests', icon: ClipboardList },
      { to: '/app/practice', label: 'Question bank', icon: BookOpen },
      { to: '/app/blitz', label: 'Blitz', icon: Zap },
      { to: '/app/vocab', label: 'Vocabulary', icon: BookMarked },
    ],
  },
  {
    label: 'Progress',
    items: [
      { to: '/app/results', label: 'My results', icon: Trophy },
      { to: '/app/mistakes', label: 'Mistakes', icon: NotebookPen },
    ],
  },
]
const MOBILE = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/tests', label: 'Tests', icon: ClipboardList },
  { to: '/app/humo', label: 'Humo', icon: MessageCircle },
  { to: '/app/vocab', label: 'Vocab', icon: BookMarked },
  { to: '/app/results', label: 'Results', icon: Trophy },
]

export function Avatar({ size = 'size-8' }: { size?: string }) {
  const { user } = useAuth()
  if (user?.picture) return <img src={user.picture} alt="" referrerPolicy="no-referrer" className={`${size} rounded-full`} />
  return <span className={`${size} grid place-items-center rounded-full bg-jg-500 text-[13px] font-semibold text-ink`}>{user?.name?.[0]?.toUpperCase() ?? 'J'}</span>
}

function PageLoading() {
  return (
    <div className="grid h-64 place-items-center">
      <span className="size-6 animate-spin rounded-full border-2 border-jg-500 border-t-transparent" />
    </div>
  )
}

export default function AppShell() {
  const { user, signOut } = useAuth()
  useBindStore(user?.id)
  const s = useStore()
  const nav = useNavigate()
  const { pathname } = useLocation()
  const days = streak(s.activeDays)

  // The test runner is full-screen, like the real exam app.
  if (/\/app\/tests\/[^/]+\/take/.test(pathname))
    return (
      <div className="min-h-svh bg-white text-pine">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="tests/:id/take" element={<TakeTest />} />
          </Routes>
        </Suspense>
      </div>
    )

  return (
    <div className="min-h-svh bg-cream pb-20 text-pine md:pb-0 md:pl-64">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-pine p-4 text-cream md:flex">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-2">
          <img src="/brand/jamals-mark.png" alt="" className="size-9 rounded-full ring-1 ring-white/15" />
          <span className="flex flex-col leading-none">
            <span className="text-[16px] font-semibold tracking-tight">Jamals AI</span>
            <span className="mt-1 text-[11px] text-cream/45">SAT & IELTS</span>
          </span>
        </Link>
        <nav className="mt-6 flex-1 space-y-5 overflow-y-auto">
          {GROUPS.map((g, i) => (
            <div key={i}>
              {g.label && <p className="mb-1.5 px-3 text-[11px] font-semibold text-cream/35">{g.label}</p>}
              <div className="space-y-0.5">
                {g.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition ${isActive ? 'bg-white/[0.1] text-cream' : 'text-cream/60 hover:bg-white/[0.05] hover:text-cream'}`
                    }
                  >
                    <Icon className="size-[18px]" />
                    {label}
                    {to === '/app/humo' && <img src="/humo-mark.svg" alt="" className="ml-auto size-5 rounded-md" />}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/[0.06] p-2.5">
          <Avatar />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{user?.name}</p>
            <p className="truncate text-[11px] text-cream/40">{user?.email}</p>
          </div>
          <button
            aria-label="Log out"
            onClick={() => {
              signOut()
              nav('/')
            }}
            className="rounded-lg p-1.5 text-cream/45 hover:bg-white/[0.08] hover:text-cream"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-[#ece6da] bg-cream/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <img src="/brand/jamals-mark.png" alt="" className="size-8 rounded-full" />
            <span className="text-[15px] font-semibold">Jamals AI</span>
          </Link>
          <span className="hidden md:block" />
          <div className="flex items-center gap-2">
            <span title="Daily streak" className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[14px] font-semibold ${days ? 'bg-orange-500 text-white' : 'bg-white text-moss ring-1 ring-[#e3dccf]'}`}>
              <Flame className="size-4" /> {days}
            </span>
            <span className="md:hidden">
              <Avatar />
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="humo" element={<HumoChat />} />
            <Route path="tests" element={<Tests />} />
            <Route path="results" element={<ResultsList />} />
            <Route path="results/:attemptId" element={<Results />} />
            <Route path="practice" element={<QuestionBank />} />
            <Route path="vocab" element={<Vocabulary />} />
            <Route path="blitz" element={<Blitz />} />
            <Route path="mistakes" element={<Mistakes />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-white/10 bg-pine pb-[env(safe-area-inset-bottom)] md:hidden">
        {MOBILE.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex flex-col items-center gap-1 py-2.5 text-[11px] ${isActive ? 'text-jg-400' : 'text-cream/50'}`}>
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
