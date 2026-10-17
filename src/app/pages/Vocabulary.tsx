import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Brain, Check, Flame, Layers, ListChecks, RotateCcw, Search, Sparkles, X } from 'lucide-react'
import { LEVELS, WORDS, type Word } from '../../data/vocab'
import { markActive, setStore, useStore, type VocabProgress } from '../store'

/* ---------- spaced repetition (SM-2 lite) ---------- */
// rating: 0 again, 1 hard, 2 good, 3 easy
function schedule(p: VocabProgress | undefined, rating: 0 | 1 | 2 | 3): VocabProgress {
  let { ease = 2.5, interval = 0, reps = 0, seen = 0, correct = 0 } = p ?? {}
  seen++
  if (rating === 0) {
    reps = 0
    interval = 0
    ease = Math.max(1.3, ease - 0.2)
  } else {
    correct++
    reps++
    interval = reps === 1 ? 1 : reps === 2 ? 4 : Math.round(interval * ease)
    if (rating === 1) ease = Math.max(1.3, ease - 0.15)
    if (rating === 3) ease += 0.15
  }
  const due = rating === 0 ? Date.now() + 60_000 : Date.now() + interval * 86400000
  return { ease, interval, reps, due, seen, correct }
}
function record(word: string, rating: 0 | 1 | 2 | 3) {
  setStore((s) => ({ ...s, vocab: { ...s.vocab, [word]: schedule(s.vocab[word], rating) } }))
}
const status = (p?: VocabProgress) => (!p ? 'new' : p.reps >= 3 ? 'mastered' : 'learning')

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5)

/* ---------- quiz ---------- */
type QType = 'meaning' | 'word' | 'context' | 'synonym'
type QItem = { type: QType; word: Word; prompt: string; options: string[]; answer: string }

function buildQuestion(word: Word, type: QType): QItem {
  const pool = WORDS.filter((x) => x.word !== word.word)
  const samePos = pool.filter((x) => x.pos === word.pos)
  const others = shuffle(samePos.length >= 3 ? samePos : pool).slice(0, 3)
  if (type === 'meaning') return { type, word, prompt: word.word, options: shuffle([word.def, ...others.map((o) => o.def)]), answer: word.def }
  if (type === 'word') return { type, word, prompt: word.def, options: shuffle([word.word, ...others.map((o) => o.word)]), answer: word.word }
  if (type === 'synonym') return { type, word, prompt: word.word, options: shuffle([word.syn[0], ...others.map((o) => o.syn[0])]), answer: word.syn[0] }
  const re = new RegExp(`\\b${word.word.slice(0, Math.max(4, word.word.length - 3))}\\w*`, 'i')
  const blanked = word.ex.replace(re, '______')
  if (blanked === word.ex) return buildQuestion(word, 'word')
  return { type, word, prompt: blanked, options: shuffle([word.word, ...others.map((o) => o.word)]), answer: word.word }
}

const QLABEL: Record<QType, string> = {
  meaning: 'What does this word mean?',
  word: 'Which word matches this meaning?',
  context: 'Which word completes the sentence?',
  synonym: 'Pick the closest synonym.',
}

function Quiz({ words, types, onExit, title }: { words: Word[]; types: QType[]; onExit: () => void; title: string }) {
  const items = useMemo(() => words.map((w, i) => buildQuestion(w, types[i % types.length])), [words, types])
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [best, setBest] = useState(0)
  const [misses, setMisses] = useState<Word[]>([])
  const done = i >= items.length
  const q = items[i]

  function choose(opt: string) {
    if (picked) return
    setPicked(opt)
    const ok = opt === q.answer
    record(q.word.word, ok ? 2 : 0)
    if (ok) {
      setScore((s) => s + 1)
      setCombo((c) => {
        setBest((b) => Math.max(b, c + 1))
        return c + 1
      })
    } else {
      setCombo(0)
      setMisses((m) => [...m, q.word])
    }
  }
  function next() {
    setPicked(null)
    setI((x) => x + 1)
    if (i + 1 >= items.length) markActive(items.length * 12)
  }

  if (done)
    return (
      <div className="card mx-auto max-w-xl p-8 text-center">
        <img src="/humo-mark.svg" alt="" className="mx-auto size-14 rounded-2xl" />
        <h2 className="display mt-5 text-[34px]">
          {score}/{items.length}
        </h2>
        <p className="mt-1 text-[14px] text-moss">Best combo: {best}</p>
        {misses.length > 0 && (
          <div className="mt-6 text-left">
            <p className="text-[13px] font-semibold">Words to review</p>
            <ul className="mt-2 space-y-2">
              {misses.map((m) => (
                <li key={m.word} className="rounded-xl bg-cream px-4 py-2.5 text-[13.5px]">
                  <span className="font-semibold">{m.word}</span> — {m.def}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-7 flex justify-center gap-2">
          <button onClick={onExit} className="btn btn-dark h-11 px-6 text-[14px]">
            Done
          </button>
        </div>
      </div>
    )

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onExit} className="flex items-center gap-1 text-[13px] text-moss hover:text-pine">
          <X className="size-4" /> {title}
        </button>
        <div className="flex items-center gap-3 text-[13px]">
          {combo >= 2 && (
            <motion.span key={combo} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 font-semibold text-white">
              <Flame className="size-3.5" /> {combo}× combo
            </motion.span>
          )}
          <span className="tabular-nums text-moss">
            {i + 1}/{items.length}
          </span>
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#ece6da]">
        <div className="h-full rounded-full bg-jg-500 transition-all" style={{ width: `${(i / items.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }} className="card mt-6 p-6 sm:p-8">
          <p className="text-[13px] font-medium text-moss">{QLABEL[q.type]}</p>
          <p className={`mt-3 ${q.type === 'meaning' || q.type === 'synonym' ? 'display text-[40px]' : 'text-[19px] font-medium leading-relaxed'}`}>{q.prompt}</p>
          <div className="mt-6 grid gap-2.5">
            {q.options.map((o, k) => {
              const right = picked && o === q.answer
              const wrong = picked === o && o !== q.answer
              return (
                <button
                  key={o}
                  onClick={() => choose(o)}
                  className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-[15px] transition ${right ? 'border-emerald-500 bg-emerald-50' : wrong ? 'border-red-400 bg-red-50' : 'border-[#e6e0d3] hover:border-[#c9c0ad]'} ${picked && !right && !wrong ? 'opacity-50' : ''}`}
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-pine/30 text-[11px] font-bold">{'ABCD'[k]}</span>
                  {o}
                  {right && <Check className="ml-auto size-5 text-emerald-600" />}
                </button>
              )
            })}
          </div>
          {picked && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl bg-cream p-4">
              <p className="text-[14px]">
                <span className="font-semibold">{q.word.word}</span> <span className="text-moss">({q.word.pos})</span> — {q.word.def}
              </p>
              <p className="mt-1.5 font-serif text-[14.5px] italic text-pine/75">"{q.word.ex}"</p>
              <p className="mt-1.5 text-[12.5px] text-moss">Synonyms: {q.word.syn.join(', ')}</p>
              <button onClick={next} className="btn btn-dark mt-4 h-10 px-5 text-[13px]">
                {i + 1 < items.length ? 'Next' : 'See results'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------- flashcards ---------- */
function Flashcards({ words, onExit }: { words: Word[]; onExit: () => void }) {
  const [queue, setQueue] = useState(words)
  const [flip, setFlip] = useState(false)
  const [doneN, setDoneN] = useState(0)
  const card = queue[0]

  function rate(r: 0 | 1 | 2 | 3) {
    record(card.word, r)
    setFlip(false)
    setDoneN((n) => n + 1)
    setQueue((q) => (r === 0 ? [...q.slice(1), q[0]] : q.slice(1)))
    if (queue.length === 1 && r !== 0) markActive(words.length * 8)
  }

  if (!card)
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <Sparkles className="mx-auto size-8 text-jg-600" />
        <h2 className="display mt-4 text-[30px]">Deck done</h2>
        <p className="mt-2 text-[14px] text-moss">{doneN} reviews. Cards you found hard will come back sooner.</p>
        <button onClick={onExit} className="btn btn-dark mt-6 h-11 px-6 text-[14px]">
          Back to vocabulary
        </button>
      </div>
    )

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="flex items-center gap-1 text-[13px] text-moss hover:text-pine">
          <X className="size-4" /> Flashcards
        </button>
        <span className="text-[13px] tabular-nums text-moss">{queue.length} left</span>
      </div>
      <button onClick={() => setFlip((f) => !f)} className="relative mt-5 block h-80 w-full [perspective:1200px]" aria-label="Flip card">
        <motion.div animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="relative size-full [transform-style:preserve-3d]">
          <div className="card absolute inset-0 grid place-items-center p-8 [backface-visibility:hidden]">
            <div className="text-center">
              <span className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-semibold capitalize text-moss">{card.level}</span>
              <p className="display mt-5 text-[46px]">{card.word}</p>
              <p className="mt-2 text-[13px] text-moss">{card.pos} · tap to flip</p>
            </div>
          </div>
          <div className="absolute inset-0 grid place-items-center rounded-[24px] bg-pine p-8 text-cream [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="text-center">
              <p className="text-[19px] font-medium leading-snug">{card.def}</p>
              <p className="mt-4 font-serif text-[15.5px] italic text-cream/75">"{card.ex}"</p>
              <p className="mt-4 text-[12.5px] text-cream/55">Synonyms: {card.syn.join(', ')}</p>
            </div>
          </div>
        </motion.div>
      </button>
      <div className={`mt-5 grid grid-cols-4 gap-2 transition ${flip ? 'opacity-100' : 'pointer-events-none opacity-30'}`}>
        {(
          [
            [0, 'Again', 'bg-red-50 text-red-700 ring-red-200'],
            [1, 'Hard', 'bg-orange-50 text-orange-700 ring-orange-200'],
            [2, 'Good', 'bg-jg-50 text-jg-700 ring-jg-200'],
            [3, 'Easy', 'bg-sky-50 text-sky-700 ring-sky-200'],
          ] as const
        ).map(([r, l, c]) => (
          <button key={l} onClick={() => rate(r)} className={`rounded-xl py-3 text-[14px] font-semibold ring-1 ${c}`}>
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- page ---------- */
export default function Vocabulary() {
  const s = useStore()
  const [level, setLevel] = useState<Word['level'] | 'all'>('all')
  const [session, setSession] = useState<null | { kind: 'quiz' | 'cards'; words: Word[]; types: QType[]; title: string }>(null)
  const [q, setQ] = useState('')

  const scoped = WORDS.filter((w) => level === 'all' || w.level === level)
  const counts = { new: 0, learning: 0, mastered: 0 }
  WORDS.forEach((w) => counts[status(s.vocab[w.word])]++)
  const due = scoped.filter((w) => s.vocab[w.word] && s.vocab[w.word].due <= Date.now())
  const fresh = scoped.filter((w) => !s.vocab[w.word])
  const daily = [...shuffle(due), ...fresh].slice(0, 20)
  const seen = Object.values(s.vocab).reduce((a, p) => a + p.seen, 0)
  const right = Object.values(s.vocab).reduce((a, p) => a + p.correct, 0)

  if (session)
    return session.kind === 'quiz' ? <Quiz words={session.words} types={session.types} title={session.title} onExit={() => setSession(null)} /> : <Flashcards words={session.words} onExit={() => setSession(null)} />

  const pick = (n: number) => shuffle(scoped).slice(0, n)
  const list = scoped.filter((w) => !q || w.word.includes(q.toLowerCase()) || w.def.includes(q.toLowerCase()))

  return (
    <div>
      <h1 className="display text-[clamp(2rem,4vw,2.75rem)]">Vocabulary</h1>
      <p className="mt-2 text-[15px] text-moss">{WORDS.length} SAT words with spaced repetition — words you miss come back sooner, words you know fade out.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {[{ id: 'all' as const, name: 'All levels' }, ...LEVELS].map((l) => (
          <button key={l.id} onClick={() => setLevel(l.id)} className={`rounded-full px-4 py-2 text-[13px] font-medium ${level === l.id ? 'bg-pine text-cream' : 'bg-white ring-1 ring-[#e3dccf]'}`}>
            {l.name}
          </button>
        ))}
      </div>

      {/* Daily */}
      <section className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-jg-500/30 bg-gradient-to-br from-jg-50 to-white p-6">
        <div>
          <p className="text-[13px] font-semibold text-jg-700">Daily 20</p>
          <p className="mt-1 text-[18px] font-medium">
            {due.length ? `${Math.min(20, due.length)} words due for review` : '20 words picked for you'}
            {fresh.length ? `, ${Math.max(0, 20 - due.length)} new` : ''}
          </p>
        </div>
        <button disabled={!daily.length} onClick={() => setSession({ kind: 'quiz', words: daily, types: ['meaning', 'context', 'word', 'synonym'], title: 'Daily 20' })} className="btn btn-dark h-11 px-6 text-[14px] disabled:opacity-40">
          Start daily practice
        </button>
      </section>

      {/* Modes */}
      <section className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { icon: ListChecks, color: 'bg-emerald-50 text-emerald-700', name: 'Quiz', line: 'Four question types, 15 words, combo streaks.', run: () => setSession({ kind: 'quiz', words: pick(15), types: ['meaning', 'word', 'context', 'synonym'], title: 'Quiz' }) },
          { icon: Layers, color: 'bg-orange-50 text-orange-700', name: 'Flashcards', line: 'Flip, then rate how well you knew it.', run: () => setSession({ kind: 'cards', words: due.length ? due.slice(0, 20) : pick(20), types: [], title: 'Flashcards' }) },
          { icon: Brain, color: 'bg-sky-50 text-sky-700', name: 'In context', line: 'SAT-style: fill the blank in a real sentence.', run: () => setSession({ kind: 'quiz', words: pick(15), types: ['context'], title: 'In context' }) },
        ].map(({ icon: Icon, color, name, line, run }) => (
          <button key={name} onClick={run} className="card card-hover p-5 text-left">
            <span className={`grid size-10 place-items-center rounded-xl ${color}`}>
              <Icon className="size-5" />
            </span>
            <p className="mt-4 text-[16px] font-semibold">{name}</p>
            <p className="mt-1 text-[13px] text-moss">{line}</p>
            <span className="mt-4 inline-flex rounded-full bg-pine px-3.5 py-1.5 text-[12px] font-semibold text-cream">Start</span>
          </button>
        ))}
      </section>

      {/* Stats */}
      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Mastered', counts.mastered, 'text-jg-700'],
          ['Learning', counts.learning, 'text-orange-600'],
          ['New', counts.new, 'text-moss'],
          ['Accuracy', seen ? `${Math.round((right / seen) * 100)}%` : '–', 'text-pine'],
        ].map(([l, v, c]) => (
          <div key={l as string} className="card p-4">
            <p className="text-[12px] text-moss">{l}</p>
            <p className={`font-serif text-[26px] tabular-nums ${c}`}>{v}</p>
          </div>
        ))}
      </section>

      {/* Word list */}
      <section className="card mt-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[16px] font-semibold">Word list</h2>
          <label className="flex items-center gap-2 rounded-full border border-[#e3dccf] px-3 py-1.5">
            <Search className="size-4 text-moss" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search words" className="w-40 bg-transparent text-[13px] focus:outline-none" />
          </label>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {list.map((w) => {
            const st = status(s.vocab[w.word])
            return (
              <li key={w.word} className="rounded-2xl border border-[#efe9de] p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[15px] font-semibold">
                    {w.word} <span className="text-[12px] font-normal text-moss">{w.pos}</span>
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${st === 'mastered' ? 'bg-jg-50 text-jg-700' : st === 'learning' ? 'bg-orange-50 text-orange-700' : 'bg-cream text-moss'}`}>{st}</span>
                </div>
                <p className="mt-1 text-[13px] text-pine/75">{w.def}</p>
              </li>
            )
          })}
        </ul>
        {list.length === 0 && (
          <p className="mt-6 flex items-center justify-center gap-2 text-[13px] text-moss">
            <RotateCcw className="size-4" /> No words match "{q}".
          </p>
        )}
      </section>
    </div>
  )
}
