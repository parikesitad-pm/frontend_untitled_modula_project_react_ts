import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAssessment } from '@/context/useAssessment';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/common/PageHeader';
import { AssessmentNavTabs } from '@/components/dashboard/AssessmentNavTabs';
import { AssessmentBadge } from '@/components/common/AssessmentBadge';
import { BannerUploader } from '@/components/builder/BannerUploader';
import { AssessmentMode, PresentationMode } from '@/domain';
import { 
  Trash2, 
  Copy, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert,
  Clock,
  Image as ImageIcon
} from 'lucide-react';

export const AssessmentSettingsPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { getAssessmentById, updateAssessment, deleteAssessment, duplicateAssessment } = useAssessment();

  const assessment = getAssessmentById(assessmentId || '');

  const [savedMessage, setSavedMessage] = useState(false);

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

  const handleUpdate = (updates: Partial<typeof assessment>) => {
    updateAssessment(assessment.id, updates);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleSettingsUpdate = (settingsUpdates: Partial<typeof assessment.settings>) => {
    updateAssessment(assessment.id, {
      settings: { ...assessment.settings, ...settingsUpdates },
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete "${assessment.title}"?`)) {
      deleteAssessment(assessment.id);
      navigate('/dashboard');
    }
  };

  const handleDuplicate = () => {
    const dup = duplicateAssessment(assessment.id);
    navigate(`/dashboard/${dup.id}`);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <PageHeader
          title={`Settings: ${assessment.title}`}
          description="Configure presentation modes, activity countdown timer, participant leaderboard access, and danger zone actions."
          breadcrumbs={[
            { label: 'Workspace', href: '/dashboard' },
            { label: assessment.title, href: `/dashboard/${assessment.id}` },
            { label: 'Settings' },
          ]}
          badge={
            <div className="flex items-center gap-2">
              <AssessmentBadge mode={assessment.mode} size="sm" />
              <AssessmentBadge presentation={assessment.presentationMode} size="sm" />
            </div>
          }
          actions={
            savedMessage ? (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </span>
            ) : undefined
          }
        />

        <AssessmentNavTabs assessment={assessment} />

        <div className="space-y-6 pt-2">
          {/* Section 1: Presentation Mode & Theme */}
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-5 space-y-4">
            <h3 className="text-sm font-bold font-mono text-[var(--color-soft-white)] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A91535]" />
              <span>1. Presentation Engine Mode</span>
            </h3>
            <p className="text-xs text-[var(--color-muted-steel)]">
              Choose how candidates experience this assessment. The visual presentation is decoupled from the underlying schema.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['formal', 'playful', 'custom'] as PresentationMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleUpdate({ presentationMode: mode })}
                  className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                    assessment.presentationMode === mode
                      ? 'border-[#A91535] bg-[#7A1025]/20 ring-1 ring-[#7A1025]'
                      : 'border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] hover:border-[var(--color-steel)]'
                  }`}
                >
                  <div className="font-semibold text-xs text-[var(--color-soft-white)] capitalize flex items-center gap-1.5">
                    <span>{mode} Mode</span>
                    {mode === 'playful' && <Sparkles className="w-3 h-3 text-[#F4C04E]" />}
                  </div>
                  <p className="text-[11px] text-[var(--color-muted-steel)] mt-1">
                    {mode === 'formal' && 'Clean neutral cards, score hidden during answering, strict test vibe.'}
                    {mode === 'playful' && 'Coral/Sky/Gold/Mint answer tiles, continuous countdown ring, instant points.'}
                    {mode === 'custom' && 'Fine-grained custom control over individual toggles below.'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Assessment Header Banner */}
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-5 space-y-4">
            <h3 className="text-sm font-bold font-mono text-[var(--color-soft-white)] uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#A91535]" />
              <span>2. Assessment Header Banner</span>
            </h3>
            <p className="text-xs text-[var(--color-muted-steel)]">
              Upload an optional wide header banner for your workspace builder and settings overview.
            </p>
            <BannerUploader
              bannerUrl={assessment.bannerUrl}
              onBannerChange={(url) => handleUpdate({ bannerUrl: url })}
            />
          </div>

          {/* Section 2: Activity Timer & Leaderboard Toggles (Revision) */}
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-5 space-y-4">
            <h3 className="text-sm font-bold font-mono text-[var(--color-soft-white)] uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#5AA9FF]" />
              <span>2. Activity Timer & Leaderboard Authority</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              {/* Continuous Activity Timer Toggle */}
              <div className="p-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-[var(--color-soft-white)] block font-sans font-medium">
                      Activity-Level Timer
                    </span>
                    <span className="text-[11px] text-[var(--color-muted-steel)]">
                      One continuous countdown across whole attempt
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={assessment.timeLimitEnabled}
                    onChange={(e) => handleUpdate({ timeLimitEnabled: e.target.checked })}
                    className="accent-[#A91535] w-4 h-4 rounded cursor-pointer"
                  />
                </label>

                {assessment.timeLimitEnabled && (
                  <div className="pt-2 border-t border-[var(--color-border-subtle)]/60">
                    <label className="block text-[10px] uppercase text-[var(--color-muted-steel)] mb-1">
                      Total Activity Duration (Seconds)
                    </label>
                    <input
                      type="number"
                      min="10"
                      step="10"
                      value={assessment.activityTimeLimitSeconds ?? 300}
                      onChange={(e) =>
                        handleUpdate({
                          activityTimeLimitSeconds: parseInt(e.target.value) || 60,
                        })
                      }
                      className="w-full bg-[var(--color-panel)] border border-[var(--color-border-subtle)] rounded px-2.5 py-1 text-xs text-[var(--color-soft-white)] font-mono"
                    />
                    <span className="text-[10px] text-[var(--color-muted-steel)] block mt-0.5">
                      = {Math.floor((assessment.activityTimeLimitSeconds || 300) / 60)} mins{' '}
                      {(assessment.activityTimeLimitSeconds || 300) % 60} secs
                    </span>
                  </div>
                )}
              </div>

              {/* Leaderboard Authority Toggle */}
              <div className="p-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-[var(--color-soft-white)] block font-sans font-medium">
                      Leaderboard Access
                    </span>
                    <span className="text-[11px] text-[var(--color-muted-steel)]">
                      Enable or disable public ranking and podium
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={assessment.leaderboardEnabled}
                    onChange={(e) => handleUpdate({ leaderboardEnabled: e.target.checked })}
                    className="accent-[#A91535] w-4 h-4 rounded cursor-pointer"
                  />
                </label>
                <div className="text-[11px] text-[var(--color-muted-steel)] pt-2 border-t border-[var(--color-border-subtle)]/60">
                  {assessment.leaderboardEnabled
                    ? 'Participants can view live rankings after submitting.'
                    : 'Leaderboard is completely disabled and hidden from participants.'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Assessment Domain Mode */}
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-5 space-y-4">
            <h3 className="text-sm font-bold font-mono text-[var(--color-soft-white)] uppercase tracking-wider">
              3. Assessment Domain Classification
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['quiz', 'pretest', 'posttest', 'task', 'survey', 'form'] as AssessmentMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleUpdate({ mode: m })}
                  className={`px-3 py-2 rounded border text-xs font-mono uppercase font-semibold transition-all cursor-pointer ${
                    assessment.mode === m
                      ? 'border-[#A91535] bg-[#A91535] text-white'
                      : 'border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] text-[var(--color-muted-steel)] hover:text-[var(--color-steel)]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Participant Navigation & Scoring Rules */}
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-5 space-y-4">
            <h3 className="text-sm font-bold font-mono text-[var(--color-soft-white)] uppercase tracking-wider">
              4. Navigation & Passing Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <label className="flex items-center justify-between p-3 rounded border border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] cursor-pointer">
                <div>
                  <span className="text-[var(--color-soft-white)] block font-sans font-medium">Show Score on Finish</span>
                  <span className="text-[11px] text-[var(--color-muted-steel)]">Display total points upon completion</span>
                </div>
                <input
                  type="checkbox"
                  checked={assessment.settings.showScore}
                  onChange={(e) => handleSettingsUpdate({ showScore: e.target.checked })}
                  className="accent-[#A91535] w-4 h-4 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded border border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] cursor-pointer">
                <div>
                  <span className="text-[var(--color-soft-white)] block font-sans font-medium">Allow Back Navigation</span>
                  <span className="text-[11px] text-[var(--color-muted-steel)]">Permit revisiting previous questions</span>
                </div>
                <input
                  type="checkbox"
                  checked={assessment.settings.allowBackNavigation}
                  onChange={(e) => handleSettingsUpdate({ allowBackNavigation: e.target.checked })}
                  className="accent-[#A91535] w-4 h-4 rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono text-[var(--color-muted-steel)] mb-1">
                  Passing Threshold Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={assessment.settings.passPercentage}
                  onChange={(e) =>
                    handleSettingsUpdate({ passPercentage: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[var(--color-charcoal)] border border-[var(--color-border-subtle)] rounded px-3 py-1.5 text-xs text-[var(--color-soft-white)]"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Danger Zone */}
          <div className="rounded-lg border border-red-900/30 bg-[var(--color-panel)] p-5 space-y-4">
            <h3 className="text-sm font-bold font-mono text-red-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Assessment Actions & Danger Zone</span>
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleDuplicate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--color-panel-elevated)] hover:bg-[var(--color-border-subtle)] border border-[var(--color-border-subtle)] text-xs font-mono text-[var(--color-soft-white)] transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Duplicate Assessment</span>
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-xs font-mono text-red-300 transition-colors cursor-pointer ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
