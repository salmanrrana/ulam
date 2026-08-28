// Live counters shared between the canvas render loop and HUD elements.
// The canvas loop writes; HUD components poll in their own rAF.

export const hud = {
  points: 0,
  primes: 0,
}
