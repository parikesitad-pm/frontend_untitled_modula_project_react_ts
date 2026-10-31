// GSAP-free motion tokens, so code on the first-load path can read them without pulling in GSAP.
// Eases mirror the --ease-* tokens in index.css so CSS transitions and GSAP tweens feel the same.
export const ease = {
  press: 'power1.out',
  glide: 'power3.out',
  exit: 'power2.in',
  burst: 'expo.out',
  spring: 'back.out(1.6)',
} as const;

// Seconds. Exits run ~25% faster than the matching entrance.
export const duration = {
  press: 0.12,
  small: 0.2,
  panel: 0.32,
  hero: 0.8,
} as const;

export const stagger = {
  tight: 0.03,
  normal: 0.05,
  loose: 0.08,
} as const;

export const media = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
} as const;

/**
 * Motion register follows the assessment's presentation mode.
 * playful: overshoot and bigger travel (kids, live arenas).
 * formal: no overshoot, short travel (pretests, enterprise).
 */
export type MotionRegister = 'formal' | 'playful';

export const register = {
  formal: { enter: ease.glide, travel: 8, pop: 1 },
  playful: { enter: ease.spring, travel: 24, pop: 1.06 },
} as const satisfies Record<MotionRegister, { enter: string; travel: number; pop: number }>;
