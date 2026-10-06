import React, { useState } from 'react';
import { Attempt } from '@/domain';
import { Search, Download, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsTableProps {
  submissions: Attempt[];
  assessmentTitle: string;
}

export const StatsTable: React.FC<StatsTableProps> = ({ submissions, assessmentTitle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress'>('all');

  const filtered = submissions.filter((sub) => {
    const matchesSearch =
      sub.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.email && sub.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Participant Name', 'Email', 'Status', 'Score', 'Max Score', 'Percentage', 'Time (s)', 'Pretest Score', 'Posttest Score', 'Started At', 'Completed At'];
    const rows = filtered.map((s) => [
      `"${s.participantName}"`,
      `"${s.email || ''}"`,
      `"${s.status}"`,
      s.score,
      s.maxScore,
      `${s.percentage}%`,
      s.totalTimeSeconds,
      s.pretestScore ?? '',
      s.posttestScore ?? '',
      `"${s.startedAt}"`,
      `"${s.completedAt || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${assessmentTitle.toLowerCase().replace(/\s+/g, '_')}_stats.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-steel)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search participant name or email..."
              className="w-full bg-[var(--color-panel)] border border-[var(--color-border-subtle)] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[var(--color-soft-white)] placeholder-[var(--color-muted-steel)] focus:outline-none focus:ring-1 focus:ring-[#A91535]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center bg-[var(--color-panel)] border border-[var(--color-border-subtle)] rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setStatusFilter('all')}
              className={cn(
                'px-2.5 py-1 rounded transition-colors cursor-pointer',
                statusFilter === 'all' ? 'bg-[var(--color-panel-elevated)] text-[var(--color-soft-white)] font-semibold' : 'text-[var(--color-muted-steel)] hover:text-[var(--color-steel)]'
              )}
            >
              All ({submissions.length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={cn(
                'px-2.5 py-1 rounded transition-colors cursor-pointer',
                statusFilter === 'completed' ? 'bg-[var(--color-panel-elevated)] text-[var(--color-soft-white)] font-semibold' : 'text-[var(--color-muted-steel)] hover:text-[var(--color-steel)]'
              )}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={cn(
                'px-2.5 py-1 rounded transition-colors cursor-pointer',
                statusFilter === 'in_progress' ? 'bg-[var(--color-panel-elevated)] text-[var(--color-soft-white)] font-semibold' : 'text-[var(--color-muted-steel)] hover:text-[var(--color-steel)]'
              )}
            >
              In Progress
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded bg-[var(--color-panel-elevated)] text-[var(--color-steel)] hover:text-[var(--color-soft-white)] border border-[var(--color-border-subtle)] hover:border-[var(--color-steel)] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[var(--color-charcoal)] border-b border-[var(--color-border-subtle)] text-[var(--color-muted-steel)] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3 font-semibold">Participant</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Score</th>
              <th className="px-4 py-3 font-semibold text-right">Percent</th>
              <th className="px-4 py-3 font-semibold text-right">Duration</th>
              <th className="px-4 py-3 font-semibold text-center">Pre / Post Test</th>
              <th className="px-4 py-3 font-semibold text-right">Completed At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]/60 text-[var(--color-soft-white)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[var(--color-muted-steel)]">
                  No participant submissions match your filter.
                </td>
              </tr>
            ) : (
              filtered.map((sub) => {
                return (
                  <tr key={sub.id} className="hover:bg-[var(--color-panel-elevated)]/60 transition-colors">
                    {/* Participant Details */}
                    <td className="px-4 py-3 font-sans">
                      <div className="font-semibold text-sm text-[var(--color-soft-white)]">{sub.participantName}</div>
                      {sub.email && <div className="text-[11px] font-mono text-[var(--color-muted-steel)]">{sub.email}</div>}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {sub.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      ) : sub.status === 'in_progress' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#5AA9FF] bg-[#5AA9FF]/10 px-2 py-0.5 rounded border border-[#5AA9FF]/30">
                          <Clock className="w-3 h-3" /> In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-muted-steel)] bg-[var(--color-panel-elevated)] px-2 py-0.5 rounded border border-[var(--color-border-subtle)]">
                          <AlertCircle className="w-3 h-3" /> Abandoned
                        </span>
                      )}
                    </td>

                    {/* Score */}
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className="font-semibold">{sub.score}</span>
                      <span className="text-[var(--color-muted-steel)]">/{sub.maxScore}</span>
                    </td>

                    {/* Percentage */}
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">
                      <span
                        className={cn(
                          sub.percentage >= 80
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : sub.percentage >= 60
                            ? 'text-[#F4C04E]'
                            : 'text-[#C74B63]'
                        )}
                      >
                        {sub.percentage}%
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-3 text-right text-[var(--color-muted-steel)] tabular-nums">
                      {Math.floor(sub.totalTimeSeconds / 60)}m {sub.totalTimeSeconds % 60}s
                    </td>

                    {/* Pre vs Post Comparison */}
                    <td className="px-4 py-3 text-center">
                      {sub.pretestScore !== undefined && sub.posttestScore !== undefined ? (
                        <span className="inline-flex items-center gap-1 text-[11px]">
                          <span className="text-[var(--color-muted-steel)]">{sub.pretestScore}%</span>
                          <span className="text-[var(--color-steel)]">→</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{sub.posttestScore - sub.pretestScore}%</span>
                        </span>
                      ) : (
                        <span className="text-[var(--color-muted-steel)] text-[11px]">—</span>
                      )}
                    </td>

                    {/* Timestamp */}
                    <td className="px-4 py-3 text-right text-[var(--color-muted-steel)] text-[11px]">
                      {sub.completedAt ? new Date(sub.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

