import React, { useRef, useState } from 'react';
import { gsap, useGSAP, media } from '@/lib/motion';
import { cn } from '@/lib/utils';

const format = (n: number) => Math.round(n).toLocaleString('en-US');

interface RollingNumberProps {
  value: number;
  /** Seconds the roll takes. */
  duration?: number;
  className?: string;
}

/** Counts from the previous value to the new one instead of jumping. Tabular figures keep the width steady. */
export const RollingNumber: React.FC<RollingNumberProps> = ({ value, duration = 0.9, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  // React renders the first value only; GSAP owns the text after that, so React never flashes the final number.
  const [initial] = useState(() => format(value));

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || shown.current === value) return;
      const counter = { v: shown.current };
      const write = () => {
        shown.current = counter.v;
        el.textContent = format(counter.v);
      };

      const mm = gsap.matchMedia();
      mm.add(media.reduce, () => {
        counter.v = value;
        write();
      });
      mm.add(media.motion, () => {
        gsap.to(counter, { v: value, duration, ease: 'power3.out', onUpdate: write });
      });
    },
    { dependencies: [value] },
  );

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {initial}
    </span>
  );
};
