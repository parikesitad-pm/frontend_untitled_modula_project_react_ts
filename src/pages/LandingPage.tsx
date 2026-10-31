import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { ProductFooter } from '@/components/layout/ProductFooter';
import { FlapHeadline } from '@/components/organisms/landing/FlapHeadline';
import { KickoffRound } from '@/components/organisms/landing/KickoffRound';
import { MatchBroadcast } from '@/components/organisms/landing/MatchBroadcast';
import { HowItWorks } from '@/components/organisms/landing/HowItWorks';
import { AudienceTabs } from '@/components/organisms/landing/AudienceTabs';
import { FeatureTour } from '@/components/organisms/landing/FeatureTour';
import { DemoFaq } from '@/components/organisms/landing/DemoFaq';
import { useMagnetic } from '@/hooks/useMagnetic';
import { usePageReveal } from '@/hooks/usePageReveal';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const sections = [
  { href: '#broadcast', label: 'Live' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#who-its-for', label: "Who it's for" },
  { href: '#features', label: 'Features' },
  { href: '#faq', label: 'FAQ' },
];

// Lets the split-flap headline land before the rest of the hero follows it in.
const AFTER_HEADLINE = 0.7;

export const LandingPage: React.FC = () => {
  const revealRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<HTMLAnchorElement>(null);
  const demoRef = useRef<HTMLAnchorElement>(null);
  usePageReveal(revealRef, 'playful', [], AFTER_HEADLINE);
  useScrollReveal(revealRef);
  useMagnetic(studioRef);
  useMagnetic(demoRef);

  return (
    <div ref={revealRef} className="min-h-screen flex flex-col bg-canvas text-ink">
      <header className="sticky top-0 z-40 w-full border-b border-line bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <BrandLogo size="md" linkTo="/" />

          <nav aria-label="Page sections" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {sections.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="rounded-md px-3 py-2 text-base font-medium text-ink-soft transition-colors hover:bg-raised hover:text-ink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden rounded-md px-3 py-2 text-base font-medium text-ink-soft transition-colors hover:text-ink sm:inline-flex">
              Sign in
            </Link>
            <Link
              to="/dashboard/new"
              className="inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md bg-accent px-4 text-base font-semibold text-on-accent transition-[background-color,transform] duration-150 ease-press hover:bg-accent-hover active:scale-[0.97]"
            >
              Get started
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-line pb-20 pt-14 sm:pb-28 sm:pt-20">
        <div className="relative mx-auto max-w-5xl space-y-6 px-4 text-center sm:px-6">
          <FlapHeadline className="mx-auto max-w-4xl font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-7xl lg:text-8xl">
            Build formally.{' '}
            <span className="text-accent-text">Play when you want.</span>
          </FlapHeadline>

          <p data-reveal className="mx-auto max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Quizzes, pretests, and surveys from one builder. Run them as a calm exam or a live arena with a leaderboard: same questions, your call.
          </p>

          <div data-reveal className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              ref={studioRef}
              to="/dashboard"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-accent px-6 text-base font-semibold text-on-accent transition-[background-color] duration-150 hover:bg-accent-hover"
            >
              Open the studio
              <ArrowRight className="size-4" />
            </Link>
            <Link
              ref={demoRef}
              to="/react-ts-arena/start"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-line-strong bg-surface px-6 text-base font-semibold text-ink transition-[background-color] duration-150 hover:bg-raised"
            >
              <Play className="size-4 fill-current text-success" />
              Join the full demo
            </Link>
          </div>
        </div>

        <div data-reveal className="mx-auto mt-14 max-w-5xl px-4 text-left sm:px-6">
          <KickoffRound />
        </div>
      </section>

      <MatchBroadcast />
      <HowItWorks />
      <AudienceTabs />
      <FeatureTour />
      <DemoFaq />

      <ProductFooter />
    </div>
  );
};
