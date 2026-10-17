import { Link } from 'react-router-dom'
import { ExternalLink, FileText, Lock } from 'lucide-react'

/**
 * Exam papers library. Real past SAT papers belong to the College Board, so this shelf only lists
 * papers Jamals Academy has the right to publish; until those are added it points to the free
 * official Bluebook tests and to Jamals' own full-length tests.
 */
export default function ExamPapers() {
  return (
    <div>
      <h1 className="display text-[clamp(2rem,4vw,2.75rem)]">Exam papers</h1>
      <p className="mt-2 max-w-2xl text-[15px] text-moss">Full papers in the real Digital SAT format. Jamals Academy adds papers here as they're cleared for publishing.</p>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <a href="https://bluebook.collegeboard.org/" target="_blank" rel="noreferrer" className="card card-hover flex flex-col p-6">
          <span className="grid size-11 place-items-center rounded-2xl bg-jg-50 text-jg-700">
            <FileText className="size-5" />
          </span>
          <p className="mt-4 font-serif text-[22px]">Official practice tests in Bluebook</p>
          <p className="mt-1.5 flex-1 text-[13.5px] text-moss">The College Board's free full-length Digital SAT practice tests run in the Bluebook app — the same app you'll use on test day. Take at least two before your exam.</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-jg-700">
            Open Bluebook <ExternalLink className="size-3.5" />
          </span>
        </a>
        <Link to="/app/tests" className="card card-hover flex flex-col p-6">
          <span className="grid size-11 place-items-center rounded-2xl bg-cream text-pine">
            <FileText className="size-5" />
          </span>
          <p className="mt-4 font-serif text-[22px]">Jamals full-length tests</p>
          <p className="mt-1.5 flex-1 text-[13.5px] text-moss">Ten full sections written by Jamals Academy teachers, with exam, practice and sprint modes and Humo explanations for every question.</p>
          <span className="mt-4 text-[13px] font-semibold text-jg-700">Go to practice tests</span>
        </Link>
      </div>

      <h2 className="mt-10 text-[15px] font-semibold">Coming to this shelf</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {['Jamals Mock — November', 'Jamals Mock — December', 'Academy Final — Winter', 'Academy Final — Spring'].map((t) => (
          <div key={t} className="card flex items-center gap-3 p-4 opacity-70">
            <Lock className="size-4 text-moss" />
            <span className="text-[13.5px]">{t}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
