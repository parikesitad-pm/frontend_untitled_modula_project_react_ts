import React from 'react';
import { LeaderboardEntry } from '@/domain';
import { cn } from '@/lib/utils';
import { Crown, Trophy, Medal } from 'lucide-react';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isTopFive?: boolean;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ entry, isTopFive = false }) => {
  const rankIcons: Record<number, { icon: React.ElementType; color: string; bg: string }> = {
    1: { icon: Crown, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300' },
    2: { icon: Trophy, color: 'text-slate-500 dark:text-slate-300', bg: 'bg-slate-500/10 border-slate-400/40 text-slate-700 dark:text-slate-200' },
    3: { icon: Medal, color: 'text-amber-700 dark:text-amber-500', bg: 'bg-amber-700/10 border-amber-700/40 text-amber-800 dark:text-amber-400' },
    4: { icon: Trophy, color: 'text-[var(--color-steel)]', bg: 'bg-[var(--color-panel-elevated)] border-[var(--color-border-subtle)] text-[var(--color-steel)]' },
    5: { icon: Trophy, color: 'text-[var(--color-muted-steel)]', bg: 'bg-[var(--color-panel-elevated)] border-[var(--color-border-subtle)] text-[var(--color-muted-steel)]' },
  };

  const rankConfig = rankIcons[entry.rank];
  const Icon = rankConfig?.icon;

  if (isTopFive && entry.rank <= 3) {
    return (
      <div
        className={cn(
          'relative flex flex-col items-center justify-between p-5 rounded-lg border transition-all duration-200',
          entry.rank === 1
            ? 'border-amber-500/50 bg-gradient-to-b from-[var(--color-panel-elevated)] to-[var(--color-panel)] shadow-lg shadow-amber-500/10 sm:scale-105 z-10'
            : 'border-[var(--color-border-subtle)] bg-[var(--color-panel)]'
        )}
      >
        <div className="flex flex-col items-center gap-2 text-center w-full">
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center border font-bold text-lg font-mono shadow-inner shrink-0',
              rankConfig.bg
            )}
          >
            {Icon ? <Icon className={cn('w-6 h-6', rankConfig.color)} /> : entry.rank}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted-steel)]">
            Rank #{entry.rank}
          </span>
          <h4 className="text-base font-bold text-[var(--color-soft-white)] truncate max-w-full px-1">{entry.participantName}</h4>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)]/60 w-full flex items-center justify-between font-mono text-xs">
          <span className="text-[var(--color-muted-steel)]">{entry.timeSeconds}s</span>
          <span className="font-bold text-[#46D19E] text-sm">{entry.score.toLocaleString()} pts</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3 rounded-lg border transition-colors',
        entry.rank <= 5 ? 'bg-[var(--color-panel)] border-[var(--color-border-subtle)] hover:border-[#7A1025]' : 'bg-[var(--color-charcoal)] border-[var(--color-border-subtle)]/60 hover:bg-[var(--color-panel)]/50'
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={cn(
            'w-7 h-7 rounded flex items-center justify-center font-mono text-xs font-bold border shrink-0',
            entry.rank <= 5 && rankConfig ? rankConfig.bg : 'bg-[var(--color-panel-elevated)] border-[var(--color-border-subtle)] text-[var(--color-muted-steel)]'
          )}
        >
          {entry.rank}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-[var(--color-soft-white)] truncate">{entry.participantName}</span>
          <span className="font-mono text-[10px] text-[var(--color-muted-steel)]">{entry.completedAt}</span>
        </div>
      </div>

      <div className="flex items-center gap-6 font-mono text-xs shrink-0">
        <span className="text-[var(--color-muted-steel)]">{entry.timeSeconds}s</span>
        <span className="font-bold text-[#46D19E] min-w-[70px] text-right">
          {entry.score.toLocaleString()} pts
        </span>
      </div>
    </div>
  );
};

