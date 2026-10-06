import React, { useState } from 'react';
import { useAssessment } from '@/context/useAssessment';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/common/PageHeader';
import { AssessmentCard } from '@/components/dashboard/AssessmentCard';
import { EmptyState } from '@/components/common/EmptyState';
import { PlusCircle, Search, Layers, Users, BarChart2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const DashboardPage: React.FC = () => {
  const { assessments } = useAssessment();
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState<string>('all');

  const filteredAssessments = assessments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = modeFilter === 'all' || a.mode === modeFilter;
    return matchesSearch && matchesMode;
  });

  const totalAssessments = assessments.length;
  const totalParticipants = assessments.reduce((acc, a) => acc + a.participantCount, 0);
  const activeAssessments = assessments.filter((a) => a.status === 'active').length;
  const avgOverallScore = assessments.length
    ? Math.round(assessments.reduce((acc, a) => acc + a.averageScore, 0) / assessments.length)
    : 0;

  const modeFilters: { key: string; label: string }[] = [
    { key: 'all', label: 'All Modes' },
    { key: 'quiz', label: 'Quiz' },
    { key: 'pretest', label: 'Pretest' },
    { key: 'posttest', label: 'Posttest' },
    { key: 'task', label: 'Task' },
    { key: 'survey', label: 'Survey' },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          title="Assessment Workspace"
          description="Design modular assessments, manage live participation sessions, and inspect system telemetry."
          actions={
            <Link
              to="/dashboard/new"
              className="inline-flex items-center gap-1.5 rounded bg-[#A91535] px-4 py-2 font-mono text-xs font-semibold text-white shadow-sm hover:bg-[#C74B63] transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Assessment</span>
            </Link>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-4 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded bg-[var(--color-panel-elevated)] text-[var(--color-steel)] border border-[var(--color-border-subtle)]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted-steel)]">Assessments</div>
              <div className="text-xl font-bold text-[var(--color-soft-white)] font-mono">{totalAssessments}</div>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-4 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted-steel)]">Active Live</div>
              <div className="text-xl font-bold text-[var(--color-soft-white)] font-mono">{activeAssessments}</div>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-4 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded bg-[#5AA9FF]/10 text-[#5AA9FF] border border-[#3787E0]/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted-steel)]">Total Participants</div>
              <div className="text-xl font-bold text-[var(--color-soft-white)] font-mono">{totalParticipants}</div>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-4 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded bg-[#7A1025]/30 text-[#C74B63] border border-[#7A1025]">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted-steel)]">Avg Score</div>
              <div className="text-xl font-bold text-[var(--color-soft-white)] font-mono">{avgOverallScore}%</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-steel)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter assessments by title..."
              className="w-full bg-[var(--color-panel)] border border-[var(--color-border-subtle)] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[var(--color-soft-white)] placeholder-[var(--color-muted-steel)] focus:outline-none focus:ring-1 focus:ring-[#A91535]"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 font-mono text-xs">
            {modeFilters.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setModeFilter(tab.key)}
                className={cn(
                  'px-2.5 py-1 rounded border transition-colors whitespace-nowrap cursor-pointer',
                  modeFilter === tab.key
                    ? 'bg-[var(--color-panel-elevated)] text-[var(--color-soft-white)] border-[var(--color-steel)] font-semibold'
                    : 'bg-[var(--color-panel)] text-[var(--color-muted-steel)] border-[var(--color-border-subtle)] hover:text-[var(--color-steel)]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredAssessments.length === 0 ? (
          <EmptyState
            title="No assessments found"
            description="Create your first assessment or adjust search filters to get started."
            action={
              <Link
                to="/dashboard/new"
                className="inline-flex items-center gap-1.5 rounded bg-[#A91535] px-4 py-2 font-mono text-xs font-semibold text-white shadow-sm hover:bg-[#C74B63] transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Assessment</span>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAssessments.map((assessment) => (
              <AssessmentCard key={assessment.id} assessment={assessment} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

