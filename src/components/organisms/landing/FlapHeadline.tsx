import React, { useRef } from 'react';
import { gsap, SplitText, useGSAP, media } from '@/lib/motion';
import { afterSplash } from '@/lib/splash';

const RIPPLE_REACH = 2;

/**
 * Headline that flips in letter by letter like a stadium split-flap board,
 * and ripples under the cursor afterwards. Plain text when motion is reduced.
 */
export const FlapHeadline: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      gsap.matchMedia().add(media.motion, () => {
        // aria: 'auto' keeps the heading readable as one string for screen readers.
        const split = SplitText.create(el, { type: 'words,chars', aria: 'auto' });
        const chars = split.chars as HTMLElement[];
        gsap.set(chars, { transformPerspective: 700, transformOrigin: '50% 50% -0.3em' });

        const intro = gsap.from(chars, {
          rotateX: -110,
          y: '0.2em',
          autoAlpha: 0,
          duration: 0.9,
          ease: 'back.out(1.7)',
          stagger: 0.028,
          paused: true,
        });
        const cancelIntro = afterSplash(() => intro.play());

        // Flip the hovered letter and its neighbours, the nearest first.
        const ripple = (e: PointerEvent) => {
          if (intro.isActive()) return;
          const hit = (e.target as HTMLElement).closest('div, span');
          const i = hit ? chars.indexOf(hit as HTMLElement) : -1;
          if (i < 0) return;
          for (let d = -RIPPLE_REACH; d <= RIPPLE_REACH; d++) {
            const c = chars[i + d];
            if (!c || gsap.isTweening(c)) continue;
            gsap.fromTo(c, { rotateX: 0 }, { rotateX: 360, duration: 0.7, delay: Math.abs(d) * 0.05, ease: 'power3.out' });
          }
        };
        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (canHover) el.addEventListener('pointerover', ripple);

        return () => {
          cancelIntro();
          if (canHover) el.removeEventListener('pointerover', ripple);
          split.revert();
        };
      });
    },
    { scope: ref },
  );

  return (
    <h1 ref={ref} className={className}>
      {children}
    </h1>
  );
};
