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
          <Link to="/dashboard" className="text-accent-text hover:underline mt-2 inline-block">
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
                className="px-3 py-1.5 rounded border border-line bg-raised text-xs font-mono text-ink-soft hover:text-ink transition-colors cursor-pointer"
              >
                {assessment.status === 'active' ? 'Set as Draft' : 'Publish Live'}
              </button>
              <Link
                to={`/dashboard/${assessment.id}/builder`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent text-xs font-mono font-semibold text-on-accent hover:bg-accent-hover transition-colors"
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
          <div className="rounded-lg border border-line bg-surface p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted font-mono text-[11px] uppercase">
              <Users className="w-4 h-4 text-info" />
              <span>Participants</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-ink">
              {assessment.participantCount}
            </div>
            <div className="mt-1 text-[11px] text-muted">Total submissions recorded</div>
          </div>

          <div className="rounded-lg border border-line bg-surface p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted font-mono text-[11px] uppercase">
              <BarChart2 className="w-4 h-4 text-success" />
              <span>Average Score</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-ink">
              {assessment.averageScore}%
            </div>
            <div className="mt-1 text-[11px] text-muted">Passing threshold: {assessment.settings.passPercentage}%</div>
          </div>

          <div className="rounded-lg border border-line bg-surface p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted font-mono text-[11px] uppercase">
              <CheckCircle2 className="w-4 h-4 text-accent-text" />
              <span>Completion Rate</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-ink">
              {assessment.completionRate}%
            </div>
            <div className="mt-1 text-[11px] text-muted">Finished without abandonment</div>
          </div>

          <div className="rounded-lg border border-line bg-surface p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted font-mono text-[11px] uppercase">
              <Layers className="w-4 h-4 text-accent-text" />
              <span>Block Schema</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-ink">
              {questionsCount} questions
            </div>
            <div className="mt-1 text-[11px] text-muted">{assessment.blocks.length} total blocks</div>
          </div>
        </div>

        <div className="rounded-lg border border-accent-deep/50 bg-gradient-to-r from-accent-tint/20 via-surface to-surface p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent-text font-bold">
                <Share2 className="w-4 h-4" />
                <span>Participant Access Link</span>
              </div>
              <p className="text-xs text-muted">
                Distribute this URL to candidates or project it on display screens for live arena sessions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-canvas border border-line rounded px-3 py-1.5 font-mono text-xs text-ink-soft max-w-xs truncate">
                /{assessment.slug}/start
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-raised hover:bg-line border border-line text-xs font-mono text-ink transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <Link
                to={`/dashboard/${assessment.id}/live`}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded bg-accent hover:bg-accent-hover text-xs font-mono font-semibold text-on-accent transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Open Host Lobby</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-ink uppercase tracking-wider">
              Assessment Block Structure
            </h3>
            <Link
              to={`/dashboard/${assessment.id}/builder`}
              className="inline-flex items-center gap-1 text-xs font-mono text-accent-text hover:underline"
            >
              <span>Edit in Builder</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {assessment.blocks.map((block: Question, idx: number) => (
              <div
                key={block.id}
                className="flex items-center justify-between p-3 rounded border border-line bg-canvas text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted font-bold">#{idx + 1}</span>
                  <span className="px-1.5 py-0.5 rounded bg-raised text-ink-soft uppercase text-[10px]">
                    {block.type.replace('_', ' ')}
                  </span>
                  <span className="font-sans font-medium text-ink line-clamp-1">{block.title}</span>
                </div>

                <div className="flex items-center gap-4 text-muted">
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

