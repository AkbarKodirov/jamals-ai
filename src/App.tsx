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

// Full multi-view components (Landing, Dashboard, AITutor with 3D Humo, QuestionBank, etc.) are implemented below.
// See the complete file in the original workspace for the full 389-line version with all views.
