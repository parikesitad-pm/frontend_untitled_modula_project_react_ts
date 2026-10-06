import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAssessment } from '@/context/useAssessment';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { AssessmentBadge } from '@/components/common/AssessmentBadge';
import { ParticipantFooter } from '@/components/layout/ParticipantFooter';
import { MarkdownView } from '@/components/common/MarkdownView';
import { Question } from '@/domain';
import { Sparkles, Clock, Award, Shield, User, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ParticipantLobbyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getAssessmentBySlug, addLiveParticipant } = useAssessment();

  const [participantName, setParticipantName] = useState('');
  const [email, setEmail] = useState('');

  const assessment = getAssessmentBySlug(slug || '');

  if (!assessment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-charcoal)] text-[var(--color-soft-white)] p-4 text-center">
        <BrandLogo size="md" />
        <h2 className="text-xl font-bold mt-6">Assessment not found</h2>
        <p className="text-xs text-[var(--color-muted-steel)] mt-1">Check the URL or return to dashboard.</p>
        <Link to="/dashboard" className="mt-4 px-4 py-2 rounded bg-[#A91535] text-xs font-mono text-white">
          Open Dashboard
        </Link>
      </div>
    );
  }

  const isPlayful = assessment.presentationMode === 'playful';
  const questionsCount = assessment.blocks.filter((b: Question) =>
    ['choice', 'checkbox', 'text', 'scale'].includes(b.type)
  ).length;

  const totalPoints = assessment.blocks.reduce((acc: number, b: Question) => acc + (b.points || 0), 0);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantName.trim()) return;

    // Set initial timer expiration if assessment has activity time limit
    const initialExpiresAt = assessment.timeLimitEnabled && assessment.activityTimeLimitSeconds
      ? Date.now() + assessment.activityTimeLimitSeconds * 1000
      : undefined;

    try {
      sessionStorage.setItem(
        `session_${assessment.id}`,
        JSON.stringify({
          participantName: participantName.trim(),
          email: email.trim() || undefined,
          startedAt: new Date().toISOString(),
          timerExpiresAt: initialExpiresAt,
          answers: {},
          questionScores: {},
          score: 0,
          currentStreak: 0,
        })
      );
    } catch (err) {
      console.warn('Failed to initialize participant session in storage:', err);
    }

    // Register participant in mock live session
    addLiveParticipant(assessment.id, {
      displayName: participantName.trim(),
    });

    navigate(`/${assessment.slug}/question/1`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--color-charcoal)] text-[var(--color-soft-white)]">
      <header className="w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-charcoal)]/90 py-3.5 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <BrandLogo size="sm" linkTo="/" />
          <div className="flex items-center gap-2">
            <AssessmentBadge mode={assessment.mode} size="sm" />
            <AssessmentBadge presentation={assessment.presentationMode} size="sm" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md space-y-6">
          <div
            className={cn(
              'rounded-xl border bg-[var(--color-panel)] p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden',
              isPlayful ? 'border-[#7A1025] shadow-[#4A0714]/40' : 'border-[var(--color-border-subtle)]'
            )}
          >
            {isPlayful && (
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#A91535]/20 rounded-full blur-2xl pointer-events-none" />
            )}

            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#C74B63] bg-[#4A0714]/20 px-2.5 py-0.5 rounded-full border border-[#7A1025]/50">
                {isPlayful ? (
                  <>
                    <Sparkles className="w-3 h-3 text-[#F4C04E]" />
                    <span>Interactive Arena Session</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3 h-3" />
                    <span>Evaluation Session</span>
                  </>
                )}
              </div>

              <div className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-soft-white)]">
                <MarkdownView content={assessment.title} />
              </div>

              {assessment.description && (
                <div className="text-xs text-[var(--color-muted-steel)] leading-relaxed max-w-sm mx-auto">
                  <MarkdownView content={assessment.description} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-2">
              <div className="p-2.5 rounded bg-[var(--color-charcoal)] border border-[var(--color-border-subtle)] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5AA9FF]" />
                <div>
                  <div className="text-[10px] uppercase text-[var(--color-muted-steel)]">
                    {assessment.timeLimitEnabled ? 'Time Limit' : 'Questions'}
                  </div>
                  <div className="font-bold text-[var(--color-soft-white)]">
                    {assessment.timeLimitEnabled && assessment.activityTimeLimitSeconds
                      ? `${Math.floor(assessment.activityTimeLimitSeconds / 60)} mins`
                      : `${questionsCount} items`}
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-[var(--color-charcoal)] border border-[var(--color-border-subtle)] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#F4C04E]" />
                <div>
                  <div className="text-[10px] uppercase text-[var(--color-muted-steel)]">Total Points</div>
                  <div className="font-bold text-[var(--color-soft-white)]">{totalPoints} pts</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleStart} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-[var(--color-muted-steel)]">
                  Enter your Name / Handle *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-steel)]" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-[var(--color-charcoal)] border border-[var(--color-border-subtle)] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[var(--color-soft-white)] placeholder-[var(--color-muted-steel)] focus:outline-none focus:ring-2 focus:ring-[#A91535] focus:border-transparent font-medium"
                  />
                </div>
              </div>

              {assessment.settings.requireAuth && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[var(--color-muted-steel)]">Email Address (Required)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.dev"
                    className="w-full bg-[var(--color-charcoal)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--color-soft-white)] placeholder-[var(--color-muted-steel)] focus:outline-none focus:ring-1 focus:ring-[#A91535]"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={!participantName.trim()}
                className={cn(
                  'w-full py-3 px-4 rounded-lg font-mono text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer',
                  isPlayful
                    ? 'bg-gradient-to-r from-[#A91535] to-[#7A1025] hover:from-[#C74B63] hover:to-[#A91535] shadow-[#7A1025]/40 active:scale-98'
                    : 'bg-[#A91535] hover:bg-[#C74B63]',
                  !participantName.trim() && 'opacity-50 cursor-not-allowed'
                )}
              >
                <span>{isPlayful ? 'Enter Arena' : 'Begin Assessment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>

      <ParticipantFooter />
    </div>
  );
};
