import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/context/useAssessment';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/common/PageHeader';
import { AssessmentMode, PresentationMode } from '@/domain';
import { 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Target, 
  ListOrdered, 
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const NewAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { createAssessment } = useAssessment();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [mode, setMode] = useState<AssessmentMode>('quiz');
  const [presentationMode, setPresentationMode] = useState<PresentationMode>('playful');
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(true);
  const [activityTimeLimitSeconds, setActivityTimeLimitSeconds] = useState(300);
  const [leaderboardEnabled, setLeaderboardEnabled] = useState(true);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAssessment = createAssessment({
      title: title.trim(),
      description: description.trim(),
      slug: slug.trim() || undefined,
      mode,
      presentationMode,
      timeLimitEnabled,
      activityTimeLimitSeconds: timeLimitEnabled ? activityTimeLimitSeconds : null,
      leaderboardEnabled,
    });

    navigate(`/dashboard/${newAssessment.id}/builder`);
  };

  const modes: { mode: AssessmentMode; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: 'quiz', label: 'Interactive Quiz', desc: 'Fast-paced, scored questions with optional leaderboard', icon: Sparkles },
    { mode: 'pretest', label: 'Technical Pretest', desc: 'Baseline evaluation before workshops or training', icon: Target },
    { mode: 'posttest', label: 'Posttest Exam', desc: 'Comprehensive mastery assessment with comparison analytics', icon: CheckCircle2 },
    { mode: 'task', label: 'Structured Task', desc: 'Scenario reviews, assignments, or incident drills', icon: ListOrdered },
    { mode: 'survey', label: 'Feedback Survey', desc: 'Unscored rating scales, text inputs, and feedback', icon: FileText },
  ];

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-8">
        <PageHeader
          title="Create New Assessment"
          description="Configure the fundamental mode, activity duration, and presentation style for your new assessment."
          breadcrumbs={[
            { label: 'Workspace', href: '/dashboard' },
            { label: 'New Assessment' },
          ]}
        />

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="rounded-lg border border-line bg-surface p-5 space-y-4">
            <h3 className="text-sm font-bold font-mono text-ink uppercase tracking-wider">
              1. General Details
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-muted">Assessment Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Distributed Systems & Consensus Pretest"
                className="w-full bg-canvas border border-line rounded-lg px-3.5 py-2 text-sm text-ink placeholder-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-muted">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of the goals, instructions, or topics covered..."
                className="w-full bg-canvas border border-line rounded-lg px-3.5 py-2 text-xs text-ink placeholder-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-muted">Custom URL Slug</label>
              <div className="flex items-center">
                <span className="bg-canvas border border-r-0 border-line px-3 py-2 text-xs font-mono text-muted rounded-l-lg">
                  {window.location.host}/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="systems-consensus-pretest"
                  className="flex-1 bg-canvas border border-line rounded-r-lg px-3 py-2 text-xs font-mono text-ink placeholder-muted focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-surface p-5 space-y-4">
            <h3 className="text-sm font-bold font-mono text-ink uppercase tracking-wider">
              2. Select Assessment Mode
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {modes.map((item) => {
                const Icon = item.icon;
                const isSelected = mode === item.mode;
                return (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setMode(item.mode)}
                    className={cn(
                      'flex items-start gap-3 p-3.5 rounded-lg border text-left transition-all cursor-pointer',
                      isSelected
                        ? 'border-accent bg-accent-deep/20 ring-1 ring-accent-deep'
                        : 'border-line bg-canvas hover:border-ink-soft'
                    )}
                  >
                    <div
                      className={cn(
                        'p-2 rounded',
                        isSelected ? 'bg-accent text-on-accent' : 'bg-raised text-muted'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-ink">{item.label}</div>
                      <div className="text-[11px] text-muted mt-0.5 leading-snug">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity Timer & Leaderboard Options */}
          <div className="rounded-lg border border-line bg-surface p-5 space-y-4">
            <h3 className="text-sm font-bold font-mono text-ink uppercase tracking-wider">
              3. Activity Timer & Leaderboard
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-lg border border-line bg-canvas space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-ink block font-sans font-medium">Activity Timer</span>
                    <span className="text-[11px] text-muted">Continuous countdown</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={timeLimitEnabled}
                    onChange={(e) => setTimeLimitEnabled(e.target.checked)}
                    className="accent-accent w-4 h-4 rounded cursor-pointer"
                  />
                </label>
                {timeLimitEnabled && (
                  <div className="pt-2 border-t border-line/60">
                    <label className="block text-[10px] text-muted mb-1 uppercase">Duration (Seconds)</label>
                    <input
                      type="number"
                      min="10"
                      step="10"
                      value={activityTimeLimitSeconds}
                      onChange={(e) => setActivityTimeLimitSeconds(parseInt(e.target.value) || 60)}
                      className="w-full bg-surface border border-line rounded px-2.5 py-1 text-xs text-ink font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg border border-line bg-canvas space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-ink block font-sans font-medium">Enable Leaderboard</span>
                    <span className="text-[11px] text-muted">Show podium & ranking</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={leaderboardEnabled}
                    onChange={(e) => setLeaderboardEnabled(e.target.checked)}
                    className="accent-accent w-4 h-4 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-surface p-5 space-y-4">
            <h3 className="text-sm font-bold font-mono text-ink uppercase tracking-wider">
              4. Presentation Style
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPresentationMode('formal')}
                className={cn(
                  'p-4 rounded-lg border text-left transition-all cursor-pointer',
                  presentationMode === 'formal'
                    ? 'border-accent bg-accent-deep/20 ring-1 ring-accent-deep'
                    : 'border-line bg-canvas hover:border-ink-soft'
                )}
              >
                <div className="font-semibold text-xs text-ink">Formal & Clean</div>
                <p className="text-[11px] text-muted mt-1">
                  Neutral panels, restrained burgundy accents, score hidden during answering.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPresentationMode('playful')}
                className={cn(
                  'p-4 rounded-lg border text-left transition-all cursor-pointer',
                  presentationMode === 'playful'
                    ? 'border-accent bg-accent-deep/20 ring-1 ring-accent-deep'
                    : 'border-line bg-canvas hover:border-ink-soft'
                )}
              >
                <div className="font-semibold text-xs text-ink flex items-center gap-1.5">
                  <span>Playful Arena</span>
                  <Sparkles className="w-3 h-3 text-accent-text" />
                </div>
                <p className="text-[11px] text-muted mt-1">
                  Coral/Sky/Gold/Mint tiles, live timer countdown ring, instant points.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPresentationMode('custom')}
                className={cn(
                  'p-4 rounded-lg border text-left transition-all cursor-pointer',
                  presentationMode === 'custom'
                    ? 'border-accent bg-accent-deep/20 ring-1 ring-accent-deep'
                    : 'border-line bg-canvas hover:border-ink-soft'
                )}
              >
                <div className="font-semibold text-xs text-ink">Custom Blend</div>
                <p className="text-[11px] text-muted mt-1">
                  Configure individual timer, leaderboard, and color presentation rules.
                </p>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 font-mono text-xs text-muted hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="inline-flex items-center gap-2 rounded bg-accent px-6 py-2.5 font-mono text-xs font-semibold text-on-accent shadow-sm hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Initialize Builder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
};
