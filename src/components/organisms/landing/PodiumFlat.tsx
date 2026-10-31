import React from 'react';
import { podiumPlaces } from '@/data/podium';
import { cn } from '@/lib/utils';

// Visual order on the podium: 2nd, 1st, 3rd.
const order = [2, 1, 3].map((r) => podiumPlaces.find((p) => p.rank === r)!);
const tallest = Math.max(...podiumPlaces.map((p) => p.height));

/** DOM podium: the fallback for no WebGL, reduced motion, and narrow screens. Blocks carry [data-podium-block] for scroll tweens. */
export const PodiumFlat: React.FC<{ className?: string }> = ({ className }) => (
  <ol className={cn('flex h-full items-end justify-center gap-3 px-4 pb-4 pt-10', className)}>
    {order.map((p) => (
      <li key={p.rank} className="flex w-1/4 max-w-32 flex-col items-center gap-2" style={{ height: `${(p.height / tallest) * 100}%` }}>
        <span className="font-display text-xl font-extrabold uppercase text-ink">{p.name}</span>
        <span
          data-podium-block
          className="grid w-full flex-1 origin-bottom place-items-start justify-center rounded-t-lg pt-2 font-display text-4xl font-extrabold text-[#0B0D10]"
          style={{ backgroundColor: p.color }}
        >
          <span>
            <span className="sr-only">Place </span>
            {p.rank}
          </span>
        </span>
        <span className="sr-only">{p.score} points</span>
      </li>
    ))}
  </ol>
);
