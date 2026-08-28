// Ulam spiral data: square-spiral coordinates for every n in [1..maxPoints],
// plus a prime sieve. Built once, reused every frame.

export interface Spiral {
  maxPoints: number
  xs: Int16Array
  ys: Int16Array
  /** primes[n] === 1 when n is prime (index 0 unused) */
  primes: Uint8Array
  /** every prime, ascending */
  primeList: Uint32Array
}

export const MIN_POINTS = 441 // 21x21
export const MAX_POINTS = 401 * 401 // 160,801

export function buildSpiral(maxPoints: number): Spiral {
  const xs = new Int16Array(maxPoints)
  const ys = new Int16Array(maxPoints)

  // Walk the square spiral counter-clockwise: segment lengths 1,1,2,2,3,3...
  let x = 0
  let y = 0
  let dx = 1
  let dy = 0
  let len = 1
  let stepsInSeg = 0
  let turns = 0
  for (let n = 1; n <= maxPoints; n++) {
    xs[n - 1] = x
    ys[n - 1] = y
    x += dx
    y += dy
    if (++stepsInSeg === len) {
      stepsInSeg = 0
      // rotate direction 90deg: right -> up -> left -> down (screen y is down)
      const ndx = dy
      const ndy = -dx
      dx = ndx
      dy = ndy
      if (++turns % 2 === 0) len++
    }
  }

  const primes = new Uint8Array(maxPoints + 1)
  const isComposite = new Uint8Array(maxPoints + 1)
  const primeValues: number[] = []
  for (let n = 2; n <= maxPoints; n++) {
    if (isComposite[n]) continue
    primes[n] = 1
    primeValues.push(n)
    for (let m = n * n; m <= maxPoints; m += n) isComposite[m] = 1
  }

  return { maxPoints, xs, ys, primes, primeList: Uint32Array.from(primeValues) }
}

/** Number of primes <= n, via binary search over primeList. */
export function primeCountUpTo(spiral: Spiral, n: number): number {
  const list = spiral.primeList
  let lo = 0
  let hi = list.length
  while (lo < hi) {
    const mid = (lo + hi) >>> 1
    if (list[mid] <= n) lo = mid + 1
    else hi = mid
  }
  return lo
}
