import { media } from '@/lib/motion-tokens';

// Web Animations API instead of GSAP: keeps GSAP out of the first-load bundle.
const EXIT = 'cubic-bezier(0.55, 0.085, 0.68, 0.53)';
const BURST = 'cubic-bezier(0.16, 1, 0.3, 1)';
const GLIDE = 'cubic-bezier(0.215, 0.61, 0.355, 1)';

// Lets the intro in index.html finish (bar fills at 1.7s). Reduced motion has nothing to watch, so it leaves sooner.
const SPLASH_MIN_MS = 1900;
const SPLASH_MIN_REDUCED_MS = 600;

/** Fired when the wipe starts, so page entrances play as the panel lifts instead of underneath it. */
export const SPLASH_LEAVE_EVENT = 'queice:splash-leave';

/** True while the splash still covers the page. */
export function splashCovering() {
  const el = document.getElementById('splash');
  return Boolean(el && el.getAttribute('aria-hidden') !== 'true');
}

/**
 * Runs `start` once the splash begins leaving, or right away if it is already gone.
 * Returns a cleanup that cancels a pending start.
 */
export function afterSplash(start: () => void): () => void {
  if (!splashCovering()) {
    start();
    return () => {};
  }
  window.addEventListener(SPLASH_LEAVE_EVENT, start, { once: true });
  return () => window.removeEventListener(SPLASH_LEAVE_EVENT, start);
}

/** Wipes the static #splash from index.html off screen once its intro has played. Safe to call twice. */
export function dismissSplash() {
  const el = document.getElementById('splash');
  if (!el || el.dataset.leaving) return;
  el.dataset.leaving = 'true';

  const reduce = window.matchMedia(media.reduce).matches;
  const wait = Math.max(0, (reduce ? SPLASH_MIN_REDUCED_MS : SPLASH_MIN_MS) - performance.now());

  window.setTimeout(() => {
    el.setAttribute('aria-hidden', 'true');
    window.dispatchEvent(new Event(SPLASH_LEAVE_EVENT));

    if (reduce) {
      el.animate({ opacity: [1, 0] }, { duration: 200, easing: GLIDE, fill: 'forwards' }).finished.then(() => el.remove());
      return;
    }

    el.firstElementChild?.animate(
      { opacity: [1, 0], transform: ['none', 'translateY(-24px)'] },
      { duration: 240, easing: EXIT, fill: 'forwards' },
    );
    el.animate({ transform: ['none', 'translateY(-100%)'] }, { duration: 640, delay: 120, easing: BURST, fill: 'forwards' })
      .finished.then(() => el.remove());
  }, wait);
}
