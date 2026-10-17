import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'

/** Number that counts up from 0 the first time it scrolls into view. */
export function CountUp({ to, duration = 1.1, className = '', format = (n: number) => String(Math.round(n)) }: { to: number; duration?: number; className?: string; format?: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [v, setV] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setV(to)
      return
    }
    const c = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: setV })
    return () => c.stop()
  }, [inView, to, duration, reduce])
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {format(v)}
    </span>
  )
}

/** Circular progress ring that draws itself in. */
export function ScoreRing({ value, max, size = 168, stroke = 12, color = '#62b968', track = 'rgb(255 255 255 / 0.1)', children }: { value: number; max: number; size?: number; stroke?: number; color?: string; track?: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(1, value / max))
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}

const CONFETTI_COLORS = ['#62b968', '#48ae4f', '#f7c76a', '#e9a23b', '#faf7f1', '#8fd295']

/** A one-shot burst of confetti from the centre of its parent. Pure DOM — no canvas, no library. */
export function Confetti({ fire, count = 46 }: { fire: boolean; count?: number }) {
  const reduce = useReducedMotion()
  const [pieces] = useState(() =>
    Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.4
      const d = 120 + Math.random() * 220
      return { x: Math.cos(a) * d, y: Math.sin(a) * d - 80, r: Math.random() * 540 - 270, c: CONFETTI_COLORS[i % CONFETTI_COLORS.length], w: 6 + Math.random() * 6, h: 8 + Math.random() * 10, delay: Math.random() * 0.12 }
    }),
  )
  if (!fire || reduce) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible" aria-hidden>
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 rounded-[2px]"
          style={{ width: p.w, height: p.h, background: p.c }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0.6 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 260], rotate: p.r, opacity: [1, 1, 0], scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: p.delay, times: [0, 0.45, 1] }}
        />
      ))}
    </div>
  )
}

/** Fades content up once as it enters the viewport. */
export function Reveal({ children, delay = 0, className = '', y = 22 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

/** Card with a soft light that follows the pointer. */
export function Spotlight({ children, className = '', color = 'rgba(98,185,104,0.16)' }: { children: React.ReactNode; className?: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}
      className={`group/spot relative ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 45%)` }}
      />
      {children}
    </div>
  )
}

/** Gentle 3D tilt toward the pointer. */
export function Tilt({ children, className = '', max = 6 }: { children: React.ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion()
  const [rot, setRot] = useState({ x: 0, y: 0 })
  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 900 }}
      animate={{ rotateX: rot.x, rotateY: rot.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        setRot({ x: -py * max, y: px * max })
      }}
      onPointerLeave={() => setRot({ x: 0, y: 0 })}
    >
      {children}
    </motion.div>
  )
}
