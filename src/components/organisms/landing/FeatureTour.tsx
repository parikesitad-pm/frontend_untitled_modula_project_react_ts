import React, { useRef } from 'react';
import { Download } from 'lucide-react';
import { DecorQr } from '@/components/atoms/DecorQr';
import { SectionHeading } from '@/components/molecules/SectionHeading';
import { gsap, useGSAP, ease, media, stagger } from '@/lib/motion';
import { cn } from '@/lib/utils';

const Card: React.FC<{ title: string; body: string; className?: string; children: React.ReactNode }> = ({
  title,
  body,
  className,
  children,
}) => (
  <li data-scroll-reveal className={cn('flex flex-col gap-5 rounded-xl border border-line bg-surface p-6', className)}>
    <div className="flex-1">{children}</div>
    <div className="space-y-2">
      <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">{title}</h3>
      <p className="text-base leading-relaxed text-muted">{body}</p>
    </div>
  </li>
);

const modes = ['Quiz', 'Pretest', 'Posttest', 'Task', 'Survey', 'Form'];
const players = ['RA', 'BG', 'DW', 'YO', 'SR', 'AK', 'NT', 'FJ'];
const bars = [38, 62, 81, 47, 70];

const RING = 2 * Math.PI * 34;

export const FeatureTour: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // One timeline: each card's mini visual plays once when the board scrolls in.
  useGSAP(
    () => {
      gsap.matchMedia().add(media.motion, () => {
        gsap
          .timeline({
            defaults: { ease: ease.burst },
            scrollTrigger: { trigger: '[data-board]', start: 'top 70%', once: true },
          })
          .from('[data-mode]', { scale: 0.6, autoAlpha: 0, duration: 0.5, stagger: stagger.normal, ease: ease.spring })
          .from('[data-player]', { scale: 0, autoAlpha: 0, duration: 0.4, stagger: stagger.loose, ease: ease.spring }, 0.15)
          .from('[data-bar]', { scaleY: 0, duration: 0.8, stagger: stagger.normal }, 0.2)
          .from('[data-ring]', { strokeDashoffset: RING, duration: 1.2, ease: 'power2.inOut' }, 0.2)
          .from('[data-code-line]', { x: -12, autoAlpha: 0, duration: 0.4, stagger: stagger.loose }, 0.3);
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="features" aria-labelledby="features-title" className="scroll-mt-20 border-b border-line">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          id="features-title"
          kicker="What's in the box"
          title="Everything a quiz night or an exam needs"
        />

        <ul data-board className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Six assessment types"
            body="Quizzes for fun, pretests and posttests for training, surveys and forms for feedback. Your dashboard sorts them by type."
          >
            <ul className="flex flex-wrap gap-2" aria-label="Assessment types">
              {modes.map((m) => (
                <li key={m} data-mode className="rounded-md border border-line-strong bg-canvas px-3 py-1.5 font-mono text-sm font-semibold text-ink">
                  {m}
                </li>
              ))}
            </ul>
          </Card>

          <Card
            title="Questions that hold code"
            body="Markdown in questions and answers, with code blocks that keep their formatting. Built for tech pretests too."
            className="lg:col-span-2"
          >
            <pre aria-hidden="true" className="m-0 overflow-hidden bg-canvas font-mono text-sm leading-6">
              <code>
                <span data-code-line className="block text-muted">{'// Which hook handles form actions?'}</span>
                <span data-code-line className="block"><span className="text-info">const</span> [state, action] =</span>
                <span data-code-line className="block pl-4"><span className="text-accent-text">useActionState</span>(submit, null);</span>
              </code>
            </pre>
          </Card>

          <Card
            title="Live lobby + QR join"
            body="Show the lobby on a projector. Players scan, type a name, and appear on screen as they join."
          >
            <div aria-hidden="true" className="flex items-center gap-5">
              <DecorQr className="size-24" />
              <div className="flex flex-wrap gap-1.5">
                {players.map((p) => (
                  <span key={p} data-player className="grid size-9 place-items-center rounded-full bg-raised font-mono text-xs font-bold text-ink">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          <Card
            title="Timers that keep pace"
            body="One clock for the whole activity. It keeps running between questions and submits automatically at zero."
          >
            <div aria-hidden="true" className="flex items-center gap-5">
              <svg viewBox="0 0 80 80" className="size-24 -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="var(--line)" strokeWidth="8" />
                <circle
                  data-ring
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={RING}
                  strokeDashoffset={RING * 0.3}
                />
              </svg>
              <span className="font-display text-5xl font-extrabold tabular-nums text-ink">1:30</span>
            </div>
          </Card>

          <Card
            title="Stats you can take with you"
            body="Score spread, time per player, and the pretest → posttest gain. Export everything to CSV."
          >
            <div aria-hidden="true" className="flex items-end gap-4">
              <div className="flex h-24 flex-1 items-end gap-2">
                {bars.map((h, i) => (
                  <span
                    key={i}
                    data-bar
                    style={{ height: `${h}%` }}
                    className={cn('flex-1 origin-bottom rounded-t', i === 2 ? 'bg-accent' : 'bg-line-strong')}
                  />
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line-strong px-3 py-1.5 font-mono text-sm text-ink">
                <Download className="size-4" /> CSV
              </span>
            </div>
          </Card>
        </ul>
      </div>
    </section>
  );
};
