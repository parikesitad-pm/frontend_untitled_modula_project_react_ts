import React from 'react';
import { Link } from 'react-router-dom';

export const ProductFooter: React.FC = () => {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] px-4 py-8 font-mono text-xs text-[var(--color-muted-steel)] sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
          <span className="font-bold text-[var(--color-soft-white)]">Untitled</span>
          <span>·</span>
          <span>Build. Assess. Play. Your way.</span>
          <span>·</span>
          <span>MIT License 2026</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[var(--color-steel)]">
          <Link to="/dashboard" className="hover:text-[var(--color-soft-white)] transition-colors">
            Dashboard
          </Link>
          <Link to="/dashboard/new" className="hover:text-[var(--color-soft-white)] transition-colors">
            New Assessment
          </Link>
          <span className="text-[var(--color-border-subtle)]">|</span>
          <div className="flex items-center gap-1.5">
            <span>Crafted with &lt;3 by</span>
            <a
              href="https://github.com/parikesitad-pm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C74B63] hover:text-[var(--color-soft-white)] underline decoration-[#7A1025] hover:decoration-[#A91535] transition-colors font-semibold"
            >
              parikesitad-pm
            </a>
            <span>·</span>
            <Link
              to="/modula-project"
              className="text-[#C74B63] hover:text-[var(--color-soft-white)] underline decoration-[#7A1025] hover:decoration-[#A91535] transition-colors font-semibold"
            >
              a MODULA Project
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
