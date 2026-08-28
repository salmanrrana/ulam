import { useEffect, useRef, useState } from 'react'
import { SpiralCanvas } from './components/SpiralCanvas'
import { useParallax, useProgressRail, useSmoothScroll } from './hooks'
import { hud } from './lib/hud'

/** Live counters for the finale, polled from the canvas loop's hud store. */
function FinaleStats() {
  const [stats, setStats] = useState({ points: 0, primes: 0 })
  useEffect(() => {
    let raf = 0
    const loop = () => {
      setStats((prev) =>
        prev.points === hud.points ? prev : { points: hud.points, primes: hud.primes },
      )
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div className="flex gap-10 md:gap-20">
      <Stat label="numbers wound" value={stats.points.toLocaleString()} />
      <Stat label="lit as prime" value={stats.primes.toLocaleString()} />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-6xl text-ember md:text-8xl">{value}</div>
      <div className="mt-2 text-[10px] tracking-[0.3em] text-bone/50 uppercase">
        {label}
      </div>
    </div>
  )
}

export default function App() {
  useSmoothScroll()
  useParallax()
  const railRef = useRef<HTMLDivElement>(null)
  useProgressRail(railRef)

  return (
    <>
      <SpiralCanvas />

      {/* scroll progress rail */}
      <div className="fixed top-1/2 right-5 z-20 h-40 w-px -translate-y-1/2 bg-bone/15">
        <div
          ref={railRef}
          className="h-full w-full origin-top bg-ember"
          style={{ transform: 'scaleY(0)' }}
        />
      </div>

      <main className="relative z-10">
        {/* HERO */}
        <section className="flex min-h-[170vh] flex-col items-center justify-start pt-[22vh] text-center">
          <div data-parallax="0.12">
            <p className="text-[10px] tracking-[0.4em] text-bone/50 uppercase">
              maa faa notes · math website idea · est. 1963
            </p>
            <h1 className="font-display mt-6 text-[clamp(5rem,22vw,22rem)] leading-[0.85]">
              ULAM
            </h1>
            <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-bone/70">
              A boring meeting. A notepad. Stanislaw Ulam wound the whole numbers
              into a spiral, circled the primes — and found order where none
              should live.
            </p>
            <p className="mt-16 animate-pulse text-[10px] tracking-[0.35em] text-ember/80 uppercase">
              scroll — the spiral is still drawing itself
            </p>
          </div>
        </section>

        {/* THE DOODLE */}
        <section className="min-h-[160vh] px-6">
          <div data-parallax="0.22" className="max-w-xl md:ml-[8vw]">
            <p className="text-[10px] tracking-[0.4em] text-ember/70 uppercase">
              i. the doodle
            </p>
            <h2 className="font-display mt-4 text-5xl leading-tight md:text-7xl">
              One at the center.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-bone/70">
              Then two, three, four — winding outward in an endless square
              spiral, edge by edge, turning a little each time, forever. Nothing
              clever about it. That was the point.
            </p>
          </div>
          <div data-parallax="0.3" className="mt-[30vh] max-w-lg md:ml-auto md:mr-[10vw]">
            <p className="text-[10px] tracking-[0.4em] text-ember/70 uppercase">
              ii. the circles
            </p>
            <h2 className="font-display mt-4 text-5xl leading-tight md:text-7xl">
              Then he circled the primes.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-bone/70">
              Watch the ember points ignite as you fall through the numbers.
              They should scatter like noise. They do not.
            </p>
          </div>
        </section>

        {/* QUOTE */}
        <section className="flex min-h-[140vh] items-center justify-center px-6">
          <div data-parallax="0.18" className="max-w-3xl text-center">
            <p className="font-display text-4xl leading-snug italic md:text-6xl">
              “…appears to exhibit a strongly nonrandom appearance.”
            </p>
            <p className="mt-8 text-[10px] tracking-[0.4em] text-bone/50 uppercase">
              stanislaw ulam · 1963
            </p>
          </div>
        </section>

        {/* THE PATTERN */}
        <section className="min-h-[170vh] px-6">
          <div data-parallax="0.26" className="max-w-xl md:ml-[12vw]">
            <p className="text-[10px] tracking-[0.4em] text-ember/70 uppercase">
              iii. the pattern
            </p>
            <h2 className="font-display mt-4 text-5xl leading-tight md:text-7xl">
              The diagonals were already there.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-bone/70">
              Clusters of primes lining up along rays from the center — invisible
              in any list, obvious on the grid. Nobody put them there. Nobody
              has fully explained why they persist.
            </p>
          </div>
          <div data-parallax="0.34" className="mt-[28vh] max-w-lg md:ml-auto md:mr-[8vw]">
            <h2 className="font-display text-4xl leading-tight md:text-6xl">
              Symmetry and surprise.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-bone/70">
              With computers the spiral can be explored almost indefinitely — a
              wonderfully rich structure, reminiscent of a fractal, that could
              not be predicted.
            </p>
          </div>
        </section>

        {/* FINALE */}
        <section className="flex min-h-[130vh] flex-col items-center justify-center px-6 text-center">
          <div data-parallax="0.15">
            <FinaleStats />
            <p className="mt-14 text-sm text-bone/60">
              Keep scrolling. It winds back out — the pattern never repeats.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-8 cursor-pointer border border-bone/25 px-6 py-3 text-[10px] tracking-[0.35em] uppercase transition-colors hover:border-ember hover:text-ember"
            >
              rewind to n = 441
            </button>
          </div>
        </section>

        <footer className="relative z-10 flex items-center justify-between px-6 pb-8 text-[10px] tracking-[0.25em] text-bone/35 uppercase">
          <span>built from a maa faa note</span>
          <span>salmanrrana · ulam</span>
        </footer>
      </main>
    </>
  )
}
