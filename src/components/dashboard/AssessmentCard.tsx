import React from 'react';
import { Link } from 'react-router-dom';
import { Assessment } from '@/domain';
import { AssessmentBadge } from '@/components/common/AssessmentBadge';
import { Users, Clock, Edit3, BarChart2, Play, ExternalLink, Settings } from 'lucide-react';

interface AssessmentCardProps {
  assessment: Assessment;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment }) => {
  return (
    <div className="group relative flex flex-col justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-5 transition-all duration-200 hover:border-[#7A1025] hover:bg-[var(--color-panel-elevated)] hover:shadow-lg hover:shadow-[#4A0714]/15">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <AssessmentBadge mode={assessment.mode} size="sm" />
            <AssessmentBadge presentation={assessment.presentationMode} size="sm" />
          </div>
          <AssessmentBadge status={assessment.status} size="sm" />
        </div>

        {/* Title & Description */}
        <Link
          to={`/dashboard/${assessment.id}`}
          className="block group-hover:text-[var(--color-burgundy-bright)] transition-colors"
        >
          <h3 className="text-base font-semibold text-[var(--color-soft-white)] line-clamp-2 break-words">
            {assessment.title}
          </h3>
          <p className="mt-1.5 text-xs text-[var(--color-muted-steel)] line-clamp-2 leading-relaxed break-words">
            {assessment.description || 'No description provided.'}
          </p>
        </Link>
      </div>

      {/* Metrics & Info */}
      <div className="mt-6 pt-4 border-t border-[var(--color-border-subtle)]/60 flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-[var(--color-muted-steel)]">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[var(--color-steel)] shrink-0" />
            <span className="truncate">{assessment.participantCount} users</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-[var(--color-steel)] shrink-0" />
            <span className="truncate">{assessment.averageScore}% avg</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Clock className="w-3.5 h-3.5 text-[var(--color-steel)] shrink-0" />
            <span className="truncate">{assessment.blocks.length} blocks</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--color-border-subtle)]/40">
          <div className="flex items-center gap-1">
            <Link
              to={`/dashboard/${assessment.id}/builder`}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded text-[var(--color-steel)] hover:text-[var(--color-soft-white)] hover:bg-[var(--color-panel)] border border-transparent hover:border-[var(--color-border-subtle)] transition-colors"
              title="Open Builder"
            >
              <Edit3 className="w-3 h-3" />
              <span>Builder</span>
            </Link>
            <Link
              to={`/dashboard/${assessment.id}/stats`}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded text-[var(--color-steel)] hover:text-[var(--color-soft-white)] hover:bg-[var(--color-panel)] border border-transparent hover:border-[var(--color-border-subtle)] transition-colors"
              title="View Analytics"
            >
              <BarChart2 className="w-3 h-3" />
              <span>Stats</span>
            </Link>
            <Link
              to={`/dashboard/${assessment.id}/settings`}
              className="inline-flex items-center p-1.5 text-xs font-mono rounded text-[var(--color-muted-steel)] hover:text-[var(--color-soft-white)] hover:bg-[var(--color-panel)] transition-colors"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Link
            to={`/${assessment.slug}/start`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium rounded bg-[#7A1025]/20 text-[#C74B63] hover:bg-[#A91535] hover:text-white border border-[#7A1025] transition-all"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Play</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </Link>
        </div>
      </div>
    </div>
  );
};

