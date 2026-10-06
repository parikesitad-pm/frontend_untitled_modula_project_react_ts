import React, { useState, useRef, useEffect } from 'react';
import { AppTheme } from '@/context/ThemeContext';
import { useTheme } from '@/context/useTheme';
import { Moon, Sun, Laptop } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { value: AppTheme; label: string; icon: React.ElementType }[] = [
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'system', label: 'System', icon: Laptop },
  ];

  const CurrentIcon = resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] text-[var(--color-steel)] hover:text-[var(--color-soft-white)] hover:bg-[var(--color-panel-elevated)] transition-colors cursor-pointer"
        title={`Theme: ${theme} (${resolvedTheme})`}
        aria-label="Toggle Theme"
      >
        <CurrentIcon className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-32 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel-elevated)] shadow-xl z-50 py-1 font-mono text-xs">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setTheme(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-[var(--color-burgundy)] text-white font-semibold'
                    : 'text-[var(--color-steel)] hover:bg-[var(--color-panel)] hover:text-[var(--color-soft-white)]'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
