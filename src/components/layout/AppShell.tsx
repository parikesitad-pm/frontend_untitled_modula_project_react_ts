import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { ProductFooter } from '@/components/layout/ProductFooter';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useAuth } from '@/context/useAuth';
import { cn } from '@/lib/utils';
import { LayoutDashboard, PlusCircle, Sparkles, LogOut, Shield } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  hideFooter?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  headerRight,
  hideFooter = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Create', path: '/dashboard/new', icon: PlusCircle },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-charcoal)] text-[var(--color-soft-white)]">
      {/* Sticky App Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-charcoal)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <BrandLogo linkTo="/dashboard" size="sm" />

            <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
              {navLinks.map((link) => {
                const isActive =
                  link.path === '/dashboard'
                    ? location.pathname === '/dashboard'
                    : location.pathname.startsWith(link.path);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded transition-colors',
                      isActive
                        ? 'bg-[var(--color-panel-elevated)] text-[var(--color-soft-white)] font-semibold border border-[var(--color-border-subtle)]'
                        : 'text-[var(--color-muted-steel)] hover:text-[var(--color-steel)] hover:bg-[var(--color-panel)]'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Operator Account Control (Sprint 9.5 Auth Shell) */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-[var(--color-border-subtle)]">
                <div className="hidden sm:flex flex-col items-end text-right font-mono text-[11px] leading-tight">
                  <span className="font-semibold text-[var(--color-soft-white)] max-w-[120px] truncate">
                    {user.displayName}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[var(--color-muted-steel)] flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5 text-[#C74B63]" />
                    {user.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign out of workspace"
                  aria-label="Sign out"
                  className="p-1.5 rounded border border-[var(--color-border-subtle)] bg-[var(--color-panel)] hover:bg-red-950/40 hover:border-red-500/40 text-[var(--color-muted-steel)] hover:text-red-300 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {headerRight ? (
              headerRight
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/react-ts-arena/start"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-[#7A1025]/20 text-[#C74B63] border border-[#7A1025] hover:bg-[#A91535] hover:text-white transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Try Arena Mode</span>
                </Link>
                <Link
                  to="/dashboard/new"
                  className="inline-flex items-center gap-1.5 rounded bg-[#A91535] px-3 py-1.5 font-mono text-xs font-medium text-white shadow-sm transition-all hover:bg-[#C74B63] active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Assessment</span>
                  <span className="sm:hidden">Create</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6">
        {children}
      </main>

      {/* Footer */}
      {!hideFooter && <ProductFooter />}
    </div>
  );
};
