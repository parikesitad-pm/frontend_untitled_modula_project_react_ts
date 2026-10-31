import React, { useRef } from 'react';
import { SectionHeading } from '@/components/molecules/SectionHeading';
import { gsap, useGSAP, media } from '@/lib/motion';

const steps = [
  {
    title: 'Build',
    body: 'Stack question blocks in any order. Set points, mark the right answers, add a timer if you want one. Questions and answers can hold Markdown and code.',
    details: ['Single choice', 'Multiple choice', 'Scale', 'Short text', 'Sections', 'Images'],
  },
  {
    title: 'Share',
    body: 'Every assessment gets its own link. Running a room? Open the live lobby on the big screen and players join by scanning the QR code. No player accounts.',
    details: ['Link', 'QR code', 'Live lobby'],
  },
  {
    title: 'Play & review',
    body: 'Players answer on their own phones. The leaderboard ranks the room, and the stats page breaks down every question and every player.',
    details: ['Leaderboard', 'Per-question stats', 'CSV export'],
  },
];

export const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // The amber rail draws across the steps as the section scrolls through.
  useGSAP(
    () => {
      gsap.matchMedia().add(media.motion, () => {
        gsap.fromTo(
          '[data-rail]',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', end: 'bottom 70%', scrub: 0.6 },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="how-it-works" aria-labelledby="how-it-works-title" className="scroll-mt-20 border-b border-line">
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          id="how-it-works-title"
          kicker="Run of show"
          title="Three steps from blank page to podium"
        />

        <ol className="relative grid gap-12 lg:grid-cols-3 lg:gap-8">
          <span aria-hidden="true" className="absolute left-0 right-0 top-10 hidden h-px bg-line lg:block" />
          <span aria-hidden="true" data-rail className="absolute left-0 right-0 top-10 hidden h-0.5 origin-left bg-accent lg:block" />

          {steps.map((step, i) => (
            <li key={step.title} data-scroll-reveal className="relative space-y-4">
              <span
                aria-hidden="true"
                className="relative inline-block bg-canvas pr-4 font-display text-8xl font-extrabold leading-none text-transparent [-webkit-text-stroke:2px_var(--line-strong)]"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="max-w-md text-base leading-relaxed text-muted">{step.body}</p>
              <ul className="flex flex-wrap gap-2" aria-label={`${step.title} includes`}>
                {step.details.map((d) => (
                  <li key={d} className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink-soft">
                    {d}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
