import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { ProductFooter } from '@/components/layout/ProductFooter';
import { ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--color-charcoal)] text-[var(--color-soft-white)] font-mono">
      <header className="w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-charcoal)]/90 py-3.5 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <BrandLogo size="sm" linkTo="/" />
          <Link to="/dashboard" className="text-xs text-[var(--color-muted-steel)] hover:text-[var(--color-soft-white)]">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <span className="text-4xl font-extrabold text-[#A91535]">404</span>
        <h1 className="text-xl sm:text-2xl font-bold font-sans text-[var(--color-soft-white)]">
          Resource Not Found
        </h1>
        <p className="text-xs text-[var(--color-muted-steel)] max-w-md">
          The requested path does not match any active assessment, registry entry, or workspace route.
        </p>

        <div className="flex items-center gap-3 pt-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#A91535] text-xs font-semibold text-white hover:bg-[#C74B63] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go to Dashboard</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[var(--color-border-subtle)] bg-[var(--color-panel)] text-xs text-[var(--color-steel)] hover:text-[var(--color-soft-white)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </Link>
        </div>
      </main>

      <ProductFooter />
    </div>
  );
};

