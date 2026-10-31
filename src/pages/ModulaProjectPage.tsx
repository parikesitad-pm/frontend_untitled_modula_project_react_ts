import React, { useRef } from 'react';
import { usePageReveal } from '@/hooks/usePageReveal';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { ProductFooter } from '@/components/layout/ProductFooter';
import { modulaRegistryProjects } from '@/data/mockAssessments';
import { GitFork, ArrowUpRight, Globe, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ModulaProjectPage: React.FC = () => {
  const revealRef = useRef<HTMLElement>(null);
  usePageReveal(revealRef, 'formal');
  const totalProjects = modulaRegistryProjects.length;
  const liveProjects = modulaRegistryProjects.filter((p) => p.statusType === 'live').length;
  const reconProjects = modulaRegistryProjects.filter((p) => p.statusType === 'reconstruction').length;

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink font-mono">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-line bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to App</span>
            </Link>
            <span className="text-line">/</span>
            <BrandLogo size="sm" linkTo="/" />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">MODULA PROJECT REGISTRY · 2026</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main ref={revealRef} className="flex-1 mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="w-full">
          {/* Header Section */}
          <div className="border-b border-line pb-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted uppercase">
                <span>MODULA PROJECT</span>
                <span className="text-line">/</span>
                <span>PROJECT REGISTRY</span>
                <span className="text-line">/</span>
                <span className="text-ink-soft">2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                Independent systems. Shared engineering principles.
              </h1>
              <p className="text-xs sm:text-sm text-muted max-w-2xl mt-1 leading-relaxed">
                An index of production utilities, workspace engines, and system toolchains engineered under the Modula umbrella.
              </p>
            </div>

            {/* Metrics Counters */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-line/60">
              <div className="border border-line bg-surface px-4 py-3 rounded">
                <div className="text-[10px] uppercase tracking-widest text-muted">TOTAL PROJECTS</div>
                <div className="mt-1 text-2xl font-bold text-ink tabular-nums">
                  {totalProjects.toString().padStart(2, '0')}
                </div>
              </div>
              <div className="border border-line bg-surface px-4 py-3 rounded">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE</span>
                </div>
                <div className="mt-1 text-2xl font-bold text-ink tabular-nums">
                  {liveProjects.toString().padStart(2, '0')}
                </div>
              </div>
              <div className="border border-line bg-surface px-4 py-3 rounded">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted" />
                  <span>UNDER RECONSTRUCTION</span>
                </div>
                <div className="mt-1 text-2xl font-bold text-ink-soft tabular-nums">
                  {reconProjects.toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 text-[11px] font-semibold tracking-wider text-muted uppercase border-b border-line bg-surface/40 mt-6">
            <div className="col-span-1">SEQ</div>
            <div className="col-span-4">SYSTEM</div>
            <div className="col-span-3">STATUS</div>
            <div className="col-span-4 text-right">OPERATIONAL LINKS</div>
          </div>

          {/* System Rows */}
          <div className="divide-y divide-line/60 border-b border-line">
            {modulaRegistryProjects.map((item) => (
              <div key={item.seq} className="px-4 py-5 md:py-4 transition-colors hover:bg-surface/50">
                {/* Desktop layout */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 items-center text-xs">
                  <div className="col-span-1 text-muted tabular-nums">{item.seq}</div>
                  <div className="col-span-4 flex items-center gap-2.5">
                    <span className="font-semibold tracking-tight text-sm text-ink">{item.system}</span>
                    {item.badge && (
                      <span className="inline-flex items-center px-1.5 py-0.5 border border-accent-deep text-[10px] uppercase tracking-wider text-accent-text bg-accent-tint/30 rounded">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    {item.statusType === 'live' ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] uppercase tracking-wider font-medium text-ink">LIVE</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-muted/50" />
                        <span className="text-[11px] uppercase tracking-wider font-medium text-muted">UNDER RECONSTRUCTION</span>
                      </>
                    )}
                  </div>
                  <div className="col-span-4 flex items-center justify-end gap-4">
                    {item.repoUrl && (
                      <a
                        href={item.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink transition-colors focus-visible:ring-1 focus-visible:ring-accent"
                      >
                        <GitFork className="w-3.5 h-3.5 text-muted group-hover:text-ink-soft" />
                        <span>Repository</span>
                        <ArrowUpRight className="w-3 h-3 text-muted group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                    {item.deployUrl && (
                      <a
                        href={item.deployUrl}
                        target={item.isCurrent ? '_self' : '_blank'}
                        rel={item.isCurrent ? undefined : 'noopener noreferrer'}
                        className="group inline-flex items-center gap-1.5 text-xs text-ink border border-line hover:border-muted bg-surface px-2.5 py-1 rounded"
                      >
                        <Globe className="w-3.5 h-3.5 text-ink-soft group-hover:text-ink" />
                        <span>{item.isCurrent ? 'Open system' : 'Open deployment'}</span>
                        <ArrowUpRight className="w-3 h-3 text-ink-soft group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="md:hidden flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted tabular-nums">{item.seq}</span>
                      <span className="font-semibold text-sm text-ink">{item.system}</span>
                    </div>
                    {item.badge && (
                      <span className="inline-flex items-center px-1.5 py-0.5 border border-accent-deep text-[9px] uppercase tracking-wider text-accent-text bg-accent-tint/30 rounded">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-line/30">
                    {item.statusType === 'live' ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] uppercase tracking-wider font-medium text-ink">LIVE</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-muted/50" />
                        <span className="text-[10px] uppercase tracking-wider font-medium text-muted">UNDER RECONSTRUCTION</span>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {item.repoUrl && (
                      <a
                        href={item.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-ink-soft"
                      >
                        <GitFork className="w-3.5 h-3.5 text-muted" />
                        <span>Repository</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                    {item.deployUrl && (
                      <a
                        href={item.deployUrl}
                        target={item.isCurrent ? '_self' : '_blank'}
                        rel={item.isCurrent ? undefined : 'noopener noreferrer'}
                        className="inline-flex items-center gap-1.5 text-xs text-ink border border-line bg-surface px-2 py-0.5 rounded ml-auto"
                      >
                        <Globe className="w-3 h-3 text-ink-soft" />
                        <span>Open</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <ProductFooter />
    </div>
  );
};

