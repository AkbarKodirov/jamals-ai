// Imports the "Practice Test" and "Mock" sets from the uploaded tests.js (R&W) into public/tests.
// Usage: node scripts/import-practice.mjs path/to/tests.js
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
const ROOT = new URL('..', import.meta.url).pathname
const src = readFileSync(process.argv[2], 'utf8') + '\nexport { TESTS }'
const { TESTS } = await import('data:text/javascript;base64,' + Buffer.from(src).toString('base64'))
const index = JSON.parse(readFileSync(join(ROOT, 'public/tests/index.json'), 'utf8')).filter((t) => !t.id.startsWith('rw-'))
for (const t of TESTS.filter((x) => /^(Practice Test|Mock)\b/.test(x.title))) {
  const name = `R&W ${t.title.replace('(version 2)', 'B').replace(/\s+/g, ' ').trim()}`
  const id = 'rw-' + t.title.toLowerCase().replace(/\(version 2\)/, 'b').replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
  const qs = t.questions.map((q) => {
    const p = t.passages.find((x) => x.id === q.passageId)
    return { passage: p?.html ?? null, passageImage: null, image: null, question: q.question, format: 'mc', options: q.choices, correct: q.correct, answer: null }
  })
  const modules = qs.length > 27 ? [{ questions: qs.slice(0, Math.ceil(qs.length / 2)) }, { questions: qs.slice(Math.ceil(qs.length / 2)) }] : [{ questions: qs }]
  writeFileSync(join(ROOT, 'public/tests', id + '.json'), JSON.stringify({ id, name, type: 'EBRW', description: `Reading and Writing · ${modules.length} module${modules.length > 1 ? 's' : ''} · ${qs.length} questions`, modules }))
  index.push({ id, name, type: 'EBRW', modules: modules.length, questions: qs.length, minutesPerModule: t.timeMinutes || 32 })
  console.log(id, name, qs.length)
}
index.sort((a, b) => (a.id.startsWith('rw-') === b.id.startsWith('rw-') ? a.name.localeCompare(b.name, undefined, { numeric: true }) : a.id.startsWith('rw-') ? 1 : -1))
writeFileSync(join(ROOT, 'public/tests/index.json'), JSON.stringify(index, null, 2))
