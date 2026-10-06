import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAssessment } from '@/context/useAssessment';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/common/PageHeader';
import { AssessmentNavTabs } from '@/components/dashboard/AssessmentNavTabs';
import { StatsTable } from '@/components/stats/StatsTable';
import { AssessmentBadge } from '@/components/common/AssessmentBadge';
import { Attempt } from '@/domain';
import { Users, BarChart3, Clock, TrendingUp, Trophy } from 'lucide-react';

export const AssessmentStatsPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const { getAssessmentById, submissions } = useAssessment();

  const assessment = getAssessmentById(assessmentId || '');

  if (!assessment) {
    return (
      <AppShell>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold">Assessment not found</h2>
          <Link to="/dashboard" className="text-[#C74B63] hover:underline mt-2 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  const assessmentSubmissions = submissions[assessment.id] || [];

  const completedSubs = assessmentSubmissions.filter((s: Attempt) => s.status === 'completed');
  const inProgressSubs = assessmentSubmissions.filter((s: Attempt) => s.status === 'in_progress');
  const avgTime = completedSubs.length
    ? Math.round(completedSubs.reduce((acc: number, s: Attempt) => acc + s.totalTimeSeconds, 0) / completedSubs.length)
    : 0;

  const passedCount = completedSubs.filter((s: Attempt) => s.percentage >= assessment.settings.passPercentage).length;
  const passRate = completedSubs.length ? Math.round((passedCount / completedSubs.length) * 100) : 0;

  const prePostPairs = completedSubs.filter((s: Attempt) => s.pretestScore !== undefined && s.posttestScore !== undefined);
  const avgDelta = prePostPairs.length
    ? Math.round(
        prePostPairs.reduce((acc: number, s: Attempt) => acc + ((s.posttestScore || 0) - (s.pretestScore || 0)), 0) /
          prePostPairs.length
      )
    : null;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title={`Telemetry & Analytics: ${assessment.title}`}
          description="Detailed participant response logs, score distributions, and performance delta."
          breadcrumbs={[
            { label: 'Workspace', href: '/dashboard' },
            { label: assessment.title, href: `/dashboard/${assessment.id}` },
            { label: 'Stats' },
          ]}
          badge={
            <div className="flex items-center gap-2">
              <AssessmentBadge mode={assessment.mode} size="sm" />
              <AssessmentBadge presentation={assessment.presentationMode} size="sm" />
            </div>
          }
          actions={
            <Link
              to={`/leaderboard/${assessment.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#272A2D] hover:bg-[#34383D] border border-[#34383D] text-xs font-mono text-[#F4C04E] transition-colors"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Open Public Leaderboard</span>
            </Link>
          }
        />

        <AssessmentNavTabs assessment={assessment} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[var(--color-muted-steel)] font-mono text-[11px] uppercase">
              <Users className="w-4 h-4 text-[#5AA9FF]" />
              <span>Submissions Logged</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[var(--color-soft-white)]">
              {assessmentSubmissions.length}
            </div>
            <div className="mt-1 text-[11px] text-[var(--color-muted-steel)]">
              {completedSubs.length} completed · {inProgressSubs.length} active
            </div>
          </div>

          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[var(--color-muted-steel)] font-mono text-[11px] uppercase">
              <BarChart3 className="w-4 h-4 text-[#46D19E]" />
              <span>Pass Rate</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[var(--color-soft-white)]">{passRate}%</div>
            <div className="mt-1 text-[11px] text-[var(--color-muted-steel)]">
              {passedCount} / {completedSubs.length} met ≥{assessment.settings.passPercentage}%
            </div>
          </div>

          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[var(--color-muted-steel)] font-mono text-[11px] uppercase">
              <Clock className="w-4 h-4 text-[#F4C04E]" />
              <span>Avg Completion Time</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[var(--color-soft-white)]">
              {Math.floor(avgTime / 60)}m {avgTime % 60}s
            </div>
            <div className="mt-1 text-[11px] text-[var(--color-muted-steel)]">Per participant average</div>
          </div>

          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[var(--color-muted-steel)] font-mono text-[11px] uppercase">
              <TrendingUp className="w-4 h-4 text-[#C74B63]" />
              <span>Pre → Post Delta</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[var(--color-soft-white)]">
              {avgDelta !== null ? `+${avgDelta}%` : 'N/A'}
            </div>
            <div className="mt-1 text-[11px] text-[var(--color-muted-steel)]">
              {prePostPairs.length > 0 ? `${prePostPairs.length} paired tests` : 'Standard single assessment'}
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-[var(--color-soft-white)] uppercase tracking-wider">
              Participant Records Database
            </h3>
            <span className="text-xs font-mono text-[var(--color-muted-steel)]">
              {assessmentSubmissions.length} records available
            </span>
          </div>

          <StatsTable
            submissions={assessmentSubmissions}
            assessmentTitle={assessment.title}
          />
        </div>
      </div>
    </AppShell>
  );
};

