import type { RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP, ease, media, stagger } from '@/lib/motion';

/**
 * Reveals [data-scroll-reveal] elements inside `scope` as they scroll into view, once.
 * Elements entering together are batched into one stagger.
 */
export function useScrollReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      gsap.matchMedia().add(media.motion, () => {
        const items = gsap.utils.toArray<HTMLElement>('[data-scroll-reveal]');
        if (!items.length) return;

        gsap.set(items, { autoAlpha: 0, y: 32 });
        ScrollTrigger.batch(items, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: ease.burst,
              stagger: stagger.loose,
              overwrite: true,
              clearProps: 'transform,opacity,visibility',
            }),
        });
      });
    },
    { scope },
  );
}
