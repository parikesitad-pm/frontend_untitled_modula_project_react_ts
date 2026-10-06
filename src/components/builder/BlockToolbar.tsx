import React from 'react';
import { BlockType } from '@/domain';
import { 
  Heading, 
  AlignLeft, 
  SplitSquareVertical, 
  CheckCircle2, 
  CheckSquare, 
  Type, 
  Sliders, 
  Clock, 
  Image as ImageIcon 
} from 'lucide-react';

interface BlockToolbarProps {
  onAddBlock: (type: BlockType) => void;
}

export const BlockToolbar: React.FC<BlockToolbarProps> = ({ onAddBlock }) => {
  const blockTypes: { type: BlockType; label: string; icon: React.ElementType; description: string }[] = [
    { type: 'choice', label: 'Single Choice', icon: CheckCircle2, description: 'Single select with play mode colors' },
    { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare, description: 'Multi-select options' },
    { type: 'text', label: 'Text Response', icon: Type, description: 'Short or paragraph answer' },
    { type: 'scale', label: 'Linear Scale', icon: Sliders, description: 'Rating / Likert 1-5 or 1-10' },
    { type: 'header', label: 'Header Block', icon: Heading, description: 'Major assessment section banner' },
    { type: 'section', label: 'Section Split', icon: SplitSquareVertical, description: 'Sub-group questions' },
    { type: 'title_description', label: 'Title & Text', icon: AlignLeft, description: 'Contextual guidelines' },
    { type: 'timer', label: 'Timer Anchor', icon: Clock, description: 'Per-section countdown rule' },
    { type: 'image', label: 'Image Media', icon: ImageIcon, description: 'Visual diagram or prompt' },
  ];

  return (
    <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-panel)] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-steel)]">
          Add Stackable Block
        </span>
        <span className="font-mono text-[11px] text-[var(--color-muted-steel)]">
          Click to insert at bottom
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
        {blockTypes.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.type}
              onClick={() => onAddBlock(item.type)}
              type="button"
              className="flex flex-col items-center justify-center p-2.5 rounded border border-[var(--color-border-subtle)] bg-[var(--color-panel-elevated)] hover:bg-[#7A1025]/20 hover:border-[#A91535] hover:text-[var(--color-soft-white)] transition-all text-center group cursor-pointer focus-visible:ring-2 focus-visible:ring-[#A91535]"
              title={item.description}
            >
              <Icon className="w-4 h-4 text-[var(--color-steel)] group-hover:text-[var(--color-soft-white)] mb-1.5 transition-colors" />
              <span className="text-[11px] font-medium text-[var(--color-steel)] group-hover:text-[var(--color-soft-white)] line-clamp-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

