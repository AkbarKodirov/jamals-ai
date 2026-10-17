import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GoogleButton } from '../auth/GoogleButton'
import { useAuth } from '../lib/auth'
import { TryHumo } from './TryHumo'
import { Features } from './Features'
import { Proof, HowItWorks, Pricing, Faq, FinalCta, Footer } from './Sections'

const HumoScene = lazy(() => import('../three/HumoScene'))

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <img src="/brand/jamals-mark.png" alt="" className="size-9 rounded-full" />
      <span className="flex flex-col leading-none">
        <span className="text-[16px] font-semibold tracking-tight">Jamals AI</span>
        {!compact && <span className="mt-1 text-[11px] text-cream/50">by Jamals International Academy</span>}
      </span>
    </span>
  )
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth()
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const links = [
    ['Try Humo', '#try'],
    ['Features', '#features'],
    ['Pricing', '#pricing'],
    ['FAQ', '#faq'],
  ]
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled ? 'border-b border-white/[0.07] bg-ink/75 backdrop-blur-xl' : ''}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="Jamals AI home">
          <Logo />
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="rounded-full px-4 py-1.5 text-[13px] text-white/65 transition hover:bg-white/[0.06] hover:text-white">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/app" className="h-9 rounded-full bg-white px-4 text-[13px] font-medium leading-9 text-ink hover:bg-white">
              Open app
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden h-9 px-3 text-[13px] leading-9 text-white/70 hover:text-white sm:block">
                Log in
              </Link>
              <Link to="/signup" className="h-9 rounded-full bg-white px-4 text-[13px] font-medium leading-9 text-ink hover:bg-white">
                Start free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function Hero() {
  const [ready, setReady] = useState(false)
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.25 + i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } }),
  }
  return (
    <section className="relative isolate flex min-h-[720px] items-end overflow-hidden md:h-svh md:items-center">
      {/* 3D stage */}
      <div className={`absolute inset-0 -z-10 transition-opacity duration-[1600ms] ${ready ? 'opacity-100' : 'opacity-0'}`}>
        <Suspense fallback={null}>
          <SceneReady onReady={() => setReady(true)} />
        </Suspense>
      </div>
      {/* warm glow while WebGL loads, and a floor fade into the page */}
      <div className="pointer-events-none absolute right-[-10%] top-[10%] -z-20 size-[60vmin] rounded-full bg-jg-500/15 blur-[120px] md:right-[8%]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden w-1/2 bg-gradient-to-r from-ink/80 to-transparent md:block" />

      <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-[52vh] sm:px-6 md:pb-0 md:pt-16">
        <div className="max-w-[38rem]">
          <motion.a
            href="#try"
            custom={0}
            initial="hidden"
            animate="show"
            variants={item}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3.5 text-[13px] text-white/70 backdrop-blur hover:border-jg-500/40"
          >
            <span className="rounded-full bg-jg-500 px-2 py-0.5 text-[11px] font-semibold text-ink">New</span>
            Meet Humo, the AI tutor from Jamals Academy
          </motion.a>

          <motion.h1 custom={1} initial="hidden" animate="show" variants={item} className="display text-[clamp(2.75rem,7.2vw,5.9rem)]">
            Your SAT score, raised by <span className="brush">Humo</span>.
          </motion.h1>

          <motion.p custom={2} initial="hidden" animate="show" variants={item} className="mt-6 max-w-[31rem] text-[17px] leading-relaxed text-white/60">
            Six years of Jamals Academy teaching, now in one platform: real Digital SAT and IELTS practice, timed mocks, and Humo — an AI tutor that shows you why you missed a question, in English, O'zbekcha or Русский.
          </motion.p>

          <motion.div custom={3} initial="hidden" animate="show" variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <GoogleButton />
            <a href="#try" className="inline-flex h-13 items-center rounded-full border border-white/15 px-6 text-[15px] text-white/85 transition hover:border-white/30 hover:bg-white/[0.04]">
              Try a question first
            </a>
          </motion.div>
          <motion.p custom={4} initial="hidden" animate="show" variants={item} className="mt-4 text-[13px] text-white/40">
            Free to start. No card needed.
          </motion.p>

          <motion.dl custom={5} initial="hidden" animate="show" variants={item} className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6">
            {[
              ['11 000+', 'students taught since 2020'],
              ['5 000+', 'scored 1350+ on the SAT'],
              ['1 000+', 'admitted to top universities'],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-serif text-[28px] tracking-tight">{v}</dt>
                <dd className="mt-1 text-[12px] leading-snug text-white/45">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  )
}

/** Mounts the WebGL scene and reports once its chunk has loaded. */
function SceneReady({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    const t = setTimeout(onReady, 120)
    return () => clearTimeout(t)
  }, [onReady])
  return <HumoScene layout="hero" />
}

export default function Landing() {
  return (
    <div className="min-h-svh bg-ink text-white">
      <Nav />
      <main>
        <Hero />
        <Proof />
        <TryHumo />
        <Features />
        <HowItWorks />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
