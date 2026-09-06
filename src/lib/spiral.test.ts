import { describe, expect, test } from 'vitest'

import { buildSpiral, primeCountUpTo } from './spiral'

describe('buildSpiral', () => {
  test('walks outward without skipping cells', () => {
    const spiral = buildSpiral(9)

    expect(Array.from(spiral.xs)).toEqual([0, 1, 1, 0, -1, -1, -1, 0, 1])
    expect(Array.from(spiral.ys)).toEqual([0, 0, -1, -1, -1, 0, 1, 1, 1])
  })

  test('marks primes and counts them through a boundary', () => {
    const spiral = buildSpiral(25)

    expect(Array.from(spiral.primeList)).toEqual([
      2, 3, 5, 7, 11, 13, 17, 19, 23,
    ])
    expect(primeCountUpTo(spiral, 18)).toBe(7)
    expect(primeCountUpTo(spiral, 19)).toBe(8)
  })
})
