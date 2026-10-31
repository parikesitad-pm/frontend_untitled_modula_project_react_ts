import React from 'react';

interface SectionHeadingProps {
  /** Short broadcast-style label above the title, e.g. "Run of show". */
  kicker: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  /** id for the h2, so the section can point aria-labelledby at it. */
  id?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ kicker, title, intro, id }) => (
  <div data-scroll-reveal className="max-w-2xl space-y-4">
    <p className="flex items-center gap-3 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-accent-text">
      <span aria-hidden="true" className="h-1 w-6 rounded-full bg-accent" />
      {kicker}
    </p>
    <h2 id={id} className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl">
      {title}
    </h2>
    {intro && <p className="text-base leading-relaxed text-muted sm:text-lg">{intro}</p>}
  </div>
);
