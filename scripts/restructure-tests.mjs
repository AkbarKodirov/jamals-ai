// Practice tests section: every test is "Practice Test N"; single 27-question R&W modules are paired into full 54-question tests.
// Old single-module files stay on disk so earlier results still open; they just leave the index.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
const ROOT = new URL('..', import.meta.url).pathname
const T = (id) => JSON.parse(readFileSync(join(ROOT, 'public/tests', id + '.json'), 'utf8'))
const out = []
const put = (id, name, type, modules, minutes) => {
  const n = modules.reduce((s, m) => s + m.questions.length, 0)
  const label = type === 'MATH' ? 'Math' : 'Reading & Writing'
  writeFileSync(join(ROOT, 'public/tests', id + '.json'), JSON.stringify({ id, name, type, description: `Full-length SAT ${label} · ${modules.length} modules × ${modules[0].questions.length} = ${n} questions.`, modules }))
  out.push({ id, name, type, modules: modules.length, questions: n, minutesPerModule: minutes })
}
let k = 0
for (const id of ['pt1', 'pt2', 'pt3', 'pt4', 'pt5', 'pt6', 'rw-mock-1', 'rw-mock-2']) put(id, `Practice Test ${++k}`, 'EBRW', T(id).modules, 32)
const pairs = [['rw-practice-test-1', 'rw-practice-test-2'], ['rw-practice-test-3', 'rw-practice-test-3-b'], ['rw-practice-test-5', 'rw-practice-test-6'], ['rw-practice-test-7', 'rw-practice-test-10'], ['rw-practice-test-11-b', null]]
for (const [a, b] of pairs) {
  const id = `pt${++k}`
  const m2 = b ? T(b).modules[0] : existsSync(join(ROOT, 'scripts/cache/rw-pt13-m2.json')) ? JSON.parse(readFileSync(join(ROOT, 'scripts/cache/rw-pt13-m2.json'), 'utf8')) : null
  if (m2) put(id, `Practice Test ${k}`, 'EBRW', [T(a).modules[0], m2], 32)
}
// Math practice tests written by gen-tests.mjs
for (let i = 1; existsSync(join(ROOT, `public/tests/math-pt${i}.json`)); i++) {
  const t = T(`math-pt${i}`)
  put(t.id, `Practice Test ${i}`, 'MATH', t.modules, 35)
}
writeFileSync(join(ROOT, 'public/tests/index.json'), JSON.stringify(out, null, 2))
console.log(out.map((t) => `${t.id} ${t.type} ${t.name} ${t.questions}`).join('\n'))
