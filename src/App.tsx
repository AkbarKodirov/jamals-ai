import { useState } from 'react'
import { fullQuestionBank } from './fullQuestionBank'
import { additionalQuestions } from './additionalQuestions'
import { MobileNav } from './MobileNav'

const LOGO_ICON = '/humo-icon.jpg'

type View = 'landing' | 'dashboard' | 'tutor' | 'questions' | 'mock' | 'analytics' | 'mistakes' | 'profile'

export default function App() {
  const [view, setView] = useState<View>('landing')

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased pb-16 md:pb-0">
      {view === 'landing' && <Landing setView={setView} />}
      {view === 'dashboard' && <Dashboard setView={setView} />}
      {view === 'tutor' && <AITutor setView={setView} />}
      {view === 'questions' && <QuestionBank setView={setView} />}
      {view === 'mock' && <MockTest setView={setView} />}
      {view === 'analytics' && <Analytics setView={setView} />}
      {view === 'mistakes' && <MistakeReview setView={setView} />}
      {view === 'profile' && <Profile setView={setView} />}
      {view !== 'landing' && <MobileNav setView={setView} current={view} />}
    </div>
  )
}

function Nav({ setView, current }: { setView: (v: View) => void; current: View }) {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => setView('landing')} className="flex items-center gap-2.5">
          <img src={LOGO_ICON} alt="Humo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-semibold tracking-tight">Jamals AI</span>
        </button>
        <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
          {(['dashboard', 'tutor', 'questions', 'mock', 'analytics', 'mistakes'] as View[]).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`capitalize hover:text-white transition ${current === v ? 'text-white' : ''}`}>
              {v === 'tutor' ? 'Humo' : v}
            </button>
          ))}
        </div>
        <button onClick={() => setView('dashboard')} className="px-4 py-2 bg-amber-500 text-black text-sm font-medium rounded-full hover:bg-amber-400 transition">Open App</button>
      </div>
    </nav>
  )
}

// NOTE: Full 389-line implementation with Landing, Dashboard (with 3D Humo portrait),
// AITutor (side panel + chat), QuestionBank (filters), MockTest, Analytics,
// MistakeReview, and Profile is in the local workspace.
// Clone the repo and replace this file with the complete version from /workspace/artifacts/jamals-ai/src/App.tsx
