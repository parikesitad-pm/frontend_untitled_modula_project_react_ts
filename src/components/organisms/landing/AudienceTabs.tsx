import React, { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { SectionHeading } from '@/components/molecules/SectionHeading';
import { gsap, useGSAP, media, register, stagger } from '@/lib/motion';
import { cn } from '@/lib/utils';

type AudienceId = 'classroom' | 'training' | 'event';

const QUESTION = 'Which planet is known as the Red Planet?';
const ANSWERS = ['Venus', 'Mars', 'Jupiter', 'Mercury'];

// Shape + letter on every tile so color is never the only cue.
const tiles = [
  { shape: '▲', tone: 'bg-play-1 text-on-play' },
  { shape: '◆', tone: 'bg-play-2 text-on-play' },
  { shape: '●', tone: 'bg-play-3 text-on-play-3' },
  { shape: '■', tone: 'bg-play-4 text-on-play' },
];

const audiences: { id: AudienceId; tab: string; title: string; body: string; points: string[] }[] = [
  {
    id: 'classroom',
    tab: 'Classrooms',
    title: 'Loud, bright, and on the clock',
    body: 'Big answer tiles with shapes and colors, a countdown, points and streaks. Students join from any phone with a link or QR code, no accounts.',
    points: ['Playful mode', 'Shapes + colors', 'Streaks'],
  },
  {
    id: 'training',
    tab: 'Training & HR',
    title: 'A quiet exam when it counts',
    body: 'One question at a time, no confetti, a timer you can switch off. Run a pretest before the training and a posttest after, then see the gain per person.',
    points: ['Formal mode', 'Pretest → posttest', 'CSV export'],
  },
  {
    id: 'event',
    tab: 'Live events',
    title: 'The whole room on one board',
    body: 'Put the lobby on the big screen, let the room scan in, and watch the leaderboard reshuffle after every question.',
    points: ['Live lobby', 'QR join', 'Leaderboard'],
  },
];

const ClassroomPreview: React.FC = () => (
  <div className="space-y-4">
    <div data-panel-item className="flex items-center justify-between font-mono text-sm">
      <span className="text-muted">Q 3 / 10</span>
      <span className="rounded-full bg-live/15 px-2.5 py-0.5 font-bold text-live">0:12</span>
    </div>
    <p data-panel-item className="text-center font-display text-2xl font-bold uppercase leading-tight text-ink sm:text-3xl">
      {QUESTION}
    </p>
    <div className="grid grid-cols-2 gap-2.5">
      {ANSWERS.map((a, i) => (
        <div
          key={a}
          data-panel-item
          className={cn('flex min-h-16 items-center gap-3 rounded-lg px-4 py-3 text-lg font-bold', tiles[i].tone)}
        >
          <span aria-hidden="true" className="text-xl">{tiles[i].shape}</span>
          <span>{a}</span>
        </div>
      ))}
    </div>
  </div>
);

const TrainingPreview: React.FC = () => (
  <div className="space-y-4">
    <div data-panel-item className="flex items-center justify-between border-b border-line pb-3 font-mono text-sm text-muted">
      <span>Pretest · Question 3 of 10</span>
      <span>No time limit</span>
    </div>
    <p data-panel-item className="text-lg font-semibold text-ink">{QUESTION}</p>
    <div className="space-y-2" role="presentation">
      {ANSWERS.map((a, i) => (
        <div
          key={a}
          data-panel-item
          className={cn(
            'flex items-center gap-3 rounded-md border px-4 py-3 text-base',
            i === 1 ? 'border-accent bg-accent-tint text-ink' : 'border-line bg-canvas text-ink-soft',
          )}
        >
          <span
            aria-hidden="true"
            className={cn('grid size-4 place-items-center rounded-full border-2', i === 1 ? 'border-accent-text' : 'border-line-strong')}
          >
            {i === 1 && <span className="size-1.5 rounded-full bg-accent-text" />}
          </span>
          {a}
        </div>
      ))}
    </div>
    <p data-panel-item className="font-mono text-sm text-muted">
      Team average: pretest <span className="text-ink">54%</span> → posttest <span className="font-bold text-success">81%</span>
    </p>
  </div>
);

const board = [
  { name: 'Rina', score: 2840, move: 'up' },
  { name: 'Bagus', score: 2710, move: 'down' },
  { name: 'Dewi', score: 2655, move: 'up' },
  { name: 'Yoga', score: 2390, move: 'same' },
  { name: 'Sari', score: 2120, move: 'down' },
] as const;

const moveIcon = {
  up: <ArrowUp className="size-4 text-success" aria-label="moved up" />,
  down: <ArrowDown className="size-4 text-live" aria-label="moved down" />,
  same: <Minus className="size-4 text-muted" aria-label="no change" />,
};

const EventPreview: React.FC = () => (
  <div className="space-y-3">
    <div data-panel-item className="flex items-center justify-between font-mono text-sm">
      <span className="flex items-center gap-2 font-bold uppercase tracking-widest text-live">
        <span aria-hidden="true" className="size-2 rounded-full bg-live" />
        Live
      </span>
      <span className="text-muted">After Q 3 · 42 players</span>
    </div>
    <ol className="space-y-1.5">
      {board.map((row, i) => (
        <li
          key={row.name}
          data-panel-item
          className={cn(
            'flex items-center gap-3 rounded-md border-l-4 bg-canvas px-4 py-2.5',
            i === 0 ? 'border-accent' : 'border-line',
          )}
        >
          <span className="w-6 font-display text-2xl font-extrabold text-muted">{i + 1}</span>
          <span className="flex-1 text-base font-semibold text-ink">{row.name}</span>
          <span className="font-mono text-base tabular-nums text-ink">{row.score.toLocaleString('en-US')}</span>
          {moveIcon[row.move]}
        </li>
      ))}
    </ol>
  </div>
);

const previews: Record<AudienceId, React.FC> = {
  classroom: ClassroomPreview,
  training: TrainingPreview,
  event: EventPreview,
};

export const AudienceTabs: React.FC = () => {
  const [active, setActive] = useState<AudienceId>('classroom');
  const tabRefs = useRef<Record<AudienceId, HTMLButtonElement | null>>({ classroom: null, training: null, event: null });
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Panel content cascades in on every tab change; a fast second click restarts from the current state.
  useGSAP(
    () => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      gsap.matchMedia().add(media.motion, () => {
        const mode = active === 'training' ? register.formal : register.playful;
        gsap.from('[data-panel-item]', {
          y: mode.travel / 2,
          autoAlpha: 0,
          duration: 0.45,
          ease: mode.enter,
          stagger: stagger.tight,
          overwrite: true,
          clearProps: 'transform,opacity,visibility',
        });
      });
    },
    { scope: panelRef, dependencies: [active], revertOnUpdate: true },
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    const ids = audiences.map((a) => a.id);
    const i = ids.indexOf(active);
    const next =
      e.key === 'ArrowRight' ? ids[(i + 1) % ids.length]
      : e.key === 'ArrowLeft' ? ids[(i - 1 + ids.length) % ids.length]
      : e.key === 'Home' ? ids[0]
      : e.key === 'End' ? ids[ids.length - 1]
      : null;
    if (!next) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const current = audiences.find((a) => a.id === active)!;
  const Preview = previews[active];

  return (
    <section id="who-its-for" aria-labelledby="who-its-for-title" className="scroll-mt-20 border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          id="who-its-for-title"
          kicker="Who it's for"
          title="Same questions, three rooms"
          intro="Presentation mode is a setting, not a rebuild. Write the questions once and run them as a game for a class, a calm exam for a team, or a show for a crowd."
        />

        <div data-scroll-reveal className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
          <div className="space-y-6">
            <div role="tablist" aria-label="Audiences" onKeyDown={onKeyDown} className="flex flex-wrap gap-2">
              {audiences.map((a) => {
                const selected = a.id === active;
                return (
                  <button
                    key={a.id}
                    ref={(el) => { tabRefs.current[a.id] = el; }}
                    id={`audience-tab-${a.id}`}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls="audience-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(a.id)}
                    className={cn(
                      'h-11 rounded-full border px-5 text-base font-semibold transition-[background-color,color,border-color,transform] duration-150 ease-press active:scale-[0.97]',
                      selected ? 'border-accent bg-accent text-on-accent' : 'border-line-strong text-ink-soft hover:bg-raised hover:text-ink',
                    )}
                  >
                    {a.tab}
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-3xl font-extrabold uppercase leading-none tracking-tight text-ink">{current.title}</h3>
              <p className="text-base leading-relaxed text-muted sm:text-lg">{current.body}</p>
              <ul className="flex flex-wrap gap-2">
                {current.points.map((p) => (
                  <li key={p} className="rounded-full border border-line bg-canvas px-3 py-1 text-sm text-ink-soft">{p}</li>
                ))}
              </ul>
            </div>
          </div>

          <div
            ref={panelRef}
            id="audience-panel"
            role="tabpanel"
            aria-labelledby={`audience-tab-${active}`}
            tabIndex={0}
            className="rounded-xl border border-line bg-raised p-5 shadow-sm sm:p-6"
          >
            <Preview />
          </div>
        </div>
      </div>
    </section>
  );
};
