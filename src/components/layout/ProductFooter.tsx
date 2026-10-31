import React from 'react';
import { Link } from 'react-router-dom';
import { FooterCredit } from '@/components/molecules/FooterCredit';

export const ProductFooter: React.FC = () => {
  return (
    <footer className="border-t border-line bg-canvas px-4 py-8 font-mono text-xs text-muted sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
          <span className="font-bold text-ink">QUEICE</span>
          <span>·</span>
          <span>Build. Assess. Play. Your way.</span>
          <span>·</span>
          <span>MIT License 2026</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-ink-soft">
          <Link to="/dashboard" className="hover:text-ink transition-colors">
            Dashboard
          </Link>
          <Link to="/dashboard/new" className="hover:text-ink transition-colors">
            New Assessment
          </Link>
          <span aria-hidden="true" className="hidden text-line sm:inline">|</span>
          <FooterCredit />
        </div>
      </div>
    </footer>
  );
};
