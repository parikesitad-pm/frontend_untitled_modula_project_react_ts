import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAssessment } from '@/context/useAssessment';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/common/PageHeader';
import { AssessmentNavTabs } from '@/components/dashboard/AssessmentNavTabs';
import { AssessmentBadge } from '@/components/common/AssessmentBadge';
import { AssessmentBanner } from '@/components/common/AssessmentBanner';
import { Question } from '@/domain';
import { 
  Play, 
  Edit3, 
  Copy, 
  Check, 
  Users, 
  BarChart2, 
  CheckCircle2, 
  Share2, 
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AssessmentOverviewPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const { getAssessmentById, updateAssessment } = useAssessment();
  const [copied, setCopied] = useState(false);

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

  const shareUrl = `${window.location.origin}/${assessment.slug}/start`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleStatus = () => {
    const nextStatus = assessment.status === 'active' ? 'draft' : 'active';
    updateAssessment(assessment.id, { status: nextStatus });
  };

  const questionsCount = assessment.blocks.filter((b: Question) =>
    ['choice', 'checkbox', 'text', 'scale'].includes(b.type)
  ).length;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title={assessment.title}
          description={assessment.description}
          breadcrumbs={[
            { label: 'Workspace', href: '/dashboard' },
            { label: assessment.title },
          ]}
          badge={
            <div className="flex items-center gap-2">
              <AssessmentBadge mode={assessment.mode} size="sm" />
              <AssessmentBadge presentation={assessment.presentationMode} size="sm" />
              <AssessmentBadge status={assessment.status} size="sm" />
            </div>
          }
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleStatus}
                className="px-3 py-1.5 rounded border border-[var(--color-border-subtle)] bg-[var(--color-panel-elevated)] text-xs font-mono text-[var(--color-steel)] hover:text-[var(--color-soft-white)] transition-colors cursor-pointer"
              >
                {assessment.status === 'active' ? 'Set as Draft' : 'Publish Live'}
              </button>
              <Link
                to={`/dashboard/${assessment.id}/builder`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#A91535] text-xs font-mono font-semibold text-white hover:bg-[#C74B63] transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Open Builder</span>
              </Link>
            </div>
          }
        />

        <AssessmentNavTabs assessment={assessment} />

        {assessment.bannerUrl && (
          <AssessmentBanner
            bannerUrl={assessment.bannerUrl}
            title={assessment.title}
            aspectRatio="wide"
          />
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[var(--color-muted-steel)] font-mono text-[11px] uppercase">
              <Users className="w-4 h-4 text-[#5AA9FF]" />
              <span>Participants</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[var(--color-soft-white)]">
              {assessment.participantCount}
            </div>
            <div className="mt-1 text-[11px] text-[var(--color-muted-steel)]">Total submissions recorded</div>
          </div>

          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[var(--color-muted-steel)] font-mono text-[11px] uppercase">
              <BarChart2 className="w-4 h-4 text-[#46D19E]" />
              <span>Average Score</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[var(--color-soft-white)]">
              {assessment.averageScore}%
            </div>
            <div className="mt-1 text-[11px] text-[var(--color-muted-steel)]">Passing threshold: {assessment.settings.passPercentage}%</div>
          </div>

          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[var(--color-muted-steel)] font-mono text-[11px] uppercase">
              <CheckCircle2 className="w-4 h-4 text-[#F4C04E]" />
              <span>Completion Rate</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[var(--color-soft-white)]">
              {assessment.completionRate}%
            </div>
            <div className="mt-1 text-[11px] text-[var(--color-muted-steel)]">Finished without abandonment</div>
          </div>

          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[var(--color-muted-steel)] font-mono text-[11px] uppercase">
              <Layers className="w-4 h-4 text-[#C74B63]" />
              <span>Block Schema</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[var(--color-soft-white)]">
              {questionsCount} questions
            </div>
            <div className="mt-1 text-[11px] text-[var(--color-muted-steel)]">{assessment.blocks.length} total blocks</div>
          </div>
        </div>

        <div className="rounded-lg border border-[#7A1025]/50 bg-gradient-to-r from-[#4A0714]/20 via-[var(--color-panel)] to-[var(--color-panel)] p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C74B63] font-bold">
                <Share2 className="w-4 h-4" />
                <span>Participant Access Link</span>
              </div>
              <p className="text-xs text-[var(--color-muted-steel)]">
                Distribute this URL to candidates or project it on display screens for live arena sessions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[var(--color-charcoal)] border border-[var(--color-border-subtle)] rounded px-3 py-1.5 font-mono text-xs text-[var(--color-steel)] max-w-xs truncate">
                /{assessment.slug}/start
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--color-panel-elevated)] hover:bg-[var(--color-border-subtle)] border border-[var(--color-border-subtle)] text-xs font-mono text-[var(--color-soft-white)] transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <Link
                to={`/dashboard/${assessment.id}/live`}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#A91535] hover:bg-[#C74B63] text-xs font-mono font-semibold text-white transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Open Host Lobby</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-[var(--color-soft-white)] uppercase tracking-wider">
              Assessment Block Structure
            </h3>
            <Link
              to={`/dashboard/${assessment.id}/builder`}
              className="inline-flex items-center gap-1 text-xs font-mono text-[#C74B63] hover:underline"
            >
              <span>Edit in Builder</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {assessment.blocks.map((block: Question, idx: number) => (
              <div
                key={block.id}
                className="flex items-center justify-between p-3 rounded border border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[var(--color-muted-steel)] font-bold">#{idx + 1}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[var(--color-panel-elevated)] text-[var(--color-steel)] uppercase text-[10px]">
                    {block.type.replace('_', ' ')}
                  </span>
                  <span className="font-sans font-medium text-[var(--color-soft-white)] line-clamp-1">{block.title}</span>
                </div>

                <div className="flex items-center gap-4 text-[var(--color-muted-steel)]">
                  {block.points !== undefined && (
                    <span>{block.points} pts</span>
                  )}
                  {block.timeLimitSeconds && (
                    <span>{block.timeLimitSeconds}s</span>
                  )}
                  {block.options && (
                    <span>{block.options.length} options</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

