import React from 'react';
import { cn } from '@/lib/utils';
import { FooterCredit } from '@/components/molecules/FooterCredit';

interface ParticipantFooterProps {
  className?: string;
}

export const ParticipantFooter: React.FC<ParticipantFooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        'w-full border-t border-line bg-canvas px-4 py-6 font-mono text-xs text-muted sm:px-6',
        className
      )}
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-2 text-center">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="font-bold text-ink">QUEICE</span>
          <span>·</span>
          <span>Build. Assess. Play. Your way.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 text-muted">
          <FooterCredit />
          <span aria-hidden="true">·</span>
          <span>MIT License 2026</span>
        </div>
      </div>
    </footer>
  );
};

