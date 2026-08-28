import { useEffect, useRef, useState } from 'react'
import {
  MAX_POINTS,
  MIN_POINTS,
  buildSpiral,
  primeCountUpTo,
  type Spiral,
} from '../lib/spiral'
import { hud } from '../lib/hud'

// Offscreen "all numbers" layer: the full spiral pre-rendered once at a fixed
// cell size, then drawn each frame with drawImage (cheap for the dim backdrop).
const OFF_CELL = 4
const OFF_HALF = 830 // coords reach +/-200 cells -> 800px + margin

// Build once per session; ~160k points + sieve is a few ms.
let spiral: Spiral | null = null
function getSpiral(): Spiral {
  spiral ??= buildSpiral(MAX_POINTS)
  return spiral
}

const DIM = 'rgba(232, 228, 218, 0.16)'
const EMBER = '#ffb454'

/**
 * Fullscreen fixed canvas. Scroll progress drives how much of the Ulam spiral
 * exists: 441 numbers at rest, 160,801 fully wound. Primes glow on a slightly
 * faster parallax layer so the pattern has depth.
 */
export function SpiralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stats, setStats] = useState({ points: 0, primes: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const s = getSpiral()

    // Offscreen layer: every number as a faint dot.
    const off = document.createElement('canvas')
    off.width = off.height = OFF_HALF * 2
    const offCtx = off.getContext('2d')!
    offCtx.fillStyle = DIM
    const dot = 1.8
    for (let i = 0; i < s.maxPoints; i++) {
      const px = OFF_HALF + s.xs[i] * OFF_CELL
      const py = OFF_HALF + s.ys[i] * OFF_CELL
      offCtx.fillRect(px - dot / 2, py - dot / 2, dot, dot)
    }

    // Pre-computed halo/core styles for the prime layer.
    const primeHalo = new Array<string | null>(s.maxPoints + 1).fill(null)
    for (const p of s.primeList) primeHalo[p] = EMBER

    let vw = 0
    let vh = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      vw = window.innerWidth
      vh = window.innerHeight
      canvas.width = Math.round(vw * dpr)
      canvas.height = Math.round(vh * dpr)
      canvas.style.width = `${vw}px`
      canvas.style.height = `${vh}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Pointer drift for an extra parallax axis.
    let mx = 0
    let my = 0
    let smx = 0
    let smy = 0
    const onPointer = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2
      my = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointer)

    let raf = 0
    let lastPush = 0

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      const doc = document.documentElement
      const range = Math.max(1, doc.scrollHeight - vh)
      const p = Math.min(1, Math.max(0, window.scrollY / range))

      smx += (mx - smx) * 0.04
      smy += (my - smy) * 0.04

      // How many numbers exist right now (exponential growth over the scroll).
      const count = Math.max(
        MIN_POINTS,
        Math.round(MIN_POINTS * Math.pow(MAX_POINTS / MIN_POINTS, p)),
      )
      const primesSoFar = primeCountUpTo(s, count)

      hud.points = count
      hud.primes = primesSoFar
      if (t - lastPush > 120) {
        lastPush = t
        setStats((prev) =>
          prev.points === count ? prev : { points: count, primes: primesSoFar },
        )
      }

      // Cell size keeps the wound part of the spiral filling ~92vmin,
      // so the journey reads as a slow zoom-out into finer and finer grain.
      const cells = Math.sqrt(count)
      const cell = (Math.min(vw, vh) * 0.92) / (cells + 1)
      const cx = vw / 2
      const cy = vh / 2
      const rot = p * 0.55 + Math.sin(t * 0.00005) * 0.04
      const breathe = 1 + Math.sin(t * 0.0006) * 0.008

      ctx.clearRect(0, 0, vw, vh)
      ctx.fillStyle = '#07070b'
      ctx.fillRect(0, 0, vw, vh)

      // --- dim layer: every number so far (back parallax) ---
      ctx.save()
      ctx.translate(cx + smx * 7, cy + smy * 7)
      ctx.rotate(rot)
      ctx.scale(breathe, breathe)
      if (cell >= 6) {
        ctx.fillStyle = DIM
        const sz = Math.max(1.5, cell * 0.42)
        for (let i = 0; i < count; i++) {
          const px = s.xs[i] * cell
          const py = s.ys[i] * cell
          ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz)
        }
      } else {
        // Crop exactly the wound region out of the pre-rendered layer.
        const sc = cell / OFF_CELL
        const halfPx = ((cells + 1) / 2) * OFF_CELL
        ctx.scale(sc, sc)
        ctx.drawImage(
          off,
          OFF_HALF - halfPx,
          OFF_HALF - halfPx,
          halfPx * 2,
          halfPx * 2,
          -halfPx,
          -halfPx,
          halfPx * 2,
          halfPx * 2,
        )
      }
      ctx.restore()

      // --- prime layer: slightly faster parallax -> depth ---
      const pCell = cell * 1.03
      ctx.save()
      ctx.translate(cx - smx * 14, cy - smy * 14)
      ctx.rotate(rot)
      ctx.scale(breathe, breathe)

      // soft halos first, then hot cores
      for (const prime of s.primeList) {
        if (prime > count) break
        const px = s.xs[prime - 1] * pCell
        const py = s.ys[prime - 1] * pCell
        // primes near the leading edge burn brighter — the pen just passed them
        const fresh = count - prime < count * 0.02
        const r = Math.max(2.5, pCell * (fresh ? 1.4 : 0.9))
        ctx.fillStyle = fresh ? 'rgba(255, 170, 70, 0.22)' : 'rgba(255, 160, 60, 0.12)'
        ctx.beginPath()
        ctx.arc(px, py, r, 0, Math.PI * 2)
        ctx.fill()
      }
      for (const prime of s.primeList) {
        if (prime > count) break
        const px = s.xs[prime - 1] * pCell
        const py = s.ys[prime - 1] * pCell
        const fresh = count - prime < count * 0.02
        const sz = Math.max(1.4, pCell * 0.5)
        ctx.fillStyle = fresh ? '#fff3d6' : EMBER
        ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz)
      }
      ctx.restore()

      // --- the "1" at the center, and the pen drawing the tip ---
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rot)
      ctx.strokeStyle = 'rgba(232, 228, 218, 0.35)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(0, 0, cell * 1.6, 0, Math.PI * 2)
      ctx.stroke()
      if (count < MAX_POINTS * 0.999) {
        const tx = s.xs[count - 1] * pCell
        const ty = s.ys[count - 1] * pCell
        const pulse = pCell * 1.5 + Math.sin(t * 0.004) * pCell * 0.5
        ctx.strokeStyle = 'rgba(255, 180, 84, 0.55)'
        ctx.beginPath()
        ctx.arc(tx, ty, pulse, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = '#fff3d6'
        ctx.fillRect(tx - 1.2, ty - 1.2, 2.4, 2.4)
      }
      ctx.restore()
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 z-[5]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(7,7,11,0.85) 100%)',
        }}
        aria-hidden="true"
      />
      {/* live HUD */}
      <div className="pointer-events-none fixed bottom-6 left-6 z-20 text-[10px] tracking-[0.25em] text-bone/50 uppercase">
        <div>n = {stats.points.toLocaleString()}</div>
        <div className="text-ember/70">primes = {stats.primes.toLocaleString()}</div>
      </div>
    </>
  )
}
