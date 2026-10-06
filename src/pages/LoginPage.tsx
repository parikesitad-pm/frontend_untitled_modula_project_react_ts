import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { DEV_DEFAULT_OPERATORS } from '@/domain/auth-mock';
import { ShieldCheck, AlertCircle, ArrowRight, Info, X } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, status, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Intended destination after successful login
  const from = (location.state as { from?: { pathname?: string; search?: string } })?.from;
  const destination = from ? `${from.pathname || '/dashboard'}${from.search || ''}` : '/dashboard';

  // If already authenticated, redirect to destination
  useEffect(() => {
    if (status === 'authenticated' && user) {
      navigate(destination, { replace: true });
    }
  }, [status, user, navigate, destination]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Email address is required.');
      return;
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: trimmedEmail, password });
      navigate(destination, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to authenticate. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDevCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--color-charcoal)] text-[var(--color-soft-white)]">
      {/* Top Bar with Theme Toggle */}
      <header className="w-full py-4 px-6 flex items-center justify-between border-b border-[var(--color-border-subtle)]/40">
        <BrandLogo linkTo="/" size="sm" />
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Sign-In Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md space-y-6">
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header / Crest Branding */}
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <BrandLogo size="lg" linkTo="/" />
              </div>
              <div className="pt-2">
                <h1 className="text-lg font-bold text-[var(--color-soft-white)] font-sans">
                  Sign in to your workspace
                </h1>
                <p className="text-xs text-[var(--color-muted-steel)] font-mono mt-1">
                  Operator authentication for Untitled Assessment Engine
                </p>
              </div>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-mono"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-snug">{errorMessage}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="email-input"
                  className="block text-xs font-mono font-medium text-[var(--color-steel)] mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email-input"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@modula.dev"
                  className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] px-3.5 py-2.5 text-sm text-[var(--color-soft-white)] placeholder-[var(--color-muted-steel)] focus:outline-none focus:ring-2 focus:ring-[#A91535] focus:border-transparent transition-all font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password-input"
                    className="block text-xs font-mono font-medium text-[var(--color-steel)]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-mono text-[var(--color-muted-steel)] hover:text-[#C74B63] transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  id="password-input"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] px-3.5 py-2.5 text-sm text-[var(--color-soft-white)] placeholder-[var(--color-muted-steel)] focus:outline-none focus:ring-2 focus:ring-[#A91535] focus:border-transparent transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#A91535] hover:bg-[#C74B63] disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 font-mono text-sm font-bold text-white shadow-lg transition-all cursor-pointer min-h-[44px] active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Development Mock Notice & Quick Fill */}
            <div className="pt-3 border-t border-[var(--color-border-subtle)] space-y-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-muted-steel)]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Development Mock Auth (Sprint 9.5)</span>
              </div>
              <div className="text-[11px] font-mono text-[var(--color-muted-steel)] space-y-1 bg-[var(--color-charcoal)] p-2.5 rounded border border-[var(--color-border-subtle)]/50">
                <div className="text-[10px] uppercase font-bold text-[var(--color-steel)] mb-1">
                  Quick-fill Dev Profiles:
                </div>
                {DEV_DEFAULT_OPERATORS.map((op) => (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => fillDevCredentials(op.email, op.passwordHash)}
                    className="w-full text-left flex items-center justify-between py-1 px-1.5 rounded hover:bg-[var(--color-panel)] text-[11px] transition-colors cursor-pointer group"
                  >
                    <span className="text-[var(--color-steel)] group-hover:text-[var(--color-soft-white)]">
                      {op.displayName} ({op.role})
                    </span>
                    <span className="text-[10px] text-[#C74B63] font-semibold">Use &rarr;</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="text-center text-xs font-mono text-[var(--color-muted-steel)]">
            <span>Looking for participant assessments? </span>
            <Link to="/" className="text-[#C74B63] hover:underline">
              Enter with assessment code
            </Link>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal (Explicitly does NOT fake a reset) */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-[var(--color-soft-white)]">
                <Info className="w-4 h-4 text-[#C74B63]" />
                <span>Password Recovery</span>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1 text-[var(--color-muted-steel)] hover:text-[var(--color-soft-white)] rounded transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[var(--color-muted-steel)] font-mono leading-relaxed">
              Operator accounts and password resets are managed centrally by your MODULA administrator. Please contact your workspace administrator for credential updates.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-full py-2 rounded bg-[var(--color-panel-elevated)] border border-[var(--color-border-subtle)] text-xs font-mono text-[var(--color-soft-white)] hover:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="w-full py-4 text-center font-mono text-[11px] text-[var(--color-muted-steel)] border-t border-[var(--color-border-subtle)]/40">
        Untitled · a MODULA Project
      </footer>
    </div>
  );
};

