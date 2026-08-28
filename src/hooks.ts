import { useEffect } from 'react'
import Lenis from 'lenis'

/** Silky smooth scrolling (skipped when the user prefers reduced motion). */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.075 })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])
}

interface ParallaxItem {
  el: HTMLElement
  top: number
  h: number
  speed: number
}

/**
 * Scroll parallax for every element carrying [data-parallax="speed"].
 * Elements drift against the scroll and fade in/out as they cross the viewport.
 */
export function useParallax() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    let items: ParallaxItem[] = []

    const measure = () => {
      items = els.map((el) => {
        el.style.transform = '' // measure untransformed
        const rect = el.getBoundingClientRect()
        return {
          el,
          top: rect.top + window.scrollY,
          h: rect.height,
          speed: Number(el.dataset.parallax ?? 0.2),
        }
      })
    }
    measure()
    window.addEventListener('resize', measure)

    let raf = 0
    const loop = () => {
      const sy = window.scrollY
      const vh = window.innerHeight
      for (const it of items) {
        const rel = (it.top + it.h / 2 - sy - vh / 2) / vh
        it.el.style.transform = `translate3d(0, ${(rel * it.speed * vh).toFixed(1)}px, 0)`
        const far = Math.max(0, Math.abs(rel) - 0.42) / 0.58
        it.el.style.opacity = (1 - Math.min(1, far * 1.7)).toFixed(3)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [])
}

/** Vertical scroll-progress rail on the right edge of the viewport. */
export function useProgressRail(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    let raf = 0
    const loop = () => {
      const doc = document.documentElement
      const range = Math.max(1, doc.scrollHeight - window.innerHeight)
      const p = Math.min(1, Math.max(0, window.scrollY / range))
      if (ref.current) ref.current.style.transform = `scaleY(${p})`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [ref])
}
