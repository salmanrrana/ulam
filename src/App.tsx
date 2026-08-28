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
      <div className="mt-2 text-[10px] tracking-[0.3em] text-bone/60 uppercase">
        {label}
      </div>
    </div>
  )
}

type Align = 'left' | 'right' | 'center'

interface Block {
  align: Align
  eyebrow?: string
  title?: string
  titleItalic?: boolean
  body?: string
  parallax: number
}

interface Section {
  height: number
  blocks: Block[]
}

const ALIGN_CLASS: Record<Align, string> = {
  left: 'max-w-xl md:ml-[10vw]',
  right: 'max-w-xl md:ml-auto md:mr-[10vw]',
  center: 'max-w-3xl mx-auto text-center',
}

// The journey: ~16,600vh of scroll. Each block sits alone in a long stretch,
// so between beats there is nothing but the spiral, growing.
const SECTIONS: Section[] = [
  // ACT I — THE DOODLE
  {
    height: 1200,
    blocks: [
      {
        align: 'left',
        eyebrow: 'i. the doodle',
        title: 'One at the center.',
        body: 'Then two, three, four — winding outward in an endless square spiral, edge by edge, turning a little each time, forever. Nothing clever about it. That was the point.',
        parallax: 0.22,
      },
    ],
  },
  {
    height: 1200,
    blocks: [
      {
        align: 'right',
        eyebrow: 'ii. the circles',
        title: 'Then he circled the primes.',
        body: 'Watch the ember points ignite as you fall through the numbers. They should scatter like noise. They do not.',
        parallax: 0.3,
      },
    ],
  },
  {
    height: 1200,
    blocks: [
      {
        align: 'center',
        titleItalic: true,
        title: '“…appears to exhibit a strongly nonrandom appearance.”',
        body: '— Stanislaw Ulam, 1963',
        parallax: 0.18,
      },
    ],
  },
  // ACT II — THE PATTERN
  {
    height: 1200,
    blocks: [
      {
        align: 'left',
        eyebrow: 'iii. the pattern',
        title: 'The diagonals were already there.',
        body: 'Clusters of primes lining up along rays from the center — invisible in any list, obvious on the grid. Nobody put them there. Nobody has fully explained why they persist.',
        parallax: 0.26,
      },
    ],
  },
  {
    height: 1200,
    blocks: [
      {
        align: 'right',
        eyebrow: 'iv. the strange arithmetic',
        title: 'Some lines glow too bright to be luck.',
        body: 'One of them traces the polynomial n² + n + 41 — prime for every n from 0 to 39. Euler noticed it in 1772. Ulam found it burning on his spiral, one dense diagonal among the scatter.',
        parallax: 0.34,
      },
    ],
  },
  {
    height: 1200,
    blocks: [
      {
        align: 'center',
        eyebrow: 'n = 1,000',
        title: 'You just passed a thousand.',
        body: 'One hundred sixty-eight embers lit so far. The lines are already reaching for the edges of the frame.',
        parallax: 0.2,
      },
    ],
  },
  {
    height: 1200,
    blocks: [
      {
        align: 'left',
        eyebrow: 'n = 10,000',
        title: 'Ten thousand.',
        body: 'A thousand two hundred twenty-nine primes, and the diagonals have not blinked. Zoom in anywhere — the texture looks the same at every scale, like the spiral is made of smaller spirals.',
        parallax: 0.28,
      },
    ],
  },
  {
    height: 1200,
    blocks: [
      {
        align: 'right',
        title: 'No formula draws the lines.',
        body: 'They are a shadow of how numbers factor — the spiral just made them visible. Change the grid, tilt it, stretch it: the lines survive. The pattern was always in the numbers.',
        parallax: 0.22,
      },
    ],
  },
  {
    height: 1200,
    blocks: [
      {
        align: 'left',
        eyebrow: 'n = 50,000',
        title: 'The machine confirmed it.',
        body: 'Ulam went home that night in 1963 and did not stop. With Mark Wells he ran the spiral on MANIAC II, out past ten million numbers, photographing the results. The diagonals never faded.',
        parallax: 0.3,
      },
    ],
  },
  {
    height: 1200,
    blocks: [
      {
        align: 'right',
        eyebrow: 'june 1964',
        title: 'Then the world got to draw it too.',
        body: 'Martin Gardner put the spiral in his Scientific American column, and readers mailed in spirals of their own — hand-plotted, thousands of dots deep. Every single one showed the same lines. The pattern did not care who drew it.',
        parallax: 0.24,
      },
    ],
  },
  {
    height: 1200,
    blocks: [
      {
        align: 'center',
        titleItalic: true,
        title: 'Symmetry and surprise.',
        body: 'Structure without a reason, order without a formula — reminiscent of a fractal, but made of nothing but counting.',
        parallax: 0.18,
      },
    ],
  },
  {
    height: 1200,
    blocks: [
      {
        align: 'left',
        eyebrow: 'n = 100,000',
        title: 'A hundred thousand deep.',
        body: 'You passed it a while back. The grain is fine now — every dot a decision, prime or not, and still the diagonals hold. The paper is almost full.',
        parallax: 0.26,
      },
    ],
  },
  {
    height: 1200,
    blocks: [
      {
        align: 'right',
        eyebrow: 'n = 160,801',
        title: '401 × 401.',
        body: 'This is where Ulam’s notepad ends — and where yours begins. The pattern never repeats. It just keeps winding.',
        parallax: 0.32,
      },
    ],
  },
  // FINALE
  {
    height: 130,
    blocks: [],
  },
]

function BlockView({ block }: { block: Block }) {
  return (
    <div data-parallax={block.parallax} className={`${ALIGN_CLASS[block.align]} w-[85%] md:w-auto`}>
      {block.eyebrow && (
        <p className="text-[10px] tracking-[0.4em] text-ember/80 uppercase">
          {block.eyebrow}
        </p>
      )}
      {block.title && (
        <h2
          className={`font-display mt-4 text-5xl leading-[1.05] text-bone md:text-7xl ${
            block.titleItalic ? 'text-4xl italic md:text-6xl' : ''
          }`}
        >
          {block.title}
        </h2>
      )}
      {block.body && (
        <p className="mt-6 text-base leading-relaxed text-bone/85 md:text-lg">
          {block.body}
        </p>
      )}
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
      {/* HERO handled separately so the title can go giant */}

      {/* scroll progress rail */}
      <div className="fixed top-1/2 right-5 z-20 h-40 w-px -translate-y-1/2 bg-bone/15">
        <div
          ref={railRef}
          className="h-full w-full origin-top bg-ember"
          style={{ transform: 'scaleY(0)' }}
        />
      </div>

      <main className="relative z-10">
        <section className="flex min-h-[170vh] flex-col items-center justify-start pt-[22vh] text-center">
          <div data-parallax="0.12">
            <h1 className="font-display text-[clamp(5rem,22vw,22rem)] leading-[0.85]">
              ULAM
            </h1>
            <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-bone/85 md:text-lg">
              A boring meeting. A notepad. Stanislaw Ulam wound the whole numbers
              into a spiral, circled the primes — and found order where none
              should live.
            </p>
            <p className="mt-16 animate-pulse text-[11px] tracking-[0.35em] text-ember/90 uppercase">
              scroll — the spiral is still drawing itself
            </p>
          </div>
        </section>

        {SECTIONS.map((section, si) =>
          si === SECTIONS.length - 1 ? (
            // FINALE
            <section
              key={si}
              className="flex min-h-[130vh] flex-col items-center justify-center px-6 text-center"
            >
              <div data-parallax="0.15">
                <FinaleStats />
                <p className="mt-14 text-base text-bone/80">
                  Keep scrolling. It winds back out — the pattern never repeats.
                </p>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="mt-8 cursor-pointer border border-bone/30 px-6 py-3 text-[10px] tracking-[0.35em] text-bone/90 uppercase transition-colors hover:border-ember hover:text-ember"
                >
                  rewind to n = 441
                </button>
              </div>
            </section>
          ) : (
            <section
              key={si}
              className="flex items-center px-6"
              style={{ minHeight: `${section.height}vh` }}
            >
              <div className="w-full">
                {section.blocks.map((block, bi) => (
                  <BlockView key={bi} block={block} />
                ))}
              </div>
            </section>
          ),
        )}
      </main>
    </>
  )
}
