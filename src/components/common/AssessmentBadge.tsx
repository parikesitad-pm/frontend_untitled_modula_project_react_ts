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
      quiz: { label: 'Quiz', class: 'bg-[#4A0714]/20 text-[#C74B63] border-[#7A1025]' },
      pretest: { label: 'Pretest', class: 'bg-[var(--color-panel-elevated)] text-[#5AA9FF] border-[#3787E0]/40' },
      posttest: { label: 'Posttest', class: 'bg-[var(--color-panel-elevated)] text-[#46D19E] border-[#2BB381]/40' },
      task: { label: 'Task', class: 'bg-[var(--color-panel-elevated)] text-[#F4C04E] border-[#D49D26]/40' },
      survey: { label: 'Survey', class: 'bg-[var(--color-panel-elevated)] text-[var(--color-steel)] border-[var(--color-border-subtle)]' },
      form: { label: 'Form', class: 'bg-[var(--color-panel-elevated)] text-[var(--color-muted-steel)] border-[var(--color-border-subtle)]' },
    };

    const cfg = modeConfig[mode] || { label: mode, class: 'bg-[var(--color-panel-elevated)] text-[var(--color-steel)] border-[var(--color-border-subtle)]' };
    return (
      <span className={cn('font-mono uppercase tracking-wider font-semibold border rounded', cfg.class, sizeClasses, className)}>
        {cfg.label}
      </span>
    );
  }

  if (presentation) {
    const presConfig: Record<PresentationMode, { label: string; class: string }> = {
      formal: { label: 'Formal', class: 'bg-[var(--color-panel-elevated)] text-[var(--color-steel)] border-[var(--color-border-subtle)]' },
      playful: { label: 'Playful', class: 'bg-[#A91535]/15 text-[#C74B63] border-[#7A1025]' },
      custom: { label: 'Custom', class: 'bg-[var(--color-panel-elevated)] text-[#F4C04E] border-[#D49D26]/40' },
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
      draft: { label: 'Draft', dot: 'bg-[var(--color-muted-steel)]', class: 'text-[var(--color-muted-steel)] border-[var(--color-border-subtle)] bg-[var(--color-panel-elevated)]' },
      archived: { label: 'Archived', dot: 'bg-[#7A1025]', class: 'text-[#C74B63] border-[#7A1025]/50 bg-[#4A0714]/20' },
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

