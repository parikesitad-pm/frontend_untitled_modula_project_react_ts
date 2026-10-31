import React from 'react';
import { cn } from '@/lib/utils';
import { AssessmentMode, PresentationMode, AssessmentStatus } from '@/domain';

interface AssessmentBadgeProps {
  mode?: AssessmentMode;
  presentation?: PresentationMode;
  status?: AssessmentStatus;
  className?: string;
  size?: 'sm' | 'md';
}

export const AssessmentBadge: React.FC<AssessmentBadgeProps> = ({
  mode,
  presentation,
  status,
  className,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

  if (mode) {
    const modeConfig: Record<AssessmentMode, { label: string; class: string }> = {
      quiz: { label: 'Quiz', class: 'bg-accent-tint/20 text-accent-text border-accent-deep' },
      pretest: { label: 'Pretest', class: 'bg-raised text-info border-info/40' },
      posttest: { label: 'Posttest', class: 'bg-raised text-success border-success/40' },
      task: { label: 'Task', class: 'bg-raised text-accent-text border-accent-deep/40' },
      survey: { label: 'Survey', class: 'bg-raised text-ink-soft border-line' },
      form: { label: 'Form', class: 'bg-raised text-muted border-line' },
    };

    const cfg = modeConfig[mode] || { label: mode, class: 'bg-raised text-ink-soft border-line' };
    return (
      <span className={cn('font-mono uppercase tracking-wider font-semibold border rounded', cfg.class, sizeClasses, className)}>
        {cfg.label}
      </span>
    );
  }

  if (presentation) {
    const presConfig: Record<PresentationMode, { label: string; class: string }> = {
      formal: { label: 'Formal', class: 'bg-raised text-ink-soft border-line' },
      playful: { label: 'Playful', class: 'bg-accent/15 text-accent-text border-accent-deep' },
      custom: { label: 'Custom', class: 'bg-raised text-accent-text border-accent-deep/40' },
    };

    const cfg = presConfig[presentation];
    return (
      <span className={cn('font-mono uppercase tracking-wider font-medium border rounded', cfg.class, sizeClasses, className)}>
        {cfg.label}
      </span>
    );
  }

  if (status) {
    const statusConfig = {
      active: { label: 'Live', dot: 'bg-emerald-400 animate-pulse', class: 'text-emerald-600 dark:text-emerald-300 border-emerald-500/30 bg-emerald-950/20' },
      draft: { label: 'Draft', dot: 'bg-muted', class: 'text-muted border-line bg-raised' },
      archived: { label: 'Archived', dot: 'bg-accent-deep', class: 'text-accent-text border-accent-deep/50 bg-accent-tint/20' },
    };

    const cfg = statusConfig[status];
    return (
      <span className={cn('inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-medium border rounded', cfg.class, sizeClasses, className)}>
        <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
        {cfg.label}
      </span>
    );
  }

  return null;
};

