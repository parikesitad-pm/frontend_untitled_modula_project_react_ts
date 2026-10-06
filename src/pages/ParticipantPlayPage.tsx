import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAssessment } from '@/context/useAssessment';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { TimerRing } from '@/components/participant/TimerRing';
import { ParticipantProgress } from '@/components/participant/ParticipantProgress';
import { ParticipantFooter } from '@/components/layout/ParticipantFooter';
import { MarkdownView } from '@/components/common/MarkdownView';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Volume2, 
  VolumeX, 
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Question, scoreQuestionAnswer, deriveTotalScore, AnswerValue } from '@/domain';

interface ParticipantSessionState {
  participantName: string;
  email?: string;
  startedAt: string;
  timerExpiresAt?: number;
  answers: Record<string, AnswerValue>;
  questionScores?: Record<string, number>;
  score: number;
  currentStreak: number;
}

export const ParticipantPlayPage: React.FC = () => {
  const { slug, questionNumber } = useParams<{ slug: string; questionNumber: string }>();
  const navigate = useNavigate();
  const { getAssessmentBySlug, submitAssessment } = useAssessment();

  const assessment = getAssessmentBySlug(slug || '');

  // Filter only actual interactive questions
  const questionBlocks = useMemo(() => {
    return (
      assessment?.blocks.filter((b) =>
        ['choice', 'checkbox', 'text', 'scale'].includes(b.type)
      ) || []
    );
  }, [assessment?.blocks]);

  const currentQIndex = (parseInt(questionNumber || '1', 10) || 1) - 1;
  const currentBlock: Question | undefined = questionBlocks[currentQIndex];

  // Session state from sessionStorage with resilient parsing
  const sessionKey = assessment ? `session_${assessment.id}` : '';
  const [sessionData, setSessionData] = useState<ParticipantSessionState>(() => {
    if (!sessionKey) {
      return {
        participantName: 'Candidate',
        startedAt: new Date().toISOString(),
        answers: {},
        questionScores: {},
        score: 0,
        currentStreak: 0,
      };
    }
    const raw = sessionStorage.getItem(sessionKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          // Initialize activity-level continuous timer if not yet set
          if (assessment?.timeLimitEnabled && assessment.activityTimeLimitSeconds && !parsed.timerExpiresAt) {
            parsed.timerExpiresAt = Date.now() + assessment.activityTimeLimitSeconds * 1000;
            sessionStorage.setItem(sessionKey, JSON.stringify(parsed));
          }
          if (!parsed.questionScores) {
            parsed.questionScores = {};
          }
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse participant session data:', e);
      }
    }
    const initial: ParticipantSessionState = {
      participantName: 'Candidate',
      startedAt: new Date().toISOString(),
      timerExpiresAt: assessment?.timeLimitEnabled && assessment.activityTimeLimitSeconds
        ? Date.now() + assessment.activityTimeLimitSeconds * 1000
        : undefined,
      answers: {},
      questionScores: {},
      score: 0,
      currentStreak: 0,
    };
    return initial;
  });

  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | number | null>(null);
  const [soundOn, setSoundOn] = useState(assessment?.settings.soundEnabled ?? false);

  // Activity-level continuous timer calculation
  const totalActivitySeconds = assessment?.activityTimeLimitSeconds || 300;
  const [activitySecondsLeft, setActivitySecondsLeft] = useState<number>(() => {
    if (!assessment?.timeLimitEnabled || !sessionData.timerExpiresAt) {
      return totalActivitySeconds;
    }
    const remaining = Math.max(0, Math.round((sessionData.timerExpiresAt - Date.now()) / 1000));
    return remaining;
  });

  // Sync answer state when navigating between questions
  useEffect(() => {
    if (currentBlock && sessionData.answers?.[currentBlock.id] !== undefined) {
      setSelectedAnswer(sessionData.answers[currentBlock.id]);
    } else {
      setSelectedAnswer(currentBlock?.type === 'checkbox' ? [] : null);
    }
  }, [currentQIndex, currentBlock, sessionData.answers]);

  const handleAutoSubmit = useCallback(() => {
    if (!assessment) return;
    const totalPossiblePoints = questionBlocks.reduce((acc, b) => acc + (b.points || 0), 0);
    const calculatedScore = sessionData.questionScores
      ? deriveTotalScore(sessionData.questionScores)
      : sessionData.score || 0;
    const percentage = totalPossiblePoints > 0 ? Math.round((calculatedScore / totalPossiblePoints) * 100) : 100;
    const startTime = new Date(sessionData.startedAt).getTime();
    const totalTimeSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    submitAssessment(assessment.id, {
      assessmentId: assessment.id,
      participantId: `p-${Date.now().toString(36)}`,
      participantName: sessionData.participantName || 'Candidate',
      email: sessionData.email,
      status: 'completed',
      score: calculatedScore,
      maxScore: totalPossiblePoints,
      percentage,
      totalDurationMs: totalTimeSeconds * 1000,
      totalTimeSeconds,
      startedAt: sessionData.startedAt,
      completedAt: new Date().toISOString(),
      expiresAt: null,
      answers: Object.entries(sessionData.answers || {}).map(([qId, ans]) => ({
        id: `ans-${qId}`,
        attemptId: 'temp',
        questionId: qId,
        value: ans,
        scoreAwarded: sessionData.questionScores?.[qId] ?? 0,
        answeredAt: new Date().toISOString(),
        responseDurationMs: 15000,
        isCorrect: (sessionData.questionScores?.[qId] ?? 0) > 0,
        answer: ans,
        pointsEarned: sessionData.questionScores?.[qId] ?? 0,
        timeSpentSeconds: 15,
      })),
    });

    navigate(`/${assessment.slug}/result`);
  }, [assessment, questionBlocks, sessionData, submitAssessment, navigate]);

  // Continuous activity-level timer countdown effect (does NOT reset per question)
  useEffect(() => {
    if (!assessment?.timeLimitEnabled || !sessionData.timerExpiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const expiresAt = sessionData.timerExpiresAt!;
      const diffSeconds = Math.max(0, Math.round((expiresAt - now) / 1000));

      setActivitySecondsLeft(diffSeconds);

      if (diffSeconds <= 0) {
        clearInterval(interval);
        // Auto-submit when time expires!
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [assessment?.timeLimitEnabled, sessionData.timerExpiresAt, handleAutoSubmit]);

  // Check if answer is provided and valid
  const isAnswerProvided = useMemo(() => {
    if (!currentBlock) return false;
    if (currentBlock.type === 'choice') {
      return typeof selectedAnswer === 'string' && selectedAnswer.trim().length > 0;
    }
    if (currentBlock.type === 'checkbox') {
      return Array.isArray(selectedAnswer) && selectedAnswer.length > 0;
    }
    if (currentBlock.type === 'scale') {
      return typeof selectedAnswer === 'number';
    }
    if (currentBlock.type === 'text') {
      return typeof selectedAnswer === 'string' && selectedAnswer.trim().length > 0;
    }
    return true;
  }, [currentBlock, selectedAnswer]);

  const canProceed = !currentBlock?.required || isAnswerProvided;

  if (!assessment || !currentBlock) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-charcoal)] text-[var(--color-soft-white)] p-4 text-center">
        <BrandLogo size="md" />
        <h2 className="text-xl font-bold mt-4">Question out of bounds</h2>
        <p className="text-xs text-[var(--color-muted-steel)] mt-1">This question does not exist in the active assessment.</p>
        <Link to={`/${slug || ''}/start`} className="mt-4 px-4 py-2 rounded bg-[#A91535] text-xs font-mono text-white">
          Return to Lobby
        </Link>
      </div>
    );
  }

  const isPlayful = assessment.presentationMode === 'playful';
  const totalQuestions = questionBlocks.length;
  const isLastQuestion = currentQIndex === totalQuestions - 1;

  const tileColors: Record<string, { bg: string; border: string; active: string; text: string; label: string }> = {
    coral: {
      bg: 'bg-[#F0646A]',
      border: 'border-[#C94248]',
      active: 'ring-4 ring-white shadow-xl shadow-[#F0646A]/40',
      text: 'text-white',
      label: 'CORAL',
    },
    sky: {
      bg: 'bg-[#5AA9FF]',
      border: 'border-[#3787E0]',
      active: 'ring-4 ring-white shadow-xl shadow-[#5AA9FF]/40',
      text: 'text-white',
      label: 'SKY',
    },
    gold: {
      bg: 'bg-[#F4C04E]',
      border: 'border-[#D49D26]',
      active: 'ring-4 ring-white shadow-xl shadow-[#F4C04E]/40',
      text: 'text-stone-900',
      label: 'GOLD',
    },
    mint: {
      bg: 'bg-[#46D19E]',
      border: 'border-[#2BB381]',
      active: 'ring-4 ring-white shadow-xl shadow-[#46D19E]/40',
      text: 'text-stone-900',
      label: 'MINT',
    },
  };

  const handleSelectChoice = (optionId: string) => {
    setSelectedAnswer(optionId);
  };

  const handleToggleCheckbox = (optionId: string) => {
    const prevList = Array.isArray(selectedAnswer) ? (selectedAnswer as string[]) : [];
    if (prevList.includes(optionId)) {
      setSelectedAnswer(prevList.filter((id) => id !== optionId));
    } else {
      setSelectedAnswer([...prevList, optionId]);
    }
  };

  const handleNext = () => {
    const updatedAnswers: Record<string, AnswerValue> = {
      ...(sessionData.answers || {}),
      [currentBlock.id]: selectedAnswer ?? '',
    };

    const { scoreAwarded, isCorrect } = scoreQuestionAnswer(currentBlock, selectedAnswer);

    const updatedQuestionScores = {
      ...(sessionData.questionScores || {}),
      [currentBlock.id]: scoreAwarded,
    };

    const calculatedTotalScore = deriveTotalScore(updatedQuestionScores);
    const updatedStreak = isCorrect ? (sessionData.currentStreak || 0) + 1 : 0;

    const newSession: ParticipantSessionState = {
      ...sessionData,
      answers: updatedAnswers,
      questionScores: updatedQuestionScores,
      score: calculatedTotalScore,
      currentStreak: updatedStreak,
    };

    setSessionData(newSession);
    try {
      sessionStorage.setItem(sessionKey, JSON.stringify(newSession));
    } catch (e) {
      console.warn('Failed to save session state:', e);
    }

    if (isLastQuestion) {
      const totalPossiblePoints = questionBlocks.reduce((acc, b) => acc + (b.points || 0), 0);
      const percentage = totalPossiblePoints > 0 ? Math.round((calculatedTotalScore / totalPossiblePoints) * 100) : 100;
      const startTime = new Date(newSession.startedAt).getTime();
      const totalTimeSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

      submitAssessment(assessment.id, {
        assessmentId: assessment.id,
        participantId: `p-${Date.now().toString(36)}`,
        participantName: sessionData.participantName || 'Candidate',
        email: sessionData.email,
        status: 'completed',
        score: calculatedTotalScore,
        maxScore: totalPossiblePoints,
        percentage,
        totalDurationMs: totalTimeSeconds * 1000,
        totalTimeSeconds,
        startedAt: newSession.startedAt,
        completedAt: new Date().toISOString(),
        expiresAt: null,
        answers: Object.entries(updatedAnswers).map(([qId, ans]) => ({
          id: `ans-${qId}`,
          attemptId: 'temp',
          questionId: qId,
          value: ans,
          scoreAwarded: updatedQuestionScores[qId] ?? 0,
          answeredAt: new Date().toISOString(),
          responseDurationMs: 15000,
          isCorrect: (updatedQuestionScores[qId] ?? 0) > 0,
          answer: ans,
          pointsEarned: updatedQuestionScores[qId] ?? 0,
          timeSpentSeconds: 15,
        })),
      });

      navigate(`/${assessment.slug}/result`);
    } else {
      navigate(`/${assessment.slug}/question/${currentQIndex + 2}`);
    }
  };

  const handlePrevious = () => {
    if (currentQIndex > 0) {
      navigate(`/${assessment.slug}/question/${currentQIndex}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--color-charcoal)] text-[var(--color-soft-white)]">
      {/* Top Participant Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-charcoal)]/90 backdrop-blur-md px-3 sm:px-6 py-3">
        <div className="mx-auto max-w-4xl flex items-center justify-between gap-2 sm:gap-4">
          <BrandLogo size="sm" linkTo="/" />

          <div className="flex-1 max-w-md mx-auto hidden sm:block">
            <ParticipantProgress
              currentQuestion={currentQIndex + 1}
              totalQuestions={totalQuestions}
              score={sessionData?.score || 0}
              streak={sessionData?.currentStreak || 0}
              isPlayful={isPlayful}
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Activity continuous timer indicator in header */}
            {assessment.timeLimitEnabled && (
              <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded bg-[var(--color-panel)] border border-[var(--color-border-subtle)] font-mono text-xs text-[#5AA9FF] font-semibold">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {Math.floor(activitySecondsLeft / 60)}:
                  {(activitySecondsLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}

            {isPlayful && (
              <button
                type="button"
                onClick={() => setSoundOn(!soundOn)}
                className="p-1.5 rounded border border-[var(--color-border-subtle)] bg-[var(--color-panel)] text-[var(--color-muted-steel)] hover:text-[var(--color-soft-white)] transition-colors cursor-pointer"
                title={soundOn ? 'Mute sound' : 'Enable sound'}
                aria-label={soundOn ? 'Mute sound' : 'Enable sound'}
              >
                {soundOn ? <Volume2 className="w-4 h-4 text-[#46D19E]" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}
            <span className="font-mono text-xs text-[var(--color-steel)] font-semibold bg-[var(--color-panel)] px-2 sm:px-2.5 py-1 rounded border border-[var(--color-border-subtle)] max-w-[100px] sm:max-w-[160px] truncate">
              {sessionData.participantName}
            </span>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="sm:hidden pt-2">
          <ParticipantProgress
            currentQuestion={currentQIndex + 1}
            totalQuestions={totalQuestions}
            score={sessionData?.score || 0}
            streak={sessionData?.currentStreak || 0}
            isPlayful={isPlayful}
          />
        </div>
      </header>

      {/* Question Presentation Stage */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-4 py-8 sm:px-6">
        <div className="w-full space-y-6 sm:space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            {assessment.timeLimitEnabled && (
              <div className="mb-2">
                <TimerRing
                  secondsLeft={activitySecondsLeft}
                  totalSeconds={totalActivitySeconds}
                  size={68}
                  isPlayful={isPlayful}
                />
              </div>
            )}

            <div className="space-y-2 max-w-3xl w-full px-1">
              <span className="font-mono text-xs uppercase tracking-wider text-[#A91535] font-semibold">
                Question #{currentQIndex + 1} of {totalQuestions}
              </span>
              <div className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--color-soft-white)] leading-snug break-words">
                <MarkdownView content={currentBlock.title} />
              </div>
              {currentBlock.description && (
                <div className="text-xs sm:text-sm text-[var(--color-muted-steel)] max-w-2xl mx-auto leading-relaxed break-words">
                  <MarkdownView content={currentBlock.description} />
                </div>
              )}
            </div>
          </div>

          <div className="w-full max-w-3xl mx-auto">
            {currentBlock.type === 'choice' && (
              <div
                className={cn(
                  'grid gap-3.5',
                  isPlayful
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-1'
                )}
              >
                {currentBlock.options?.map((option, idx) => {
                  const isSelected = selectedAnswer === option.id;
                  const colorKey = option.color || (['coral', 'sky', 'gold', 'mint'][idx % 4]);
                  const tileCfg = tileColors[colorKey] || tileColors.coral;

                  if (isPlayful) {
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelectChoice(option.id)}
                        className={cn(
                          'p-4 sm:p-5 rounded-xl font-bold text-left transition-all duration-150 flex items-start justify-between border-2 cursor-pointer active:scale-98 shadow-md gap-3 min-h-[56px]',
                          tileCfg.bg,
                          tileCfg.border,
                          tileCfg.text,
                          isSelected ? tileCfg.active : 'hover:opacity-95'
                        )}
                      >
                        <div className="flex-1 min-w-0 break-words text-sm sm:text-base leading-snug">
                          <MarkdownView content={option.label || option.text || ''} inline />
                        </div>
                        <span className="shrink-0 text-[10px] sm:text-[11px] font-mono uppercase bg-black/20 px-2 py-0.5 rounded mt-0.5">
                          {tileCfg.label}
                        </span>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectChoice(option.id)}
                      className={cn(
                        'flex items-start gap-3.5 p-4 rounded-lg border text-left transition-all cursor-pointer min-h-[52px]',
                        isSelected
                          ? 'border-[#A91535] bg-[#7A1025]/20 ring-1 ring-[#7A1025]'
                          : 'border-[var(--color-border-subtle)] bg-[var(--color-panel)] hover:border-[var(--color-steel)] hover:bg-[var(--color-panel-elevated)]'
                      )}
                    >
                      {/* Fixed radio circle with shrink-0 aspect-square */}
                      <div
                        className={cn(
                          'shrink-0 aspect-square w-5 h-5 min-w-[1.25rem] min-h-[1.25rem] mt-0.5 rounded-full flex items-center justify-center border transition-colors',
                          isSelected ? 'border-[#A91535] bg-[#A91535] text-white' : 'border-[var(--color-muted-steel)]'
                        )}
                      >
                        {isSelected && <Circle className="w-2 h-2 fill-current shrink-0" />}
                      </div>
                      <div className="flex-1 min-w-0 break-words text-sm text-[var(--color-soft-white)] font-medium">
                        <MarkdownView content={option.label || option.text || ''} inline />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {currentBlock.type === 'checkbox' && (
              <div className="space-y-2.5">
                <span className="block text-[11px] font-mono text-[var(--color-muted-steel)] mb-1">
                  Select all that apply:
                </span>
                {currentBlock.options?.map((option) => {
                  const isSelected = Array.isArray(selectedAnswer) && (selectedAnswer as string[]).includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleToggleCheckbox(option.id)}
                      className={cn(
                        'w-full flex items-start gap-3.5 p-4 rounded-lg border text-left transition-all cursor-pointer min-h-[52px]',
                        isSelected
                          ? 'border-[#A91535] bg-[#7A1025]/20 ring-1 ring-[#7A1025]'
                          : 'border-[var(--color-border-subtle)] bg-[var(--color-panel)] hover:border-[var(--color-steel)]'
                      )}
                    >
                      {/* Fixed checkbox with shrink-0 aspect-square */}
                      <div
                        className={cn(
                          'shrink-0 aspect-square w-5 h-5 min-w-[1.25rem] min-h-[1.25rem] mt-0.5 rounded flex items-center justify-center border transition-colors',
                          isSelected ? 'border-[#A91535] bg-[#A91535] text-white' : 'border-[var(--color-muted-steel)]'
                        )}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      </div>
                      <div className="flex-1 min-w-0 break-words text-sm text-[var(--color-soft-white)] font-medium">
                        <MarkdownView content={option.label || option.text || ''} inline />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {currentBlock.type === 'scale' && (
              <div className="p-5 sm:p-6 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] space-y-6">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--color-muted-steel)]">
                  <span>{currentBlock.scaleMinLabel || 'Minimum'}</span>
                  <span>{currentBlock.scaleMaxLabel || 'Maximum'}</span>
                </div>
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                  {Array.from(
                    { length: (currentBlock.scaleMax || 5) - (currentBlock.scaleMin || 1) + 1 },
                    (_, i) => (currentBlock.scaleMin || 1) + i
                  ).map((val) => {
                    const isSelected = selectedAnswer === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setSelectedAnswer(val)}
                        className={cn(
                          'flex-1 py-3.5 sm:py-4 rounded-lg font-mono text-base font-bold transition-all border cursor-pointer min-h-[48px]',
                          isSelected
                            ? 'bg-[#A91535] border-[#C74B63] text-white scale-105 shadow-md shadow-[#7A1025]/40'
                            : 'bg-[var(--color-charcoal)] border-[var(--color-border-subtle)] text-[var(--color-muted-steel)] hover:text-[var(--color-soft-white)] hover:border-[var(--color-steel)]'
                        )}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentBlock.type === 'text' && (
              <div className="p-5 sm:p-6 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] space-y-3">
                <textarea
                  rows={4}
                  value={typeof selectedAnswer === 'string' ? selectedAnswer : ''}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  placeholder={currentBlock.placeholder || 'Type your response here...'}
                  className="w-full bg-[var(--color-charcoal)] border border-[var(--color-border-subtle)] rounded-lg p-3 text-sm text-[var(--color-soft-white)] placeholder-[var(--color-muted-steel)] focus:outline-none focus:ring-2 focus:ring-[#A91535]"
                />
              </div>
            )}
          </div>

          <div className="max-w-3xl mx-auto flex items-center justify-between pt-4 border-t border-[var(--color-border-subtle)]/60">
            <div>
              {assessment.settings.allowBackNavigation && currentQIndex > 0 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded border border-[var(--color-border-subtle)] bg-[var(--color-panel)] text-xs font-mono text-[var(--color-muted-steel)] hover:text-[var(--color-soft-white)] transition-colors cursor-pointer min-h-[44px]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              className={cn(
                'inline-flex items-center gap-2 rounded bg-[#A91535] px-6 py-2.5 font-mono text-sm font-bold text-white shadow-lg transition-all cursor-pointer min-h-[44px]',
                isPlayful && 'hover:bg-[#C74B63] shadow-[#7A1025]/40 active:scale-95',
                !canProceed && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span>{isLastQuestion ? 'Complete Assessment' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      <ParticipantFooter />
    </div>
  );
};

