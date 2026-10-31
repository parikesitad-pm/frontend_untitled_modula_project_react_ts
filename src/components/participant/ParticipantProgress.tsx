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
        <span className="text-muted">
          Question <strong className="text-ink">{currentQuestion}</strong> of{' '}
          <strong className="text-ink">{safeTotal}</strong>
        </span>

        {isPlayful ? (
          <div className="flex items-center gap-3">
            {streak > 1 && (
              <span className="flex items-center gap-1 text-accent-text font-bold animate-bounce">
                <Zap className="w-3.5 h-3.5 fill-accent-text" />
                {streak}x streak
              </span>
            )}
            <span className="flex items-center gap-1 text-success font-bold">
              <Award className="w-3.5 h-3.5" />
              {score.toLocaleString()} pts
            </span>
          </div>
        ) : (
          <span className="text-ink-soft">{percentage}% complete</span>
        )}
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-1.5 bg-surface border border-line rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300 rounded-full',
            isPlayful
              ? 'bg-gradient-to-r from-accent via-info to-success'
              : 'bg-accent'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

