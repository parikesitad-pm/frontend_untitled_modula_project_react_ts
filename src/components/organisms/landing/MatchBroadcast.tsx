import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { DecorQr } from '@/components/atoms/DecorQr';
import { SectionHeading } from '@/components/molecules/SectionHeading';
import { PodiumFlat } from '@/components/organisms/landing/PodiumFlat';
import type { PodiumHandle } from '@/components/three/PodiumScene';
import { gsap, useGSAP, ease, media } from '@/lib/motion';
import { cn } from '@/lib/utils';

const PodiumScene = lazy(() => import('@/components/three/PodiumScene'));

const PINNED = `(min-width: 1024px) and ${media.motion}`;

const steps = [
  { title: 'Lobby', body: 'Players scan the QR and pop onto the big screen.' },
  { title: 'Answers', body: 'After the clock, the room sees how everyone voted.' },
  { title: 'Leaderboard', body: 'Ranks reshuffle after every question.' },
  { title: 'Podium', body: 'Top three take the stage at the final whistle.' },
];

const players = ['RA', 'BG', 'DW', 'YO', 'SR', 'AK', 'NT', 'FJ', 'LM', 'TW', 'IK', 'PU', 'ES', 'HN', 'VO', 'GA'];
const PLAYER_COUNT = 42;

const votes = [
  { shape: '▲', label: 'Venus', pct: 12, tone: 'bg-play-1' },
  { shape: '◆', label: 'Mars', pct: 64, tone: 'bg-play-2', correct: true },
  { shape: '●', label: 'Jupiter', pct: 9, tone: 'bg-play-3' },
  { shape: '■', label: 'Mercury', pct: 15, tone: 'bg-play-4' },
];

// Final standings, top to bottom, and where each player sat before this question.
const standings = [
  { name: 'Rina', score: 2840, was: 2 },
  { name: 'Bagus', score: 2710, was: 0 },
  { name: 'Dewi', score: 2655, was: 3 },
  { name: 'Yoga', score: 2390, was: 1 },
  { name: 'Sari', score: 2120, was: 4 },
];

const scene = 'rounded-xl border border-line bg-canvas p-5 group-data-pinned:absolute group-data-pinned:inset-0 group-data-pinned:rounded-none group-data-pinned:border-0 group-data-pinned:p-8';

export const MatchBroadcast: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const handle = useRef<PodiumHandle>({ progress: { current: 0 }, invalidate: { current: null } }).current;
  const [pinned, setPinned] = useState(false);
  const [load3D, setLoad3D] = useState(false);
  const [ready3D, setReady3D] = useState(false);

  // Fetch the 3D chunk only for the pinned layout, with WebGL, once the section is on screen and the
  // main thread is idle. The podium is the last of four scenes, so it has several screens of scroll to load,
  // and parsing three.js any earlier lands on the hero intro's frames.
  useEffect(() => {
    if (!pinned || !('WebGL2RenderingContext' in window) || !sectionRef.current) return;
    let idle = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setLoad3D(true), { timeout: 1500 })
        : window.setTimeout(() => setLoad3D(true), 200);
    });
    io.observe(sectionRef.current);
    return () => {
      io.disconnect();
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [pinned]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(PINNED, () => {
        const section = sectionRef.current!;
        section.toggleAttribute('data-pinned', true);
        setPinned(true);

        const scenes = gsap.utils.toArray<HTMLElement>('[data-scene]');
        const stepEls = gsap.utils.toArray<HTMLElement>('[data-step]');
        const count = { v: 0 };
        const countEl = section.querySelector<HTMLElement>('[data-count]');
        if (countEl) countEl.textContent = '0';
        gsap.set(scenes.slice(1), { autoAlpha: 0 });
        gsap.set(stepEls.slice(1), { opacity: 0.35 });

        const swap = (tl: gsap.core.Timeline, from: number, at: number) => {
          tl.to(scenes[from], { autoAlpha: 0, y: -24, duration: 0.3, ease: ease.exit }, at)
            .fromTo(scenes[from + 1], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: ease.glide }, at + 0.15)
            .to(stepEls[from], { opacity: 0.35, duration: 0.2 }, at)
            .to(stepEls[from + 1], { opacity: 1, duration: 0.2 }, at + 0.15)
            .fromTo(`[data-step-bar="${from + 1}"]`, { scaleX: 0 }, { scaleX: 1, duration: 0.3 }, at + 0.15);
        };

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            pin: pinRef.current,
            start: 'top top',
            end: '+=320%',
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1. Lobby fills
        tl.fromTo('[data-step-bar="0"]', { scaleX: 0 }, { scaleX: 1, duration: 0.3 }, 0)
          .from('[data-player]', { scale: 0, autoAlpha: 0, duration: 0.5, stagger: 0.04, ease: ease.spring }, 0.05)
          .to(count, { v: PLAYER_COUNT, duration: 0.8, onUpdate: () => { if (countEl) countEl.textContent = String(Math.round(count.v)); } }, 0.05);
        // 2. Votes
        swap(tl, 0, 1.0);
        tl.from('[data-vote]', { scaleX: 0, duration: 0.5, stagger: 0.05, ease: ease.glide }, 1.4)
          .from('[data-vote-correct]', { autoAlpha: 0, x: -8, duration: 0.2 }, 1.9);
        // 3. Leaderboard reshuffle: rows start where they sat before the question.
        swap(tl, 1, 2.3);
        gsap.utils.toArray<HTMLElement>('[data-standing]').forEach((row, i) => {
          tl.from(row, { yPercent: (standings[i].was - i) * 118, duration: 0.6, ease: ease.glide }, 2.7);
        });
        // 4. Podium rises
        swap(tl, 2, 3.6);
        const podium = { p: 0 };
        tl.to(podium, {
          p: 1,
          duration: 1.1,
          onUpdate: () => {
            handle.progress.current = podium.p;
            handle.invalidate.current?.();
          },
        }, 3.9)
          .from('[data-podium-block]', { scaleY: 0, duration: 0.5, stagger: 0.12, ease: ease.spring }, 3.9);

        return () => {
          section.removeAttribute('data-pinned');
          setPinned(false);
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="broadcast" aria-labelledby="broadcast-title" className="group relative border-b border-line">
      <div ref={pinRef} className="mx-auto flex max-w-7xl flex-col justify-center gap-10 px-4 py-20 sm:px-6 sm:py-28 group-data-pinned:h-screen group-data-pinned:py-10">
        <div className="grid items-center gap-10 group-data-pinned:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <div className="space-y-8">
            <SectionHeading
              id="broadcast-title"
              kicker="On the big screen"
              title="One round, as the room sees it"
              intro="Scroll through a live session from the host's projector."
            />
            <ol className="grid gap-4 sm:grid-cols-2 group-data-pinned:grid-cols-1">
              {steps.map((s, i) => (
                <li key={s.title} data-step className="space-y-1.5">
                  <span aria-hidden="true" className="block h-0.5 w-full overflow-hidden bg-line">
                    <span data-step-bar={i} className="block h-full origin-left bg-accent" />
                  </span>
                  <p className="font-display text-xl font-extrabold uppercase tracking-tight text-ink">
                    <span className="mr-2 text-muted">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </p>
                  <p className="text-base text-muted">{s.body}</p>
                </li>
              ))}
            </ol>
            <a
              href="#how-it-works"
              className="hidden items-center gap-2 text-base font-semibold text-ink-soft underline decoration-line-strong underline-offset-4 hover:text-ink group-data-pinned:inline-flex"
            >
              Skip the replay <ArrowDown className="size-4" />
            </a>
          </div>

          {/* The projector */}
          <div className="grid gap-4 sm:grid-cols-2 group-data-pinned:relative group-data-pinned:block group-data-pinned:aspect-video group-data-pinned:overflow-hidden group-data-pinned:rounded-2xl group-data-pinned:border group-data-pinned:border-line-strong group-data-pinned:bg-canvas group-data-pinned:shadow-2xl">
            <div data-scene className={cn(scene, 'flex items-center gap-6')}>
              <DecorQr className="size-28 group-data-pinned:size-40" />
              <div className="space-y-3">
                <p className="font-display text-3xl font-extrabold uppercase leading-none text-ink">
                  <span data-count className="tabular-nums">{PLAYER_COUNT}</span> in the lobby
                </p>
                <div aria-hidden="true" className="flex flex-wrap gap-1.5">
                  {players.map((p) => (
                    <span key={p} data-player className="grid size-9 place-items-center rounded-full bg-raised font-mono text-xs font-bold text-ink">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div data-scene className={cn(scene, 'flex flex-col justify-center gap-4')}>
              <p className="font-display text-2xl font-extrabold uppercase leading-tight text-ink group-data-pinned:text-3xl">
                Which planet is known as the Red Planet?
              </p>
              <ul className="space-y-2.5">
                {votes.map((v) => (
                  <li key={v.label} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-base font-semibold text-ink">
                      <span aria-hidden="true" className="mr-1.5">{v.shape}</span>
                      {v.label}
                    </span>
                    <span className="h-7 flex-1 overflow-hidden rounded-md bg-raised">
                      <span data-vote className={cn('block h-full origin-left rounded-md', v.tone)} style={{ width: `${v.pct}%` }} />
                    </span>
                    <span className="w-12 text-right font-mono text-base tabular-nums text-ink">{v.pct}%</span>
                    <span className="w-16 text-sm font-bold text-success">
                      {v.correct && <span data-vote-correct>Correct</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div data-scene className={cn(scene, 'flex flex-col justify-center')}>
              <p className="mb-3 font-mono text-sm uppercase tracking-widest text-muted">Leaderboard · after Q 3</p>
              <ol className="space-y-2">
                {standings.map((r, i) => (
                  <li key={r.name} data-standing className={cn('flex items-center gap-3 rounded-md border-l-4 bg-surface px-4 py-2.5', i === 0 ? 'border-accent' : 'border-line')}>
                    <span className="w-6 font-display text-2xl font-extrabold text-muted">{i + 1}</span>
                    <span className="flex-1 text-base font-semibold text-ink">{r.name}</span>
                    <span className="font-mono text-base tabular-nums text-ink">{r.score.toLocaleString('en-US')}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div data-scene className={cn(scene, 'relative h-72 p-0 group-data-pinned:h-auto')}>
              <PodiumFlat className={cn('transition-opacity duration-300', ready3D && 'opacity-0')} />
              {load3D && (
                <div className="absolute inset-0">
                  <Suspense fallback={null}>
                    <PodiumScene handle={handle} />
                    <Ready3D onReady={() => setReady3D(true)} />
                  </Suspense>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Renders inside the same Suspense boundary, so its effect fires only once the 3D chunk has loaded.
const Ready3D: React.FC<{ onReady: () => void }> = ({ onReady }) => {
  useEffect(onReady, [onReady]);
  return null;
};
