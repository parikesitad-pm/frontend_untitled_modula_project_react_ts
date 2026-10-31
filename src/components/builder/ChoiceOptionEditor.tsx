import React, { useState } from 'react';
import { ChoiceOption } from '@/domain';
import { MarkdownView } from '@/components/common/MarkdownView';
import { Plus, Trash2, CheckCircle, Circle, Eye, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChoiceOptionEditorProps {
  options: ChoiceOption[];
  onChange: (options: ChoiceOption[]) => void;
  isMultiSelect?: boolean;
}

const PLAY_COLORS: ('coral' | 'sky' | 'gold' | 'mint')[] = ['coral', 'sky', 'gold', 'mint'];
// Display names follow the visible tile color; the stored values are a backend contract.
const PLAY_COLOR_NAMES: Record<(typeof PLAY_COLORS)[number], string> = { coral: 'Red', sky: 'Blue', gold: 'Yellow', mint: 'Green' };

export const ChoiceOptionEditor: React.FC<ChoiceOptionEditorProps> = ({
  options,
  onChange,
  isMultiSelect = false,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleAddOption = () => {
    const nextColor = PLAY_COLORS[options.length % PLAY_COLORS.length];
    const optId = `opt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
    const optText = `Option ${String.fromCharCode(65 + options.length)}`;
    const newOpt: ChoiceOption = {
      id: optId,
      label: optText,
      value: optId,
      text: optText,
      isCorrect: options.length === 0,
      color: nextColor,
    };
    onChange([...options, newOpt]);
  };

  const handleUpdateText = (id: string, text: string) => {
    onChange(options.map((o) => (o.id === id ? { ...o, text, label: text, value: o.value || id } : o)));
  };

  const handleToggleCorrect = (id: string) => {
    if (isMultiSelect) {
      onChange(options.map((o) => (o.id === id ? { ...o, isCorrect: !o.isCorrect } : o)));
    } else {
      onChange(options.map((o) => ({ ...o, isCorrect: o.id === id })));
    }
  };

  const handleDeleteOption = (id: string) => {
    if (options.length <= 1) return;
    onChange(options.filter((o) => o.id !== id));
  };

  const handleColorChange = (id: string, color: 'coral' | 'sky' | 'gold' | 'mint') => {
    onChange(options.map((o) => (o.id === id ? { ...o, color } : o)));
  };

  const colorBadgeStyle = {
    coral: 'bg-play-1/20 text-ink border-play-1/40',
    sky: 'bg-play-2/20 text-ink border-play-2/40',
    gold: 'bg-play-3/20 text-ink border-play-3/40',
    mint: 'bg-play-4/20 text-ink border-play-4/40',
  };

  return (
    <div className="space-y-2.5 pt-2">
      <div className="flex items-center justify-between text-[11px] font-mono text-muted">
        <span>Answer Choices (Markdown & Code preserved)</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-1 text-[10px] text-ink-soft hover:text-ink transition-colors cursor-pointer"
          >
            {showPreview ? <Edit2 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span>{showPreview ? 'Edit Raw' : 'Preview MD'}</span>
          </button>
          <span>·</span>
          <span>Click check to set correct answer</span>
        </div>
      </div>

      <div className="space-y-2">
        {options.map((option, idx) => (
          <div
            key={option.id}
            className={cn(
              'flex items-start gap-2.5 p-2 rounded-lg border bg-canvas transition-all',
              option.isCorrect
                ? 'border-emerald-500/40 bg-emerald-950/10'
                : 'border-line'
            )}
          >
            {/* Correctness Toggle: fixed dimension shrink-0 */}
            <button
              type="button"
              onClick={() => handleToggleCorrect(option.id)}
              className={cn(
                'shrink-0 aspect-square w-5 h-5 min-w-[1.25rem] min-h-[1.25rem] mt-0.5 rounded flex items-center justify-center transition-colors cursor-pointer',
                option.isCorrect ? 'text-emerald-400 hover:text-emerald-300' : 'text-muted hover:text-ink-soft'
              )}
              title={option.isCorrect ? 'Marked as Correct' : 'Mark as Correct'}
            >
              {option.isCorrect ? (
                <CheckCircle className="w-4 h-4 fill-emerald-500/20 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 shrink-0" />
              )}
            </button>

            {/* Play Color Selector Tag: fixed shrink-0 */}
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold border shrink-0',
                  option.color ? colorBadgeStyle[option.color] : 'bg-raised text-muted border-line'
                )}
              >
                {option.color ? PLAY_COLOR_NAMES[option.color] : `Tile ${idx + 1}`}
              </span>
              <div className="hidden sm:flex items-center gap-0.5 ml-1">
                {PLAY_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleColorChange(option.id, c)}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-transform shrink-0',
                      c === 'coral' && 'bg-play-1',
                      c === 'sky' && 'bg-play-2',
                      c === 'gold' && 'bg-play-3',
                      c === 'mint' && 'bg-play-4',
                      option.color === c ? 'scale-125 ring-1 ring-ink' : 'opacity-40 hover:opacity-100'
                    )}
                    title={`Set color: ${PLAY_COLOR_NAMES[c]}`}
                    aria-label={`Set color: ${PLAY_COLOR_NAMES[c]}`}
                    aria-pressed={option.color === c}
                  />
                ))}
              </div>
            </div>

            {/* Text Input / Markdown Preview: Flexible wrapper with break-words */}
            <div className="flex-1 min-w-0">
              {showPreview ? (
                <div className="px-2 py-1 text-xs text-ink bg-surface rounded border border-line">
                  <MarkdownView content={option.label || option.text || ''} inline />
                </div>
              ) : (
                <input
                  type="text"
                  value={option.label || option.text || ''}
                  onChange={(e) => handleUpdateText(option.id, e.target.value)}
                  className="w-full bg-transparent px-2 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent rounded border border-transparent hover:border-line focus:border-accent-deep"
                  placeholder={`Option ${idx + 1} text or \`code\`...`}
                />
              )}
            </div>

            {/* Delete Button: shrink-0 */}
            {options.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteOption(option.id)}
                className="shrink-0 p-1 text-muted hover:text-red-400 transition-colors cursor-pointer mt-0.5"
                title="Remove choice"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddOption}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-ink-soft hover:text-ink bg-raised hover:bg-line border border-line rounded transition-colors cursor-pointer"
      >
        <Plus className="w-3 h-3" />
        <span>Add Choice Option</span>
      </button>
    </div>
  );
};
