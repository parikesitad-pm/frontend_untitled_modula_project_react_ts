import React, { useRef } from 'react';
import { usePageReveal } from '@/hooks/usePageReveal';
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
  const revealRef = useRef<HTMLElement>(null);
  usePageReveal(revealRef, assessment?.presentationMode === 'playful' ? 'playful' : 'formal');
  const boardEntries: LeaderboardEntry[] = leaderboards[slug || ''] || [];

  const isLeaderboardEnabled = assessment ? assessment.leaderboardEnabled : true;

  const topThree = boardEntries.filter((e: LeaderboardEntry) => e.rank <= 3);
  const others = boardEntries.filter((e: LeaderboardEntry) => e.rank > 3);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-canvas text-ink">
      <header className="sticky top-0 z-40 w-full border-b border-line bg-canvas/90 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <span className="text-line">/</span>
            <BrandLogo size="sm" linkTo="/" />
          </div>

          {assessment && (
            <Link
              to={`/${assessment.slug}/start`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded bg-accent text-on-accent hover:bg-accent-hover transition-colors shadow-sm"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Join Arena</span>
            </Link>
          )}
        </div>
      </header>

      <main ref={revealRef} className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:px-6 space-y-8">
        {!isLeaderboardEnabled ? (
          /* Clean Disabled / Unavailable State when leaderboardEnabled is false */
          <div className="py-16 text-center border border-dashed border-line rounded-xl bg-surface p-8 max-w-lg mx-auto space-y-4 shadow-lg">
            <div className="w-14 h-14 rounded-full bg-raised border border-line flex items-center justify-center text-muted mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-ink">
                Leaderboard is Disabled
              </h2>
              <p className="text-xs text-muted leading-relaxed">
                The creator of <strong>{assessment?.title || 'this assessment'}</strong> has configured participant rankings and scores to remain confidential.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              {assessment && (
                <Link
                  to={`/${assessment.slug}/start`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover font-mono text-xs font-semibold text-on-accent transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Assessment</span>
                </Link>
              )}
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-raised hover:bg-line font-mono text-xs text-ink-soft transition-colors"
              >
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-deep/40 bg-accent/10 text-accent-text font-mono text-xs font-bold">
                <Trophy className="w-3.5 h-3.5" />
                <span>Live Assessment Leaderboard</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-ink">
                {assessment ? assessment.title : 'Global Leaderboard'}
              </h1>
              <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto">
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
                    <div className="flex items-center justify-between text-[11px] font-mono uppercase text-muted px-2">
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
              <div className="text-center py-16 border border-dashed border-line rounded-lg bg-surface/50">
                <Trophy className="w-8 h-8 text-muted mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-ink">No leaderboard entries yet</h3>
                <p className="text-xs text-muted mt-1">Be the first to complete this assessment.</p>
              </div>
            )}
          </>
        )}
      </main>

      <ParticipantFooter />
    </div>
  );
};
