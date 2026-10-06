import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAssessment } from '@/context/useAssessment';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { ParticipantFooter } from '@/components/layout/ParticipantFooter';
import { MarkdownView } from '@/components/common/MarkdownView';
import { Question } from '@/domain';
import { 
  Trophy, 
  CheckCircle2, 
  Award, 
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ParticipantResultPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getAssessmentBySlug } = useAssessment();

  const assessment = getAssessmentBySlug(slug || '');

  if (!assessment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-charcoal)] text-[var(--color-soft-white)] p-4 text-center">
        <BrandLogo size="md" />
        <h2 className="text-xl font-bold mt-4">Assessment not found</h2>
        <Link to="/dashboard" className="mt-4 px-4 py-2 rounded bg-[#A91535] text-xs font-mono text-white">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const sessionKey = `session_${assessment.id}`;
  const session = (() => {
    try {
      const raw = sessionStorage.getItem(sessionKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return {
            participantName: parsed.participantName || 'Candidate',
            score: typeof parsed.score === 'number' ? parsed.score : 0,
            answers: parsed.answers || {},
          };
        }
      }
    } catch (e) {
      console.warn('Failed to parse result session:', e);
    }
    return { participantName: 'Candidate', score: 0, answers: {} };
  })();

  const totalPossiblePoints = assessment.blocks.reduce((acc: number, b: Question) => acc + (b.points || 0), 0);
  const percentage = totalPossiblePoints > 0 ? Math.round((session.score / totalPossiblePoints) * 100) : 100;
  const isPassed = percentage >= assessment.settings.passPercentage;
  const isPlayful = assessment.presentationMode === 'playful';

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--color-charcoal)] text-[var(--color-soft-white)]">
      <header className="w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-charcoal)]/90 py-3.5 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <BrandLogo size="sm" linkTo="/" />
          {assessment.leaderboardEnabled && (
            <Link
              to={`/leaderboard/${assessment.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded bg-[var(--color-panel)] text-[#F4C04E] hover:bg-[var(--color-panel-elevated)] border border-[#D49D26]/30 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Leaderboard</span>
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-lg space-y-6">
          <div
            className={cn(
              'rounded-xl border bg-[var(--color-panel)] p-6 sm:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden',
              isPlayful ? 'border-[#7A1025] shadow-[#4A0714]/50' : 'border-[var(--color-border-subtle)]'
            )}
          >
            {isPassed && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            )}

            <div className="space-y-1">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-muted-steel)]">
                Assessment Completed
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-soft-white)]">
                Great job, {session.participantName}!
              </h1>
              <div className="text-xs text-[var(--color-muted-steel)]">
                <MarkdownView content={`Responses for **${assessment.title}** registered.`} inline />
              </div>
            </div>

            {assessment.settings.showScore && (
              <div className="p-6 rounded-lg bg-[var(--color-charcoal)] border border-[var(--color-border-subtle)] space-y-3">
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-[var(--color-soft-white)] tracking-tight">
                  <span
                    className={cn(
                      isPassed ? 'text-emerald-400' : 'text-[#C74B63]'
                    )}
                  >
                    {percentage}%
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs font-mono text-[var(--color-muted-steel)] pt-2 border-t border-[var(--color-border-subtle)]/60">
                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#F4C04E]" />
                    <span>{session.score} / {totalPossiblePoints} pts</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <span className={cn('px-2 py-0.5 rounded text-[10px] uppercase font-bold', isPassed ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' : 'bg-red-950/40 text-red-300 border border-red-500/30')}>
                      {isPassed ? 'PASSED' : 'NOT PASSED'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {assessment.leaderboardEnabled && (
                <Link
                  to={`/leaderboard/${assessment.slug}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-[#F4C04E] hover:bg-[#D49D26] px-5 py-2.5 font-mono text-xs font-bold text-stone-900 shadow transition-colors cursor-pointer"
                >
                  <Trophy className="w-4 h-4 fill-stone-900" />
                  <span>View Full Leaderboard</span>
                </Link>
              )}

              <Link
                to={`/${assessment.slug}/start`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded border border-[var(--color-border-subtle)] bg-[var(--color-panel-elevated)] hover:bg-[var(--color-border-subtle)] px-5 py-2.5 font-mono text-xs text-[var(--color-steel)] hover:text-[var(--color-soft-white)] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Again</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <ParticipantFooter />
    </div>
  );
};
