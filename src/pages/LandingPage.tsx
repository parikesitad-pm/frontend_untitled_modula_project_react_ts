import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { ProductFooter } from '@/components/layout/ProductFooter';
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Play, 
  BarChart3, 
  Trophy 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const LandingPage: React.FC = () => {
  const [previewMode, setPreviewMode] = useState<'formal' | 'playful'>('playful');

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-charcoal)] text-[var(--color-soft-white)]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-charcoal)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <BrandLogo size="md" linkTo="/" />

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-mono text-xs text-[var(--color-steel)] hover:text-[var(--color-soft-white)] transition-colors"
            >
              <span>Dashboard</span>
            </Link>
            <Link
              to="/dashboard/new"
              className="inline-flex items-center gap-1.5 rounded bg-[#A91535] px-4 py-1.5 font-mono text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#C74B63] active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-[var(--color-border-subtle)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4A0714]/30 via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7A1025] bg-[#4A0714]/40 text-[#C74B63] font-mono text-xs">
            <Sparkles className="w-3 h-3" />
            <span>Interactive Assessment & Live Play Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--color-soft-white)] max-w-4xl mx-auto leading-tight">
            Build formally.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C74B63] via-[#A91535] to-[#5AA9FF]">
              Play when you want.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[var(--color-muted-steel)] max-w-2xl mx-auto leading-relaxed">
            The power and flexibility of a modern modular form builder, combined with the high-energy live experience of interactive challenge arenas. One unified architecture.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded bg-[#A91535] px-6 py-2.5 font-mono text-sm font-semibold text-white shadow-lg shadow-[#7A1025]/30 hover:bg-[#C74B63] transition-all active:scale-95"
            >
              <span>Open Assessment Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/react-ts-arena/start"
              className="inline-flex items-center gap-2 rounded border border-[var(--color-border-subtle)] bg-[var(--color-panel)] px-6 py-2.5 font-mono text-sm font-semibold text-[var(--color-steel)] hover:text-[var(--color-soft-white)] hover:border-[var(--color-muted-steel)] transition-all"
            >
              <Play className="w-4 h-4 fill-current text-[#46D19E]" />
              <span>Try Live Participant Demo</span>
            </Link>
          </div>
        </div>

        {/* Live Presentation Mode Switcher Preview */}
        <div className="mt-16 mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-2 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border-subtle)] bg-[var(--color-charcoal)]/80 rounded-t-lg">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-border-subtle)]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-border-subtle)]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-border-subtle)]" />
                <span className="ml-2 font-mono text-xs text-[var(--color-muted-steel)]">
                  Untitled Assessment Engine · Live Preview
                </span>
              </div>

              <div className="flex items-center bg-[var(--color-panel-elevated)] border border-[var(--color-border-subtle)] rounded-lg p-0.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewMode('formal')}
                  className={cn(
                    'px-3 py-1 rounded transition-colors cursor-pointer',
                    previewMode === 'formal' ? 'bg-[var(--color-charcoal)] text-[var(--color-soft-white)] font-bold' : 'text-[var(--color-muted-steel)] hover:text-[var(--color-steel)]'
                  )}
                >
                  Formal View
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('playful')}
                  className={cn(
                    'px-3 py-1 rounded transition-colors cursor-pointer',
                    previewMode === 'playful' ? 'bg-[#7A1025] text-white font-bold' : 'text-[var(--color-muted-steel)] hover:text-[var(--color-steel)]'
                  )}
                >
                  Playful Arena
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 min-h-[300px] flex flex-col justify-center">
              {previewMode === 'playful' ? (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[var(--color-muted-steel)]">Question 03 of 10</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#5AA9FF] font-bold">18s remaining</span>
                      <span className="text-[#46D19E] font-bold">1,420 pts</span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-center text-[var(--color-soft-white)] py-2">
                    In React 19, which hook is natively provided for handling asynchronous form submission?
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-4 rounded-lg bg-[#F0646A] text-white font-bold text-sm sm:text-base flex items-center justify-between shadow-md cursor-pointer hover:opacity-90 transition-opacity">
                      <span>A. useActionState</span>
                      <span className="text-xs bg-black/20 px-2 py-0.5 rounded font-mono">CORAL</span>
                    </div>
                    <div className="p-4 rounded-lg bg-[#5AA9FF] text-white font-bold text-sm sm:text-base flex items-center justify-between shadow-md cursor-pointer hover:opacity-90 transition-opacity">
                      <span>B. useFormStatus</span>
                      <span className="text-xs bg-black/20 px-2 py-0.5 rounded font-mono">SKY</span>
                    </div>
                    <div className="p-4 rounded-lg bg-[#F4C04E] text-stone-900 font-bold text-sm sm:text-base flex items-center justify-between shadow-md cursor-pointer hover:opacity-90 transition-opacity">
                      <span>C. useAsyncEffect</span>
                      <span className="text-xs bg-black/15 px-2 py-0.5 rounded font-mono text-stone-900">GOLD</span>
                    </div>
                    <div className="p-4 rounded-lg bg-[#46D19E] text-stone-900 font-bold text-sm sm:text-base flex items-center justify-between shadow-md cursor-pointer hover:opacity-90 transition-opacity">
                      <span>D. useMutationState</span>
                      <span className="text-xs bg-black/15 px-2 py-0.5 rounded font-mono text-stone-900">MINT</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn max-w-2xl mx-auto w-full">
                  <div className="border-b border-[var(--color-border-subtle)] pb-3">
                    <span className="font-mono text-xs text-[var(--color-muted-steel)] uppercase">Section 2 · Distributed Systems</span>
                    <h3 className="text-lg font-bold text-[var(--color-soft-white)] mt-1">
                      Under network partitioning in a CP distributed datastore, what is the expected failure handling?
                    </h3>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <label className="flex items-center gap-3 p-3 rounded border border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] hover:border-[var(--color-muted-steel)] cursor-pointer">
                      <input type="radio" name="preview-formal" defaultChecked className="accent-[#A91535]" />
                      <span className="text-[var(--color-soft-white)]">Reject write requests to preserve linearizability and consistency</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded border border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] hover:border-[var(--color-muted-steel)] cursor-pointer">
                      <input type="radio" name="preview-formal" className="accent-[#A91535]" />
                      <span className="text-[var(--color-muted-steel)]">Accept local writes and reconcile conflicts asynchronously</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-12">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#A91535]">
            Engineered Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-soft-white)]">
            Four pillars of the Untitled Engine
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] space-y-3">
            <div className="w-10 h-10 rounded bg-[#7A1025]/30 border border-[#7A1025] flex items-center justify-center text-[#C74B63]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[var(--color-soft-white)]">Stackable Block Builder</h3>
            <p className="text-xs text-[var(--color-muted-steel)] leading-relaxed">
              Google-Forms flexibility with headers, choices, checkboxes, scales, countdown anchors, and media prompts.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] space-y-3">
            <div className="w-10 h-10 rounded bg-[#5AA9FF]/10 border border-[#5AA9FF]/30 flex items-center justify-center text-[#5AA9FF]">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <h3 className="font-semibold text-base text-[var(--color-soft-white)]">Dynamic Presentation</h3>
            <p className="text-xs text-[var(--color-muted-steel)] leading-relaxed">
              Switch effortlessly from formal technical pretests to vibrant live arenas without touching a single line of schema.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] space-y-3">
            <div className="w-10 h-10 rounded bg-[#F4C04E]/10 border border-[#D49D26]/30 flex items-center justify-center text-[#F4C04E]">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[var(--color-soft-white)]">Live Ranking & Podium</h3>
            <p className="text-xs text-[var(--color-muted-steel)] leading-relaxed">
              Instant score aggregation, time penalties, top-5 podium cards, and full exportable participant leaderboards.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] space-y-3">
            <div className="w-10 h-10 rounded bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[var(--color-soft-white)]">Telemetry & Analytics</h3>
            <p className="text-xs text-[var(--color-muted-steel)] leading-relaxed">
              In-depth participant database, pretest/posttest delta tracking, completion telemetry, and CSV export.
            </p>
          </div>
        </div>
      </section>

      <ProductFooter />
    </div>
  );
};

