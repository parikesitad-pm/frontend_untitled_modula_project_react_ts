import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Edit3, BarChart2, Settings, Trophy, Radio } from 'lucide-react';
import { Assessment } from '@/domain';

interface AssessmentNavTabsProps {
  assessment: Assessment;
}

export const AssessmentNavTabs: React.FC<AssessmentNavTabsProps> = ({ assessment }) => {
  const tabs = [
    { label: 'Overview', to: `/dashboard/${assessment.id}`, icon: LayoutDashboard, end: true },
    { label: 'Builder', to: `/dashboard/${assessment.id}/builder`, icon: Edit3, end: false },
    { label: 'Stats & Participants', to: `/dashboard/${assessment.id}/stats`, icon: BarChart2, end: false },
    { label: 'Settings', to: `/dashboard/${assessment.id}/settings`, icon: Settings, end: false },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-border-subtle)] gap-2 pb-0">
      <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-2.5 text-xs font-mono font-medium border-b-2 transition-all whitespace-nowrap',
                  isActive
                    ? 'border-[#A91535] text-[var(--color-soft-white)] bg-[var(--color-panel)]/50'
                    : 'border-transparent text-[var(--color-muted-steel)] hover:text-[var(--color-steel)] hover:border-[var(--color-border-subtle)]'
                )
              }
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 pb-2 sm:pb-0">
        {assessment.leaderboardEnabled && (
          <NavLink
            to={`/leaderboard/${assessment.slug}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded text-[#F4C04E] hover:bg-[var(--color-panel-elevated)] border border-[#D49D26]/30 transition-colors"
          >
            <Trophy className="w-3 h-3" />
            <span>Leaderboard</span>
          </NavLink>
        )}
        <NavLink
          to={`/dashboard/${assessment.id}/live`}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold rounded bg-[#A91535] text-white hover:bg-[#C74B63] transition-colors shadow-sm"
        >
          <Radio className="w-3 h-3" />
          <span>Open Live Play (Host Lobby)</span>
        </NavLink>
      </div>
    </div>
  );
};
