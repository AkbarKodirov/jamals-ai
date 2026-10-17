import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Calculator, Clock } from 'lucide-react'
import { HumoDrawer } from '../components/HumoDrawer'

type Lesson = { id: string; section: 'Reading & Writing' | 'Math'; title: string; min: number; why: string; steps: string[]; trap: string; example: { q: string; a: string } }

const LESSONS: Lesson[] = [
  {
    id: 'wic',
    section: 'Reading & Writing',
    title: 'Words in Context',
    min: 6,
    why: 'Up to 5 questions per module. Fast points once you stop reading the choices first.',
    steps: [
      'Cover the choices. Read the sentence and find the clue that defines the blank — a contrast word (despite, although), a colon, or a restatement after a comma.',
      'Predict your own simple word for the blank before you look.',
      'Match your prediction to the choices. Pick the one closest in meaning and in tone (positive / negative).',
      'Plug it back in and reread the whole sentence. It should sound like something an editor would print.',
    ],
    trap: 'The "sounds smart" trap: a fancy word that fits the topic but not the logic. If the sentence says she stayed calm after years of disasters, you need "inured", not "alerted".',
    example: { q: 'Despite the grim report, the CEO remained curiously ______ about the future.', a: 'Predict "hopeful" from the contrast word "Despite" → sanguine / optimistic.' },
  },
  {
    id: 'transitions',
    section: 'Reading & Writing',
    title: 'Transitions',
    min: 5,
    why: 'Three or four questions per module, and they reward a single habit: name the relationship first.',
    steps: [
      'Read the sentence before the blank and the sentence after it.',
      'Name the relationship in one word: contrast, cause, example, addition, or sequence.',
      'Eliminate every choice from the wrong family. However/Nevertheless = contrast; Therefore/Thus = result; For example = example; Moreover/Furthermore = addition.',
      'If two choices remain, pick the one whose strength matches: "Indeed" intensifies, "Still" concedes.',
    ],
    trap: 'Choosing a contrast word just because the sentences talk about different things. Different topics is not the same as opposite ideas.',
    example: { q: 'The experiment was repeated three times. ______, the results were nearly identical.', a: 'Relationship = a notable confirmation, not a contrast → "Remarkably".' },
  },
  {
    id: 'coe',
    section: 'Reading & Writing',
    title: 'Command of Evidence',
    min: 7,
    why: 'Among the most-missed questions on hard modules — and the most predictable once you treat them like a lawyer.',
    steps: [
      'Underline the exact claim in the question (the one the evidence must support, weaken, or illustrate).',
      'Rewrite the claim as "If true, we would see ___". That blank is your target.',
      'Read each choice and ask only: does this show the target? Ignore whether it is interesting or true in general.',
      'For data questions, check the specific numbers or trend the claim names — wrong choices often cite the right graph but the wrong group or year.',
    ],
    trap: 'Picking a choice that is on-topic but proves something slightly different from the claim.',
    example: { q: 'Claim: had the Norse adapted to marine hunting, they would have survived.', a: 'Best support: a neighboring people who relied on marine hunting did survive the same cooling.' },
  },
  {
    id: 'conventions',
    section: 'Reading & Writing',
    title: 'Standard English: punctuation',
    min: 6,
    why: 'Pure rules — memorize five patterns and these become your fastest questions.',
    steps: [
      'Period, semicolon, and ", and" all join two complete sentences. If two choices are equivalent, both are wrong.',
      'A colon comes after a complete sentence and introduces an explanation or list.',
      'Nonessential information takes a matching pair: two commas, two dashes, or two parentheses — never mixed.',
      'No single comma between a subject and its verb, or between a verb and its object.',
      'Possessive vs. plural: "the scientists\' data" (many scientists), "the scientist\'s data" (one).',
    ],
    trap: 'Mixed pairs, like opening a nonessential phrase with a dash and closing it with a comma.',
    example: { q: 'The exhibit ___ features textiles from Bukhara ___ opens Friday.', a: 'Nonessential clause → matching commas: ", which features textiles from Bukhara,".' },
  },
  {
    id: 'linear',
    section: 'Math',
    title: 'Linear equations and functions',
    min: 7,
    why: 'Linear questions are the single largest group in Math. Every point here is a point you should never lose.',
    steps: [
      'In y = mx + b, m is the rate (per unit) and b is the starting value. Word problems: "per" signals m, "fixed / initial" signals b.',
      'Distribute fully before moving terms: 3(x − 2) is 3x − 6, not 3x − 2.',
      'When a term crosses the equals sign, its sign flips.',
      'Systems: add or subtract the equations to eliminate a variable — often faster than substitution.',
      'Check by plugging your answer back in. It takes five seconds and catches most slips.',
    ],
    trap: 'Partial distribution (3x − 2) — the SAT puts that wrong answer in the choices on purpose.',
    example: { q: 'A taxi charges 8 000 so\'m plus 2 500 so\'m per km.', a: 'C = 2 500d + 8 000 — the per-km rate multiplies d; the fixed fee is the constant.' },
  },
  {
    id: 'angles',
    section: 'Math',
    title: 'Lines and angles',
    min: 5,
    why: 'Quick geometry points that appear in almost every Math module.',
    steps: [
      'Complementary angles sum to 90°; supplementary angles sum to 180°.',
      'Vertical angles (opposite at an X) are equal.',
      'Parallel lines cut by a transversal create only two angle sizes: all acute angles are equal, all obtuse angles are equal, and acute + obtuse = 180°.',
      'Angles around a point sum to 360°; angles on a straight line sum to 180°.',
    ],
    trap: 'Mixing up complementary (90°) and supplementary (180°) — 145° instead of 55° is the classic wrong answer.',
    example: { q: 'Two angles are complementary; one is 35°.', a: '90° − 35° = 55°.' },
  },
]

export default function Lessons() {
  const [open, setOpen] = useState<Lesson | null>(null)
  const [chat, setChat] = useState(false)

  if (open)
    return (
      <div className="mx-auto max-w-3xl">
        <button onClick={() => setOpen(null)} className="flex items-center gap-1.5 text-[13px] text-moss hover:text-pine">
          <ArrowLeft className="size-4" /> All lessons
        </button>
        <p className="mt-6 text-[13px] text-moss">
          {open.section} · {open.min} min
        </p>
        <h1 className="display mt-1 text-[clamp(2rem,4vw,2.75rem)]">{open.title}</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-pine/80">{open.why}</p>

        <section className="card mt-6 p-6">
          <h2 className="text-[15px] font-semibold">The method</h2>
          <ol className="mt-4 space-y-3">
            {open.steps.map((st, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-pine text-[12px] font-semibold text-cream">{i + 1}</span>
                <span>{st}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="mt-3 rounded-[24px] border border-red-200 bg-red-50/60 p-5">
          <p className="text-[13px] font-semibold text-red-700">Common trap</p>
          <p className="mt-1.5 text-[14.5px] leading-relaxed">{open.trap}</p>
        </section>
        <section className="card mt-3 p-5">
          <p className="text-[13px] font-semibold text-jg-700">Example</p>
          <p className="mt-1.5 font-serif text-[16px] italic">{open.example.q}</p>
          <p className="mt-2 text-[14.5px]">{open.example.a}</p>
        </section>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link to="/app/drills" className="btn btn-dark h-11 px-5 text-[14px]">
            Drill this now
          </Link>
          <button onClick={() => setChat(true)} className="btn btn-ghost h-11 px-5 text-[14px]">
            <img src="/humo-mark.svg" alt="" className="size-6 rounded-md" /> Ask Humo about it
          </button>
        </div>
        <HumoDrawer
          key={open.id}
          open={chat}
          onClose={() => setChat(false)}
          context={`The student is reading the Jamals lesson "${open.title}" (${open.section}). Method: ${open.steps.join(' ')} Trap: ${open.trap}`}
          greeting={`Let's master ${open.title}. Want me to explain a step, or give you a practice question?`}
          suggestions={['Give me a practice question', 'Explain step 2 again', 'Quiz me in Uzbek']}
        />
      </div>
    )

  return (
    <div>
      <h1 className="display text-[clamp(2rem,4vw,2.75rem)]">Lessons</h1>
      <p className="mt-2 text-[15px] text-moss">Short strategy lessons from Jamals Academy teachers. Read one, then drill it straight away.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LESSONS.map((l) => {
          const Icon = l.section === 'Math' ? Calculator : BookOpen
          return (
            <button key={l.id} onClick={() => setOpen(l)} className="card card-hover flex flex-col p-5 text-left">
              <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${l.section === 'Math' ? 'bg-sky-50 text-sky-700' : 'bg-jg-50 text-jg-700'}`}>
                <Icon className="size-3.5" /> {l.section}
              </span>
              <p className="mt-4 font-serif text-[22px] leading-tight">{l.title}</p>
              <p className="mt-2 flex-1 text-[13px] text-moss">{l.why}</p>
              <p className="mt-4 flex items-center gap-1 text-[12px] text-moss">
                <Clock className="size-3.5" /> {l.min} min read
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
