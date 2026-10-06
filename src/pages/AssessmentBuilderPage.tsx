import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAssessment } from '@/context/useAssessment';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/common/PageHeader';
import { AssessmentNavTabs } from '@/components/dashboard/AssessmentNavTabs';
import { BuilderBlock } from '@/components/builder/BuilderBlock';
import { BlockToolbar } from '@/components/builder/BlockToolbar';
import { AssessmentBadge } from '@/components/common/AssessmentBadge';
import { BannerUploader } from '@/components/builder/BannerUploader';
import { BlockType, QuestionDraft } from '@/domain';
import { Play, CheckCircle2 } from 'lucide-react';

export const AssessmentBuilderPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const {
    getAssessmentById,
    updateAssessment,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,
  } = useAssessment();

  const [saveStatus, setSaveStatus] = useState<string>('Saved');

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

  const triggerSaveNotify = () => {
    setSaveStatus('Saving...');
    setTimeout(() => setSaveStatus('All changes saved'), 400);
  };

  const handleAddBlock = (type: BlockType) => {
    let newBlockData: QuestionDraft;

    if (type === 'choice' || type === 'single_choice') {
      newBlockData = {
        type,
        title: 'Untitled Question',
        description: '',
        required: true,
        points: 20,
        options: [
          { id: 'opt-1', label: 'Option A', value: 'opt-1', text: 'Option A', isCorrect: true, color: 'coral' },
          { id: 'opt-2', label: 'Option B', value: 'opt-2', text: 'Option B', isCorrect: false, color: 'sky' },
          { id: 'opt-3', label: 'Option C', value: 'opt-3', text: 'Option C', isCorrect: false, color: 'gold' },
          { id: 'opt-4', label: 'Option D', value: 'opt-4', text: 'Option D', isCorrect: false, color: 'mint' },
        ],
      };
    } else if (type === 'checkbox' || type === 'multiple_choice') {
      newBlockData = {
        type,
        title: 'Untitled Question',
        description: '',
        required: true,
        points: 20,
        options: [
          { id: 'opt-1', label: 'Option A', value: 'opt-1', text: 'Option A', isCorrect: true, color: 'coral' },
          { id: 'opt-2', label: 'Option B', value: 'opt-2', text: 'Option B', isCorrect: false, color: 'sky' },
          { id: 'opt-3', label: 'Option C', value: 'opt-3', text: 'Option C', isCorrect: false, color: 'gold' },
          { id: 'opt-4', label: 'Option D', value: 'opt-4', text: 'Option D', isCorrect: false, color: 'mint' },
        ],
      };
    } else if (type === 'scale') {
      newBlockData = {
        type: 'scale',
        title: 'Untitled Scale Question',
        description: '',
        required: true,
        points: 10,
        scaleMin: 1,
        scaleMax: 5,
        scaleMinLabel: 'Low',
        scaleMaxLabel: 'High',
      };
    } else if (type === 'text') {
      newBlockData = {
        type: 'text',
        title: 'Untitled Text Question',
        description: '',
        required: true,
        points: 20,
        placeholder: 'Enter response here...',
      };
    } else if (type === 'header') {
      newBlockData = {
        type: 'header',
        title: 'New Section Header',
        description: '',
        required: false,
      };
    } else if (type === 'section' || type === 'title_description') {
      newBlockData = {
        type,
        title: 'Subsection',
        description: '',
        required: false,
      };
    } else if (type === 'image') {
      newBlockData = {
        type: 'image',
        title: 'Image Block',
        description: '',
        required: false,
      };
    } else {
      newBlockData = {
        type: 'timer',
        title: 'Timer Block',
        description: '',
        required: false,
      };
    }

    addBlock(assessment.id, newBlockData);
    triggerSaveNotify();
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderBlocks(assessment.id, index, index - 1);
      triggerSaveNotify();
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < assessment.blocks.length - 1) {
      reorderBlocks(assessment.id, index, index + 1);
      triggerSaveNotify();
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title={`Builder: ${assessment.title}`}
          description="Build and stack your assessment questions, sections, media, and rating scales."
          breadcrumbs={[
            { label: 'Workspace', href: '/dashboard' },
            { label: assessment.title, href: `/dashboard/${assessment.id}` },
            { label: 'Builder' },
          ]}
          badge={
            <div className="flex items-center gap-2">
              <AssessmentBadge mode={assessment.mode} size="sm" />
              <AssessmentBadge presentation={assessment.presentationMode} size="sm" />
            </div>
          }
          actions={
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-[var(--color-muted-steel)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{saveStatus}</span>
              </span>
              <a
                href={`/${assessment.slug}/start`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#A91535] text-xs font-mono font-semibold text-white hover:bg-[#C74B63] transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Participant Mode</span>
              </a>
            </div>
          }
        />

        <AssessmentNavTabs assessment={assessment} />

        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Assessment Header Banner (Optional) */}
          <BannerUploader
            bannerUrl={assessment.bannerUrl}
            onBannerChange={(url) => {
              updateAssessment(assessment.id, { bannerUrl: url });
              triggerSaveNotify();
            }}
          />

          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-5 border-t-4 border-t-[#A91535] space-y-3 shadow-sm">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[var(--color-muted-steel)] mb-1">
                Assessment Title
              </label>
              <input
                type="text"
                value={assessment.title}
                onChange={(e) => {
                  updateAssessment(assessment.id, { title: e.target.value });
                  triggerSaveNotify();
                }}
                className="w-full bg-[var(--color-charcoal)] border border-[var(--color-border-subtle)] rounded px-3 py-2 text-base font-bold text-[var(--color-soft-white)] focus:outline-none focus:ring-1 focus:ring-[#A91535]"
                placeholder="Enter title..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[var(--color-muted-steel)] mb-1">
                Assessment Instructions / Description
              </label>
              <textarea
                rows={2}
                value={assessment.description}
                onChange={(e) => {
                  updateAssessment(assessment.id, { description: e.target.value });
                  triggerSaveNotify();
                }}
                className="w-full bg-[var(--color-charcoal)] border border-[var(--color-border-subtle)] rounded px-3 py-1.5 text-xs text-[var(--color-muted-steel)] focus:outline-none focus:ring-1 focus:ring-[#A91535]"
                placeholder="Provide directions or overview for candidates..."
              />
            </div>
          </div>

          <BlockToolbar onAddBlock={handleAddBlock} />

          <div className="space-y-4">
            {assessment.blocks.map((block, index) => (
              <BuilderBlock
                key={block.id}
                block={block}
                index={index}
                totalBlocks={assessment.blocks.length}
                onUpdate={(updates) => {
                  updateBlock(assessment.id, block.id, updates);
                  triggerSaveNotify();
                }}
                onDelete={() => {
                  if (assessment.blocks.length <= 1 || window.confirm('Are you sure you want to delete this block?')) {
                    deleteBlock(assessment.id, block.id);
                    triggerSaveNotify();
                  }
                }}
                onDuplicate={() => {
                  duplicateBlock(assessment.id, block.id);
                  triggerSaveNotify();
                }}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
              />
            ))}
          </div>

          <div className="pt-2">
            <BlockToolbar onAddBlock={handleAddBlock} />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

