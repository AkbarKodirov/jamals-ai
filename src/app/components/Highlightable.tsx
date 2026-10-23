import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { StickyNote, Trash2, Underline, X } from 'lucide-react'
import { type Highlight } from '../store'
import { setHighlights, useHighlights } from '../highlights'

const COLORS: Record<Highlight['color'], string> = {
  yellow: 'hl-yellow',
  blue: 'hl-blue',
  pink: 'hl-pink',
  underline: 'hl-underline',
}
const SWATCH: [Highlight['color'], string][] = [
  ['yellow', '#fde68a'],
  ['blue', '#bfdbfe'],
  ['pink', '#fbcfe8'],
]

/** Character offset of (node, offset) inside root, counted over text only. */
function offsetOf(root: HTMLElement, node: Node, offset: number) {
  const r = document.createRange()
  r.setStart(root, 0)
  r.setEnd(node, offset)
  return r.toString().length
}

/** Wraps each highlight range in <mark> elements (a range may span several text nodes). */
function paint(root: HTMLElement, list: Highlight[]) {
  list.forEach((h, idx) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const nodes: Text[] = []
    while (walker.nextNode()) nodes.push(walker.currentNode as Text)
    let pos = 0
    for (const n of nodes) {
      const len = n.data.length
      const a = Math.max(h.start, pos)
      const b = Math.min(h.end, pos + len)
      if (a < b) {
        let target = n
        if (a - pos > 0) target = target.splitText(a - pos)
        if (b - a < target.data.length) target.splitText(b - a)
        const mark = document.createElement('mark')
        mark.className = `hl ${COLORS[h.color]}${h.note ? ' hl-note' : ''}`
        mark.dataset.h = String(idx)
        target.parentNode!.insertBefore(mark, target)
        mark.appendChild(target)
      }
      pos += len
    }
  })
}

type Tool = { x: number; y: number; start?: number; end?: number; idx?: number }

/**
 * Bluebook-style "Highlights & Notes" for Reading and Writing: select text to highlight it in three colours,
 * underline it, or attach a note. Saved per question on this device. Only used on R&W questions.
 */
export function Highlightable({ html, text, storeKey, enabled = true, className = '' }: { html?: string; text?: string; storeKey: string; enabled?: boolean; className?: string }) {
  const list = useHighlights(storeKey)
  const ref = useRef<HTMLDivElement>(null)
  const [tool, setTool] = useState<Tool | null>(null)
  const [note, setNote] = useState<{ idx: number; value: string } | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (html != null) el.innerHTML = html
    else el.textContent = text ?? ''
    paint(el, list)
  }, [html, text, list])

  const save = useCallback((next: Highlight[]) => setHighlights(storeKey, next), [storeKey])

  useEffect(() => {
    if (!tool) return
    const close = (e: Event) => {
      if (!(e.target as HTMLElement).closest?.('[data-hl-tool]')) setTool(null)
    }
    const t = setTimeout(() => document.addEventListener('pointerdown', close), 0)
    return () => {
      clearTimeout(t)
      document.removeEventListener('pointerdown', close)
    }
  }, [tool])

  function onUp() {
    if (!enabled || !ref.current) return
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return
    const r = sel.getRangeAt(0)
    if (!ref.current.contains(r.commonAncestorContainer)) return
    const start = offsetOf(ref.current, r.startContainer, r.startOffset)
    const end = offsetOf(ref.current, r.endContainer, r.endOffset)
    if (end - start < 1) return
    const rect = r.getBoundingClientRect()
    setTool({ x: rect.left + rect.width / 2, y: rect.top, start, end })
  }

  function onClick(e: React.MouseEvent) {
    if (!enabled) return
    const m = (e.target as HTMLElement).closest('mark.hl') as HTMLElement | null
    if (!m || !window.getSelection()?.isCollapsed) return
    const rect = m.getBoundingClientRect()
    setTool({ x: rect.left + rect.width / 2, y: rect.top, idx: Number(m.dataset.h) })
  }

  function apply(color: Highlight['color']) {
    if (!tool) return
    if (tool.idx != null) save(list.map((h, i) => (i === tool.idx ? { ...h, color } : h)))
    else if (tool.start != null && tool.end != null) {
      // new highlight replaces any it overlaps
      const rest = list.filter((h) => h.end <= tool.start! || h.start >= tool.end!)
      save([...rest, { start: tool.start, end: tool.end, color }].sort((a, b) => a.start - b.start))
    }
    window.getSelection()?.removeAllRanges()
    setTool(null)
  }

  function addNote() {
    if (!tool) return
    let idx = tool.idx
    if (idx == null && tool.start != null && tool.end != null) {
      const rest = list.filter((h) => h.end <= tool.start! || h.start >= tool.end!)
      const next = [...rest, { start: tool.start, end: tool.end, color: 'yellow' as const }].sort((a, b) => a.start - b.start)
      save(next)
      idx = next.findIndex((h) => h.start === tool.start)
    }
    window.getSelection()?.removeAllRanges()
    setNote({ idx: idx!, value: (idx != null ? list[idx]?.note : '') ?? '' })
    setTool(null)
  }

  const current = tool?.idx != null ? list[tool.idx] : null

  return (
    <>
      <div ref={ref} onMouseUp={onUp} onTouchEnd={() => setTimeout(onUp, 30)} onClick={onClick} className={`${enabled ? 'select-text' : ''} ${className}`} />
      {list.some((h) => h.note) && (
        <div className="mt-4 space-y-1.5">
          {list.map((h, i) =>
            h.note ? (
              <button key={i} onClick={() => setNote({ idx: i, value: h.note ?? '' })} className="flex w-full items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-left text-[12.5px] text-amber-900 ring-1 ring-amber-200/70">
                <StickyNote className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  <span className="font-semibold">“{(ref.current?.textContent ?? '').slice(h.start, h.end).slice(0, 40)}”</span> — {h.note}
                </span>
              </button>
            ) : null,
          )}
        </div>
      )}
      {createPortal(
        <AnimatePresence>
          {tool && (
            <motion.div
              data-hl-tool
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{ left: Math.max(110, Math.min(window.innerWidth - 110, tool.x)), top: Math.max(8, tool.y - 52) }}
              className="fixed z-[80] flex -translate-x-1/2 items-center gap-1 rounded-full bg-pine p-1.5 text-cream shadow-[0_12px_30px_-10px_rgb(10_15_14/.6)]"
            >
              {SWATCH.map(([c, hex]) => (
                <button key={c} aria-label={`Highlight ${c}`} onClick={() => apply(c)} className={`size-7 rounded-full ring-2 transition-transform hover:scale-110 ${current?.color === c ? 'ring-white' : 'ring-transparent'}`} style={{ background: hex }} />
              ))}
              <button aria-label="Underline" onClick={() => apply('underline')} className={`grid size-7 place-items-center rounded-full hover:bg-white/10 ${current?.color === 'underline' ? 'bg-white/15' : ''}`}>
                <Underline className="size-4" />
              </button>
              <button aria-label="Add note" onClick={addNote} className="grid size-7 place-items-center rounded-full hover:bg-white/10">
                <StickyNote className="size-4" />
              </button>
              {tool.idx != null && (
                <button
                  aria-label="Remove highlight"
                  onClick={() => {
                    save(list.filter((_, i) => i !== tool.idx))
                    setTool(null)
                  }}
                  className="grid size-7 place-items-center rounded-full text-red-300 hover:bg-white/10"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </motion.div>
          )}
          {note && (
            <motion.div data-hl-tool className="fixed inset-0 z-[85] grid place-items-center bg-pine/30 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNote(null)}>
              <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-card p-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-semibold">Note</p>
                  <button aria-label="Close" onClick={() => setNote(null)} className="rounded-full p-1 text-moss hover:bg-cream">
                    <X className="size-4" />
                  </button>
                </div>
                <textarea autoFocus value={note.value} onChange={(e) => setNote({ ...note, value: e.target.value.slice(0, 300) })} rows={4} placeholder="e.g. Claim → evidence here" className="mt-3 w-full resize-none rounded-xl border border-line p-3 text-[14px] focus:border-jg-500 focus:outline-none" />
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      save(list.map((h, i) => (i === note.idx ? { ...h, note: undefined } : h)))
                      setNote(null)
                    }}
                    className="px-3 text-[13px] text-moss"
                  >
                    Delete note
                  </button>
                  <button
                    onClick={() => {
                      save(list.map((h, i) => (i === note.idx ? { ...h, note: note.value.trim() || undefined } : h)))
                      setNote(null)
                    }}
                    className="btn btn-dark h-9 px-4 text-[13px]"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
