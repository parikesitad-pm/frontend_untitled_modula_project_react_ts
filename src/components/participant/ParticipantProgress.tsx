import React from 'react';
import { cn } from '@/lib/utils';
import { Award, Zap } from 'lucide-react';

interface ParticipantProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  score?: number;
  streak?: number;
  isPlayful?: boolean;
  className?: string;
}

export const ParticipantProgress: React.FC<ParticipantProgressProps> = ({
  currentQuestion,
  totalQuestions,
  score = 0,
  streak = 0,
  isPlayful = false,
  className,
}) => {
  const safeTotal = Math.max(1, totalQuestions);
  const percentage = Math.round((Math.min(currentQuestion, safeTotal) / safeTotal) * 100);

  return (
    <div className={cn('w-full flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-[var(--color-muted-steel)]">
          Question <strong className="text-[var(--color-soft-white)]">{currentQuestion}</strong> of{' '}
          <strong className="text-[var(--color-soft-white)]">{safeTotal}</strong>
        </span>

        {isPlayful ? (
          <div className="flex items-center gap-3">
            {streak > 1 && (
              <span className="flex items-center gap-1 text-[#F4C04E] font-bold animate-bounce">
                <Zap className="w-3.5 h-3.5 fill-[#F4C04E]" />
                {streak}x streak
              </span>
            )}
            <span className="flex items-center gap-1 text-[#46D19E] font-bold">
              <Award className="w-3.5 h-3.5" />
              {score.toLocaleString()} pts
            </span>
          </div>
        ) : (
          <span className="text-[var(--color-steel)]">{percentage}% complete</span>
        )}
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-1.5 bg-[var(--color-panel)] border border-[var(--color-border-subtle)] rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300 rounded-full',
            isPlayful
              ? 'bg-gradient-to-r from-[#A91535] via-[#5AA9FF] to-[#46D19E]'
              : 'bg-[#A91535]'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

