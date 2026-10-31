import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, RotateCcw } from 'lucide-react';
import { RollingNumber } from '@/components/atoms/RollingNumber';
import { buttonClasses } from '@/components/atoms/buttonClasses';
import { useMagnetic } from '@/hooks/useMagnetic';
import { gsap, Flip, useGSAP, ease, media, stagger } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Phase = 'idle' | 'countdown' | 'question' | 'locked' | 'revealed' | 'final';

const SECONDS = 10;
const SUSPENSE_MS = 650;

const questions = [
  { text: 'Which ocean is the largest?', answers: ['Atlantic', 'Pacific', 'Indian', 'Arctic'], correct: 1 },
  { text: 'How many sides does a hexagon have?', answers: ['4', '8', '6', '5'], correct: 2 },
  { text: 'Which gas do plants take in from the air?', answers: ['Oxygen', 'Helium', 'Nitrogen', 'Carbon dioxide'], correct: 3 },
];

// Shape + letter on every tile so color is never the only cue.
const tiles = [
  { shape: '▲', key: 'A', tone: 'bg-play-1 text-on-play' },
  { shape: '◆', key: 'B', tone: 'bg-play-2 text-on-play' },
  { shape: '●', key: 'C', tone: 'bg-play-3 text-on-play-3' },
  { shape: '■', key: 'D', tone: 'bg-play-4 text-on-play' },
];

// Points the bots earn per question: Bagus leads early, Rina wins if you don't.
const bots = [
  { name: 'Rina', gains: [820, 760, 770] },
  { name: 'Bagus', gains: [910, 0, 890] },
  { name: 'Dewi', gains: [640, 700, 0] },
];

const RING = 2 * Math.PI * 20;
const pointsFor = (secondsLeft: number) => 500 + Math.round((500 * secondsLeft) / SECONDS);

export const KickoffRound: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const kickoffRef = useRef<HTMLButtonElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const secondsRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<gsap.core.Tween | null>(null);
  const timeLeft = useRef(SECONDS);
  const flipState = useRef<Flip.FlipState | null>(null);

  const [phase, setPhase] = useState<Phase>('idle');
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [gain, setGain] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [announce, setAnnounce] = useState('');

  useMagnetic(kickoffRef, 0.25);

  const q = questions[qIndex];
  const board = [
    { name: 'You', score: myScore, you: true },
    ...bots.map((b) => ({ name: b.name, score: b.gains.slice(0, revealed).reduce((a, n) => a + n, 0), you: false })),
  ].sort((a, b) => b.score - a.score || (a.you ? -1 : 1));
  const myRank = board.findIndex((r) => r.you) + 1;

  const { contextSafe } = useGSAP({ scope: rootRef });
  const reduced = () => window.matchMedia(media.reduce).matches;

  const drawTimer = (t: number) => {
    timeLeft.current = t;
    ringRef.current?.setAttribute('stroke-dashoffset', String(RING * (1 - t / SECONDS)));
    if (secondsRef.current) secondsRef.current.textContent = String(Math.ceil(t));
    rootRef.current?.toggleAttribute('data-urgent', t <= 3 && t > 0);
  };

  const reveal = (choice: number | null) => {
    const left = choice === null ? 0 : timeLeft.current;
    const right = choice === q.correct;
    const points = right ? pointsFor(left) : 0;
    // Snapshot rows before the scores change so Flip can animate the reshuffle.
    flipState.current = Flip.getState(rootRef.current!.querySelectorAll('[data-board-row]'));
    setGain(points);
    setMyScore((s) => s + points);
    setRevealed((r) => r + 1);
    setPhase('revealed');
    setAnnounce(
      choice === null
        ? `Time's up. The answer was ${q.answers[q.correct]}.`
        : right
          ? `Correct! Plus ${points} points.`
          : `Not quite. The answer was ${q.answers[q.correct]}.`,
    );
  };

  const startTimer = () => {
    timer.current?.kill();
    const t = { v: SECONDS };
    drawTimer(SECONDS);
    timer.current = gsap.to(t, {
      v: 0,
      duration: SECONDS,
      ease: 'none',
      onUpdate: () => drawTimer(t.v),
      onComplete: () => reveal(null),
    });
  };

  const startQuestion = () => {
    setPicked(null);
    setPhase('question');
    setAnnounce(`Question ${qIndex + 1}: ${questions[qIndex].text}`);
    startTimer();
  };

  const kickOff = () => {
    if (reduced()) {
      startQuestion();
      return;
    }
    setPhase('countdown');
  };

  // 3-2-1-GO runs once the countdown view has rendered its number element.
  useGSAP(
    () => {
      const el = countRef.current;
      if (phase !== 'countdown' || !el) return;
      const tl = gsap.timeline({ onComplete: startQuestion });
      ['3', '2', '1', 'GO'].forEach((n, i) => {
        tl.call(() => { el.textContent = n; }, undefined, i * 0.6)
          .fromTo(el, { scale: 1.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: ease.burst }, i * 0.6)
          .to(el, { scale: 0.7, autoAlpha: 0, duration: 0.25, ease: ease.exit }, i * 0.6 + 0.35);
      });
    },
    { scope: rootRef, dependencies: [phase === 'countdown'] },
  );

  const pick = (i: number) => {
    if (phase !== 'question') return;
    timer.current?.pause();
    setPicked(i);
    setPhase('locked');
    window.setTimeout(() => reveal(i), reduced() ? 0 : SUSPENSE_MS);
  };

  const next = contextSafe(() => {
    if (qIndex === questions.length - 1) {
      setPhase('final');
      setAnnounce(`Round over. You finished number ${myRank} with ${myScore} points.`);
      return;
    }
    const go = () => {
      setQIndex((n) => n + 1);
      setPicked(null);
      setPhase('question');
    };
    if (reduced()) return go();
    gsap.to('[data-tile]', { yPercent: 40, autoAlpha: 0, duration: 0.22, ease: ease.exit, stagger: stagger.tight, onComplete: go });
  });

  const replay = () => {
    timer.current?.kill();
    setQIndex(0);
    setMyScore(0);
    setRevealed(0);
    setGain(0);
    setPicked(null);
    setPhase('idle');
  };

  // A new question started: tiles spring in, then the clock runs.
  useGSAP(
    () => {
      if (phase !== 'question') return;
      if (qIndex > 0 && !timer.current?.isActive()) {
        setAnnounce(`Question ${qIndex + 1}: ${q.text}`);
        startTimer();
      }
      // The button that started this question has unmounted; keep keyboard users in the round.
      rootRef.current?.querySelector<HTMLButtonElement>('[data-tile]')?.focus({ preventScroll: true });
      gsap.matchMedia().add(media.motion, () => {
        gsap
          .timeline()
          .from('[data-question]', { y: 16, autoAlpha: 0, duration: 0.4, ease: ease.glide })
          .from('[data-tile]', { y: 28, scale: 0.9, autoAlpha: 0, duration: 0.5, ease: ease.spring, stagger: stagger.normal }, '-=0.2');
      });
    },
    { scope: rootRef, dependencies: [phase === 'question', qIndex] },
  );

  // The reveal: winner pops and bursts, a wrong pick shakes, the rest fall back, points float up.
  useGSAP(
    () => {
      if (phase !== 'revealed') return;
      gsap.matchMedia().add(media.motion, () => {
        const tl = gsap.timeline();
        tl.to('[data-tile]:not([data-correct])', { scale: 0.96, autoAlpha: 0.35, duration: 0.3, ease: ease.glide }, 0)
          .fromTo('[data-correct]', { scale: 1.12 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.45)' }, 0)
          .to('[data-wrong-pick]', { keyframes: { x: [-10, 10, -7, 7, -3, 0] }, duration: 0.45, ease: 'none' }, 0)
          .fromTo('[data-gain]', { y: 12, autoAlpha: 0 }, { y: -8, autoAlpha: 1, duration: 0.35, ease: ease.burst }, 0.1)
          .fromTo('[data-score]', { scale: 1.25 }, { scale: 1, duration: 0.5, ease: ease.spring }, 0.15);

        const bits = gsap.utils.toArray<HTMLElement>('[data-bit]');
        bits.forEach((b, i) => {
          const angle = (i / bits.length) * Math.PI * 2 + gsap.utils.random(-0.3, 0.3);
          const dist = gsap.utils.random(70, 140);
          tl.fromTo(
            b,
            { x: 0, y: 0, scale: 0.4, rotation: 0, autoAlpha: 1 },
            {
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              scale: gsap.utils.random(0.8, 1.4),
              rotation: gsap.utils.random(-180, 180),
              autoAlpha: 0,
              duration: 0.9,
              ease: 'power3.out',
            },
            0.05,
          );
        });
      });
    },
    { scope: rootRef, dependencies: [phase === 'revealed', qIndex] },
  );

  // Leaderboard reshuffle after each reveal.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    if (reduced()) return;
    Flip.from(state, { duration: 0.7, ease: 'power3.inOut', stagger: 0.04, simple: true });
  }, [revealed]);

  useLayoutEffect(() => () => { timer.current?.kill(); }, []);

  // 1–4 or A–D answer while a question is live, wherever focus is, except inside text fields.
  const pickRef = useRef(pick);
  pickRef.current = pick;
  useEffect(() => {
    if (phase !== 'question') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return;
      const k = e.key.toLowerCase();
      const i = '1234'.includes(k) ? Number(k) - 1 : 'abcd'.indexOf(k);
      if (i < 0 || k.length !== 1) return;
      e.preventDefault();
      pickRef.current(i);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  const playing = phase === 'question' || phase === 'locked' || phase === 'revealed';

  return (
    <div ref={rootRef} className="group/round grid overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl lg:grid-cols-[minmax(0,1fr)_17rem]">
      <p aria-live="polite" className="sr-only">{announce}</p>

      <div className="relative flex min-h-108 flex-col">
        {/* Broadcast bar */}
        <div className="flex items-center justify-between gap-3 border-b border-line bg-canvas/70 px-4 py-3 font-mono text-sm sm:px-5">
          <span className="flex items-center gap-2 font-bold uppercase tracking-widest text-live">
            <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-live" />
            Kick-off round
          </span>
          <span className="text-muted">
            {playing ? `Q ${qIndex + 1} / ${questions.length}` : '3 questions'}
          </span>
          <span className="flex items-center gap-1.5 text-ink">
            <span data-score className="inline-block font-bold">
              <RollingNumber value={myScore} />
            </span>
            <span className="text-muted">pts</span>
          </span>
        </div>

        <div className="relative flex flex-1 flex-col justify-center p-4 sm:p-6">
          {phase === 'idle' && (
            <div className="flex flex-col items-center gap-5 text-center">
              <p className="font-display text-3xl font-extrabold uppercase leading-none text-ink sm:text-4xl">Beat the room</p>
              <p className="max-w-sm text-base text-muted">Three questions, ten seconds each. Faster right answers score more.</p>
              <button
                ref={kickoffRef}
                type="button"
                onClick={kickOff}
                className="group/kick relative mt-2 inline-flex h-16 items-center gap-3 rounded-full bg-accent px-9 font-display text-2xl font-extrabold uppercase tracking-wide text-on-accent shadow-lg shadow-accent/25 transition-[background-color] duration-150 hover:bg-accent-hover active:scale-[0.97]"
              >
                <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-accent/40 [animation-duration:1.8s]" />
                <Play className="relative size-6 fill-current" />
                <span className="relative">Kick off</span>
              </button>
              <p className="font-mono text-sm text-muted">or press 1–4 / A–D to answer</p>
            </div>
          )}

          {phase === 'countdown' && (
            <div className="grid flex-1 place-items-center">
              <span ref={countRef} aria-hidden="true" className="font-display text-9xl font-extrabold text-accent-text" />
              <span className="sr-only">Starting</span>
            </div>
          )}

          {playing && (
            <div className="relative space-y-5">
              <div className="flex items-start justify-between gap-4">
                <h3 data-question key={`q-${qIndex}`} className="font-display text-2xl font-extrabold uppercase leading-tight text-ink sm:text-3xl">
                  {q.text}
                </h3>
                <div className="relative grid size-14 shrink-0 place-items-center" aria-hidden="true">
                  <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="var(--line)" strokeWidth="5" />
                    <circle
                      ref={ringRef}
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={RING}
                      className="stroke-accent group-data-urgent/round:stroke-live"
                    />
                  </svg>
                  <span ref={secondsRef} className="font-mono text-lg font-bold tabular-nums text-ink group-data-urgent/round:text-live">
                    {SECONDS}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" role="group" aria-label="Answers">
                {q.answers.map((a, i) => {
                  const isCorrect = phase === 'revealed' && i === q.correct;
                  const isWrongPick = phase === 'revealed' && i === picked && i !== q.correct;
                  return (
                    <button
                      key={`${qIndex}-${i}`}
                      type="button"
                      data-tile
                      data-correct={isCorrect || undefined}
                      data-wrong-pick={isWrongPick || undefined}
                      disabled={phase !== 'question'}
                      aria-pressed={picked === i}
                      onClick={() => pick(i)}
                      className={cn(
                        'relative flex min-h-16 items-center gap-3 rounded-xl px-4 py-3 text-left text-lg font-bold shadow-md',
                        'transition-[transform,filter] duration-100 ease-press active:scale-[0.94] disabled:cursor-default',
                        tiles[i].tone,
                        phase === 'question' && 'hover:brightness-110',
                        phase === 'locked' && picked !== i && 'brightness-50 saturate-50',
                        picked === i && 'ring-4 ring-ink ring-offset-2 ring-offset-surface',
                      )}
                    >
                      <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-md bg-black/15 text-base">
                        {tiles[i].shape}
                      </span>
                      <span className="sr-only">{tiles[i].key}: </span>
                      <span className="flex-1">{a}</span>
                      {isCorrect && (
                        <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2">
                          {Array.from({ length: 12 }, (_, b) => (
                            <span key={b} data-bit className="absolute -translate-x-1/2 -translate-y-1/2 text-xl text-accent">
                              {tiles[b % 4].shape}
                            </span>
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex min-h-12 items-center justify-between gap-3">
                {phase === 'revealed' ? (
                  <>
                    <span data-gain className={cn('font-display text-3xl font-extrabold', gain ? 'text-success' : 'text-muted')}>
                      {gain ? `+${gain.toLocaleString('en-US')}` : picked === null ? "Time's up" : 'No points'}
                    </span>
                    <button type="button" onClick={next} className={buttonClasses({ tone: 'primary' })} autoFocus>
                      {qIndex === questions.length - 1 ? 'See results' : 'Next question'}
                      <ArrowRight className="size-4" />
                    </button>
                  </>
                ) : (
                  <span className="font-mono text-sm text-muted">
                    {phase === 'locked' ? 'Answer locked…' : 'Pick fast: speed adds points'}
                  </span>
                )}
              </div>
            </div>
          )}

          {phase === 'final' && (
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="font-mono text-sm uppercase tracking-widest text-muted">Final whistle</p>
              <p className="font-display text-7xl font-extrabold uppercase leading-none text-accent-text">#{myRank}</p>
              <p className="text-lg text-ink">
                You scored <span className="font-bold tabular-nums">{myScore.toLocaleString('en-US')}</span> points
                {myRank === 1 ? ' and beat the room.' : '. Run it back?'}
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button type="button" onClick={replay} className={buttonClasses({ tone: 'secondary' })}>
                  <RotateCcw className="size-4" />
                  Play again
                </button>
                <Link to="/dashboard/new" className={buttonClasses({ tone: 'primary' })}>
                  Build your own quiz
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mini leaderboard */}
      <aside aria-label="Leaderboard" className="border-t border-line bg-canvas/50 p-4 sm:p-5 lg:border-l lg:border-t-0">
        <p className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-muted">Leaderboard</p>
        <ol className="space-y-2">
          {board.map((row, i) => (
            <li
              key={row.name}
              data-board-row
              data-flip-id={row.name}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3 py-2.5',
                row.you ? 'border-accent bg-accent-tint' : 'border-line bg-surface',
              )}
            >
              <span className="w-5 font-display text-xl font-extrabold text-muted">{i + 1}</span>
              <span className={cn('flex-1 text-base font-semibold', row.you ? 'text-ink' : 'text-ink-soft')}>{row.name}</span>
              <RollingNumber value={row.score} className="font-mono text-base text-ink" />
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
};
