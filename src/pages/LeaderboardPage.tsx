import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAssessment } from '@/context/useAssessment';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { ParticipantFooter } from '@/components/layout/ParticipantFooter';
import { LeaderboardRow } from '@/components/leaderboard/LeaderboardRow';
import { LeaderboardEntry } from '@/domain';
import { Trophy, Play, ArrowLeft, Lock } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getAssessmentBySlug, leaderboards } = useAssessment();

  const assessment = getAssessmentBySlug(slug || '');
  const boardEntries: LeaderboardEntry[] = leaderboards[slug || ''] || [];

  const isLeaderboardEnabled = assessment ? assessment.leaderboardEnabled : true;

  const topThree = boardEntries.filter((e: LeaderboardEntry) => e.rank <= 3);
  const others = boardEntries.filter((e: LeaderboardEntry) => e.rank > 3);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--color-charcoal)] text-[var(--color-soft-white)]">
      <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-charcoal)]/90 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-muted-steel)] hover:text-[var(--color-soft-white)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <span className="text-[var(--color-border-subtle)]">/</span>
            <BrandLogo size="sm" linkTo="/" />
          </div>

          {assessment && (
            <Link
              to={`/${assessment.slug}/start`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded bg-[#A91535] text-white hover:bg-[#C74B63] transition-colors shadow-sm"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Join Arena</span>
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:px-6 space-y-8">
        {!isLeaderboardEnabled ? (
          /* Clean Disabled / Unavailable State when leaderboardEnabled is false */
          <div className="py-16 text-center border border-dashed border-[var(--color-border-subtle)] rounded-xl bg-[var(--color-panel)] p-8 max-w-lg mx-auto space-y-4 shadow-lg">
            <div className="w-14 h-14 rounded-full bg-[var(--color-panel-elevated)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-muted-steel)] mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[var(--color-soft-white)]">
                Leaderboard is Disabled
              </h2>
              <p className="text-xs text-[var(--color-muted-steel)] leading-relaxed">
                The creator of <strong>{assessment?.title || 'this assessment'}</strong> has configured participant rankings and scores to remain confidential.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              {assessment && (
                <Link
                  to={`/${assessment.slug}/start`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#A91535] hover:bg-[#C74B63] font-mono text-xs font-semibold text-white transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Assessment</span>
                </Link>
              )}
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-panel-elevated)] hover:bg-[var(--color-border-subtle)] font-mono text-xs text-[var(--color-steel)] transition-colors"
              >
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D49D26]/40 bg-[#F4C04E]/10 text-[#F4C04E] font-mono text-xs font-bold">
                <Trophy className="w-3.5 h-3.5" />
                <span>Live Assessment Leaderboard</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-soft-white)]">
                {assessment ? assessment.title : 'Global Leaderboard'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--color-muted-steel)] max-w-lg mx-auto">
                Live real-time ranking based on precision accuracy and answer speed.
              </p>
            </div>

            {topThree.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  {topThree.find((e: LeaderboardEntry) => e.rank === 2) && (
                    <div className="order-2 sm:order-1">
                      <LeaderboardRow entry={topThree.find((e: LeaderboardEntry) => e.rank === 2)!} isTopFive />
                    </div>
                  )}
                  {topThree.find((e: LeaderboardEntry) => e.rank === 1) && (
                    <div className="order-1 sm:order-2">
                      <LeaderboardRow entry={topThree.find((e: LeaderboardEntry) => e.rank === 1)!} isTopFive />
                    </div>
                  )}
                  {topThree.find((e: LeaderboardEntry) => e.rank === 3) && (
                    <div className="order-3 sm:order-3">
                      <LeaderboardRow entry={topThree.find((e: LeaderboardEntry) => e.rank === 3)!} isTopFive />
                    </div>
                  )}
                </div>

                {others.length > 0 && (
                  <div className="space-y-2 pt-4">
                    <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[var(--color-muted-steel)] px-2">
                      <span>Rank & Participant</span>
                      <div className="flex items-center gap-6">
                        <span>Duration</span>
                        <span className="min-w-[70px] text-right">Points</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {others.map((entry: LeaderboardEntry) => (
                        <LeaderboardRow key={entry.participantId} entry={entry} isTopFive={entry.rank <= 5} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-[var(--color-border-subtle)] rounded-lg bg-[var(--color-panel)]/50">
                <Trophy className="w-8 h-8 text-[var(--color-muted-steel)] mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-[var(--color-soft-white)]">No leaderboard entries yet</h3>
                <p className="text-xs text-[var(--color-muted-steel)] mt-1">Be the first to complete this assessment.</p>
              </div>
            )}
          </>
        )}
      </main>

      <ParticipantFooter />
    </div>
  );
};
