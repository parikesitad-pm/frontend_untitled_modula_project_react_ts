import type { RefObject } from 'react';
import { gsap, useGSAP, media, register, stagger, type MotionRegister } from '@/lib/motion';
import { afterSplash } from '@/lib/splash';

// Long lists still finish entering within ~1s.
const MAX_STAGGER_TOTAL = 0.5;

/** Elements marked [data-reveal], else the first level under the scope that has more than one child. */
function revealTargets(root: HTMLElement): Element[] {
  const marked = root.querySelectorAll('[data-reveal]');
  if (marked.length) return Array.from(marked);

  let level: Element = root;
  for (let depth = 0; depth < 3 && level.children.length === 1; depth++) {
    level = level.children[0];
  }
  return Array.from(level.children);
}

/**
 * Staggered page entrance. Replays when any value in `deps` changes
 * (e.g. the question number on the play page, which reuses the component).
 */
export function usePageReveal(
  scope: RefObject<HTMLElement | null>,
  mode: MotionRegister = 'formal',
  deps: unknown[] = [],
  /** Extra seconds to wait after the splash, e.g. to let a headline intro land first. */
  delay = 0,
) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const targets = revealTargets(root);
      if (!targets.length) return;

      const { enter, travel } = register[mode];
      const each = Math.min(mode === 'playful' ? stagger.loose : stagger.normal, MAX_STAGGER_TOTAL / targets.length);

      // Reduced motion: no tween at all, content is visible as rendered.
      gsap.matchMedia().add(media.motion, () => {
        const tween = gsap.from(targets, {
          y: travel,
          autoAlpha: 0,
          duration: 0.6,
          ease: enter,
          stagger: each,
          paused: true,
          clearProps: 'transform,opacity,visibility',
        });
        // Slight delay so the first element rises into space the splash wipe has just uncovered.
        return afterSplash(() => tween.delay(0.15 + delay).play());
      });
    },
    { scope, dependencies: [mode, delay, ...deps], revertOnUpdate: true },
  );
}
