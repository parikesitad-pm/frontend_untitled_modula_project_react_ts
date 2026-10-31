import React from 'react';
import { Plus } from 'lucide-react';
import { SectionHeading } from '@/components/molecules/SectionHeading';

// Free-tier defaults from PLAN.md Phase 2. Update here when the load test settles the final numbers.
const limits = [
  { value: '30', label: 'players per live session' },
  { value: '3', label: 'active assessments' },
  { value: '10', label: 'questions per assessment' },
  { value: '7', label: 'days before results are deleted' },
];

const faqs = [
  {
    q: 'Do players need an account?',
    a: 'No. Players open the link or scan the QR code, type a name, and play. Only the host signs in.',
  },
  {
    q: 'Can I use the same questions for a class and a formal exam?',
    a: 'Yes. Presentation mode is a setting on the assessment. Switch between formal and playful without rebuilding anything.',
  },
  {
    q: 'What happens after 7 days?',
    a: 'Finished sessions, answers, and scores are deleted from the free demo. Export to CSV from the stats page first if you need to keep them.',
  },
  {
    q: 'Can questions include code?',
    a: 'Yes. Questions and answers support Markdown, including code blocks that keep their formatting.',
  },
  {
    q: 'Does it work on phones?',
    a: 'Players play from any phone browser, nothing to install. Building assessments is easier on a laptop or tablet.',
  },
  {
    q: 'Is there a paid plan?',
    a: 'Not yet. The demo is free within the limits above.',
  },
];

export const DemoFaq: React.FC = () => (
  <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 bg-surface">
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-20 sm:px-6 sm:py-28">
      {/* Lower-third style notice */}
      <div data-scroll-reveal className="overflow-hidden rounded-xl border border-line bg-canvas">
        <div className="flex flex-col gap-2 border-l-8 border-accent px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">Free demo</p>
          <p className="text-base text-muted">Sign up and use it free. These limits keep it free for everyone.</p>
        </div>
        <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {limits.map((l, i) => (
            <div
              key={l.label}
              className={`flex flex-col-reverse justify-end gap-1 px-6 py-5 ${i % 2 ? 'border-l border-line' : ''} ${i > 1 ? 'border-t border-line lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}
            >
              <dt className="text-sm text-muted">{l.label}</dt>
              <dd className="font-display text-5xl font-extrabold tabular-nums leading-none text-ink">{l.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        <SectionHeading id="faq-title" kicker="FAQ" title="Questions before you start" />

        <div data-scroll-reveal className="divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus
                  aria-hidden="true"
                  className="size-5 shrink-0 text-accent-text transition-transform duration-200 ease-glide group-open:rotate-45"
                />
              </summary>
              <p className="animate-fade-in pb-5 pr-9 text-base leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  </section>
);
