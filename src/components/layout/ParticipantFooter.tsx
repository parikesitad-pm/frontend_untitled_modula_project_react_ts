import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ParticipantFooterProps {
  className?: string;
}

export const ParticipantFooter: React.FC<ParticipantFooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        'w-full border-t border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] px-4 py-6 font-mono text-xs text-[var(--color-muted-steel)] sm:px-6',
        className
      )}
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-2 text-center">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="font-bold text-[var(--color-soft-white)]">Untitled</span>
          <span>·</span>
          <span>Build. Assess. Play. Your way.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-[var(--color-muted-steel)]">
          <span>Crafted with &lt;3 by</span>
          <a
            href="https://github.com/parikesitad-pm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-steel)] hover:text-[var(--color-soft-white)] underline decoration-[var(--color-border-subtle)] hover:decoration-[#A91535] transition-colors"
          >
            parikesitad-pm
          </a>
          <span>·</span>
          <span>MIT License 2026</span>
          <span>·</span>
          <Link
            to="/modula-project"
            className="text-[#C74B63] hover:text-[var(--color-soft-white)] underline decoration-[#7A1025] hover:decoration-[#A91535] transition-colors font-semibold"
          >
            a MODULA Project
          </Link>
        </div>
      </div>
    </footer>
  );
};

