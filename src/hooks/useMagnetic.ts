import type { RefObject } from 'react';
import { gsap, useGSAP, media } from '@/lib/motion';

/** Pulls an element a little toward the cursor while hovered. Mouse and trackpad only; touch never sees it. */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.3) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      gsap.matchMedia().add(`${media.motion} and (hover: hover) and (pointer: fine)`, () => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

        const move = (e: PointerEvent) => {
          // Subtract the current offset so the moving element doesn't chase its own rect.
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2 - Number(gsap.getProperty(el, 'x'));
          const cy = r.top + r.height / 2 - Number(gsap.getProperty(el, 'y'));
          xTo((e.clientX - cx) * strength);
          yTo((e.clientY - cy) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        return () => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        };
      });
    },
    { scope: ref },
  );
}
