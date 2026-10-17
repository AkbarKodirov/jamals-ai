import { Fragment } from 'react'

/** Renders Humo's light markdown (**bold**, *italic*, bullet lines) as React nodes — no raw HTML. */
export function RichText({ text }: { text: string }) {
  const inline = (s: string, k: string) =>
    s.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={k + i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      ) : part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
        <em key={k + i}>{part.slice(1, -1)}</em>
      ) : (
        <Fragment key={k + i}>{part}</Fragment>
      ),
    )
  return (
    <>
      {text.split('\n').map((line, i) => {
        const bullet = /^\s*[-•*]\s+/.test(line)
        const clean = line.replace(/^\s*[-•*]\s+/, '').replace(/^#{1,4}\s*/, '')
        if (/^\s*-{3,}\s*$/.test(line)) return <span key={i} className="my-2 block h-px bg-current opacity-15" />
        if (!clean.trim()) return <span key={i} className="block h-2" />
        return (
          <span key={i} className={`block ${bullet ? 'relative pl-4' : ''}`}>
            {bullet && <span className="absolute left-0 top-0">•</span>}
            {inline(clean, `${i}-`)}
          </span>
        )
      })}
    </>
  )
}
