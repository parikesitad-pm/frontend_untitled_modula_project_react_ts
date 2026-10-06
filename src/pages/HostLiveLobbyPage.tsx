import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAssessment } from '@/context/useAssessment';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/common/PageHeader';
import { AssessmentNavTabs } from '@/components/dashboard/AssessmentNavTabs';
import { AssessmentBadge } from '@/components/common/AssessmentBadge';
import { 
  Users, 
  Copy, 
  Check, 
  Play, 
  Share2, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Radio
} from 'lucide-react';
import QRCode from 'qrcode';

export const HostLiveLobbyPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const { getAssessmentById, getLiveSession, startLiveSession, resetLiveSession } = useAssessment();

  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const assessment = getAssessmentById(assessmentId || '');
  const session = assessment ? getLiveSession(assessment.id) : null;

  const participantUrl = assessment
    ? `${window.location.origin}/${assessment.slug}/start`
    : '';

  useEffect(() => {
    if (participantUrl) {
      QRCode.toDataURL(participantUrl, {
        width: 240,
        margin: 1.5,
        color: {
          dark: '#181A1C',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [participantUrl]);

  if (!assessment || !session) {
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(participantUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartActivity = () => {
    startLiveSession(assessment.id);
  };

  const handleReset = () => {
    resetLiveSession(assessment.id);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title={`Live Host Lobby: ${assessment.title}`}
          description="Host and project this screen for participants to scan and join in real time."
          breadcrumbs={[
            { label: 'Workspace', href: '/dashboard' },
            { label: assessment.title, href: `/dashboard/${assessment.id}` },
            { label: 'Host Live Lobby' },
          ]}
          badge={
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-semibold bg-[#7A1025]/30 text-[#C74B63] border border-[#7A1025]">
                <Radio className="w-3 h-3 animate-pulse text-[#F0646A]" />
                HOST LOBBY
              </span>
              <AssessmentBadge mode={assessment.mode} size="sm" />
              <AssessmentBadge presentation={assessment.presentationMode} size="sm" />
            </div>
          }
        />

        {/* Sub-Navigation Tabs */}
        <AssessmentNavTabs assessment={assessment} />

        {/* Main Host Arena Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: QR Code, Share Link, and Launch Control */}
          <div className="lg:col-span-5 space-y-5">
            {/* QR Projection Card */}
            <div className="rounded-xl border border-[#7A1025]/50 bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-charcoal)] p-6 text-center space-y-4 shadow-xl">
              <div className="space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#C74B63] font-bold">
                  Scan to Join on Mobile / Laptop
                </span>
                <h3 className="text-lg font-bold text-[var(--color-soft-white)]">
                  Participant Access QR
                </h3>
              </div>

              {/* QR Code Container */}
              <div className="flex justify-center my-2">
                <div className="p-3 bg-white rounded-xl shadow-md border-2 border-[var(--color-border-subtle)] inline-block">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Join QR Code"
                      className="w-48 h-48 object-contain"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center font-mono text-xs text-stone-500">
                      Generating QR...
                    </div>
                  )}
                </div>
              </div>

              {/* URL and Copy */}
              <div className="space-y-2 text-left">
                <label className="block text-[11px] font-mono text-[var(--color-muted-steel)]">
                  Participant Direct URL
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[var(--color-charcoal)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 font-mono text-xs text-[var(--color-steel)] truncate">
                    {participantUrl}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-panel-elevated)] hover:bg-[var(--color-border-subtle)] border border-[var(--color-border-subtle)] text-xs font-mono text-[var(--color-soft-white)] transition-colors cursor-pointer shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Start Activity Primary CTA */}
              <div className="pt-2">
                {session.status === 'lobby' ? (
                  <button
                    type="button"
                    onClick={handleStartActivity}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#A91535] to-[#7A1025] hover:from-[#C74B63] hover:to-[#A91535] font-mono text-sm font-bold text-white shadow-lg shadow-[#7A1025]/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Activity ({session.participants.length} joined)</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Activity is currently LIVE</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-muted-steel)]">
                      Participants are currently submitting responses.
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1 text-xs font-mono text-[var(--color-steel)] hover:underline pt-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to Lobby</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Joined Participant List & Live Counter */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)]/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[var(--color-charcoal)] border border-[var(--color-border-subtle)] text-[#5AA9FF]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-soft-white)] font-mono uppercase tracking-wider">
                      Joined Participants
                    </h3>
                    <span className="text-xs text-[var(--color-muted-steel)]">
                      Real-time arrival presence
                    </span>
                  </div>
                </div>

                <div className="font-mono text-xl font-extrabold text-[#46D19E] bg-[var(--color-charcoal)] px-3 py-1 rounded-lg border border-[var(--color-border-subtle)] tabular-nums">
                  {session.participants.length}
                </div>
              </div>

              {/* Participant Cards Grid */}
              {session.participants.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {session.participants.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-charcoal)] flex items-center gap-2 shadow-sm hover:border-[var(--color-steel)] transition-colors min-w-0"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#7A1025]/30 border border-[#7A1025] flex items-center justify-center font-mono text-xs font-bold text-[#C74B63] shrink-0">
                        {p.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold text-[var(--color-soft-white)] truncate">
                          {p.displayName}
                        </span>
                        <span className="block text-[9px] font-mono text-[var(--color-muted-steel)]">
                          {p.joinedAt}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center border border-dashed border-[var(--color-border-subtle)] rounded-lg bg-[var(--color-charcoal)]/40 space-y-2">
                  <Users className="w-8 h-8 text-[var(--color-muted-steel)] mx-auto opacity-60" />
                  <h4 className="text-sm font-semibold text-[var(--color-soft-white)]">
                    Waiting for participants to join...
                  </h4>
                  <p className="text-xs text-[var(--color-muted-steel)] max-w-sm mx-auto">
                    Display the QR code or share the URL above. Participants will populate here automatically.
                  </p>
                </div>
              )}
            </div>

            {/* Assessment Meta & Settings Snapshot */}
            <div className="p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-panel)] grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5AA9FF] shrink-0" />
                <div>
                  <span className="text-[10px] text-[var(--color-muted-steel)] uppercase block">Time Limit</span>
                  <span className="font-bold text-[var(--color-soft-white)]">
                    {assessment.timeLimitEnabled && assessment.activityTimeLimitSeconds
                      ? `${Math.floor(assessment.activityTimeLimitSeconds / 60)} mins`
                      : 'Untimed'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F4C04E] shrink-0" />
                <div>
                  <span className="text-[10px] text-[var(--color-muted-steel)] uppercase block">Leaderboard</span>
                  <span className="font-bold text-[var(--color-soft-white)]">
                    {assessment.leaderboardEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#46D19E] shrink-0" />
                <div>
                  <span className="text-[10px] text-[var(--color-muted-steel)] uppercase block">Mode</span>
                  <span className="font-bold text-[var(--color-soft-white)] capitalize">
                    {assessment.presentationMode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
