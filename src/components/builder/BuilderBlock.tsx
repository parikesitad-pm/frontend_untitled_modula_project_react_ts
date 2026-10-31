import React, { useState } from 'react';
import { Question as BlockData, BlockType } from '@/domain';
import { ChoiceOptionEditor } from '@/components/builder/ChoiceOptionEditor';
import { MarkdownView } from '@/components/common/MarkdownView';
import { 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Trash2, 
  Award, 
  Asterisk, 
  Heading, 
  CheckCircle2, 
  CheckSquare, 
  Type, 
  Sliders, 
  SplitSquareVertical, 
  AlignLeft, 
  Image as ImageIcon,
  Eye,
  Edit2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BuilderBlockProps {
  block: BlockData;
  index: number;
  totalBlocks: number;
  onUpdate: (updates: Partial<BlockData>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const TYPE_ICONS: Record<BlockType, React.ComponentType<{ className?: string }>> = {
  header: Heading,
  section: SplitSquareVertical,
  title_description: AlignLeft,
  choice: CheckCircle2,
  checkbox: CheckSquare,
  single_choice: CheckCircle2,
  multiple_choice: CheckSquare,
  text: Type,
  scale: Sliders,
  timer: ClockIcon,
  image: ImageIcon,
};

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export const BuilderBlock: React.FC<BuilderBlockProps> = ({
  block,
  index,
  totalBlocks,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [previewMd, setPreviewMd] = useState(false);
  const Icon = TYPE_ICONS[block.type] || CheckCircle2;

  const isQuestion = ['choice', 'checkbox', 'text', 'scale'].includes(block.type);

  return (
    <div
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsFocused(false);
        }
      }}
      className={cn(
        'group relative rounded-lg border bg-surface p-4 sm:p-5 transition-all duration-150',
        isFocused
          ? 'border-accent ring-1 ring-accent-deep shadow-lg shadow-accent-deep/15'
          : 'border-line hover:border-ink-soft/50'
      )}
    >
      {/* Top Action Toolbar Row: Move | Duplicate | Delete directly accessible */}
      <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-line/60">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-mono text-[11px] text-muted bg-canvas px-2 py-0.5 rounded border border-line">
            <span>#{index + 1}</span>
            <span>·</span>
            <Icon className="w-3 h-3 text-ink-soft" />
            <span className="uppercase font-semibold text-ink-soft">{block.type.replace('_', ' ')}</span>
          </div>
          {block.required && (
            <span className="flex items-center text-[10px] font-mono text-accent-text bg-accent-tint/20 px-1.5 py-0.5 rounded border border-accent-deep/50">
              <Asterisk className="w-2.5 h-2.5" /> Required
            </span>
          )}
        </div>

        {/* Action Controls: Move | Duplicate | Delete explicitly displayed */}
        <div className="flex items-center gap-1">
          {/* Markdown preview toggle for prompt */}
          <button
            type="button"
            onClick={() => setPreviewMd(!previewMd)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono text-muted hover:text-ink hover:bg-raised border border-transparent hover:border-line transition-colors cursor-pointer"
            title="Toggle Markdown Preview"
          >
            {previewMd ? <Edit2 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span className="hidden sm:inline">{previewMd ? 'Raw' : 'Preview'}</span>
          </button>

          <div className="w-px h-3.5 bg-line mx-1" />

          {/* Move Up */}
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            className="p-1.5 rounded text-muted hover:text-ink hover:bg-raised disabled:opacity-30 disabled:hover:text-muted transition-colors cursor-pointer"
            title="Move Block Up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Move Down */}
          <button
            type="button"
            disabled={index === totalBlocks - 1}
            onClick={onMoveDown}
            className="p-1.5 rounded text-muted hover:text-ink hover:bg-raised disabled:opacity-30 disabled:hover:text-muted transition-colors cursor-pointer"
            title="Move Block Down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Direct Duplicate Action Button */}
          <button
            type="button"
            onClick={onDuplicate}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono text-ink-soft hover:text-ink hover:bg-raised border border-line transition-colors cursor-pointer"
            title="Duplicate Block"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Duplicate</span>
          </button>

          {/* Delete Action Button */}
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded text-muted hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
            title="Delete Block"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Fields */}
      <div className="space-y-3">
        {/* Title Input / MD Preview */}
        <div>
          {previewMd ? (
            <div className="p-2 rounded bg-canvas border border-line text-sm sm:text-base font-semibold text-ink">
              <MarkdownView content={block.title || '*(Empty Prompt)*'} />
            </div>
          ) : (
            <input
              type="text"
              value={block.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder={
                block.type === 'header'
                  ? 'Section Header Title (Markdown supported)...'
                  : block.type === 'section'
                  ? 'Sub-section Name...'
                  : 'Question prompt (e.g. In `React 19`, which hook...)...'
              }
              className="w-full bg-transparent text-sm sm:text-base font-semibold text-ink placeholder-muted/50 focus:outline-none focus:ring-1 focus:ring-accent px-2 py-1 rounded border border-transparent hover:border-line"
            />
          )}
        </div>

        {/* Description / Helper Text Input */}
        <div>
          {previewMd && block.description ? (
            <div className="p-2 rounded bg-canvas border border-line text-xs text-muted">
              <MarkdownView content={block.description} />
            </div>
          ) : (
            <input
              type="text"
              value={block.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Optional helper text or instructions (Markdown supported)..."
              className="w-full bg-transparent text-xs text-muted placeholder-muted/40 focus:outline-none focus:ring-1 focus:ring-accent px-2 py-1 rounded border border-transparent hover:border-line"
            />
          )}
        </div>

        {/* Type Specific Configuration */}
        {(block.type === 'choice' || block.type === 'checkbox' || block.type === 'single_choice' || block.type === 'multiple_choice') && (
          <ChoiceOptionEditor
            options={
              ('options' in block && block.options) || [
                { id: 'opt-1', label: 'Option 1', value: 'opt-1', text: 'Option 1', isCorrect: true, color: 'coral' },
                { id: 'opt-2', label: 'Option 2', value: 'opt-2', text: 'Option 2', isCorrect: false, color: 'sky' },
              ]
            }
            isMultiSelect={block.type === 'checkbox' || block.type === 'multiple_choice'}
            onChange={(options) => onUpdate({ options })}
          />
        )}

        {block.type === 'scale' && (
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <label className="block text-[10px] uppercase text-muted mb-1">Scale Min</label>
              <input
                type="number"
                value={block.scaleMin ?? 1}
                onChange={(e) => onUpdate({ scaleMin: parseInt(e.target.value) || 1 })}
                className="w-full bg-canvas border border-line rounded px-2 py-1 text-ink"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-muted mb-1">Scale Max</label>
              <input
                type="number"
                value={block.scaleMax ?? 5}
                onChange={(e) => onUpdate({ scaleMax: parseInt(e.target.value) || 5 })}
                className="w-full bg-canvas border border-line rounded px-2 py-1 text-ink"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-muted mb-1">Min Label</label>
              <input
                type="text"
                value={block.scaleMinLabel || ''}
                onChange={(e) => onUpdate({ scaleMinLabel: e.target.value })}
                placeholder="Low..."
                className="w-full bg-canvas border border-line rounded px-2 py-1 text-ink"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-muted mb-1">Max Label</label>
              <input
                type="text"
                value={block.scaleMaxLabel || ''}
                onChange={(e) => onUpdate({ scaleMaxLabel: e.target.value })}
                placeholder="High..."
                className="w-full bg-canvas border border-line rounded px-2 py-1 text-ink"
              />
            </div>
          </div>
        )}

        {block.type === 'text' && (
          <div className="pt-2">
            <input
              type="text"
              value={block.placeholder || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder="Custom input placeholder for participants..."
              className="w-full bg-canvas border border-line rounded px-3 py-1.5 text-xs text-muted"
            />
          </div>
        )}

        {block.type === 'image' && (
          <div className="pt-2 space-y-2">
            <input
              type="text"
              value={block.mediaUrl || ''}
              onChange={(e) => onUpdate({ mediaUrl: e.target.value })}
              placeholder="Image URL (e.g. https://... or /brand/...)"
              className="w-full bg-canvas border border-line rounded px-3 py-1.5 text-xs text-ink"
            />
            {block.mediaUrl && (
              <div className="max-h-48 overflow-hidden rounded border border-line bg-canvas">
                <img src={block.mediaUrl} alt={block.mediaAlt || 'Block media preview'} className="object-contain w-full max-h-48" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Block Settings Bar (Points & Required) */}
      {isQuestion && (
        <div className="mt-4 pt-3 border-t border-line/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-accent-text" />
              <span>Points:</span>
              <input
                type="number"
                value={block.points ?? 20}
                onChange={(e) => onUpdate({ points: parseInt(e.target.value) || 0 })}
                className="w-14 bg-canvas border border-line rounded px-1.5 py-0.5 text-center text-ink"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-ink-soft hover:text-ink">
            <input
              type="checkbox"
              checked={block.required ?? false}
              onChange={(e) => onUpdate({ required: e.target.checked })}
              className="accent-accent rounded"
            />
            <span>Required</span>
          </label>
        </div>
      )}
    </div>
  );
};
