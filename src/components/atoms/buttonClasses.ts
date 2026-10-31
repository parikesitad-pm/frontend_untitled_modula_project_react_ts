import { cn } from '@/lib/utils';

export type ButtonTone = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const tones: Record<ButtonTone, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'border border-line-strong bg-surface text-ink hover:bg-raised',
  ghost: 'text-ink-soft hover:bg-raised hover:text-ink',
  danger: 'bg-danger text-white hover:opacity-90',
};

// Heights keep every size at or above the 44px touch target except sm (36px, desktop toolbars).
const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-base gap-2',
  lg: 'h-14 px-6 text-lg gap-2.5',
};

/** Shared by <Button> and by <Link> elements that should look like buttons. */
export function buttonClasses({ tone = 'primary', size = 'md' }: { tone?: ButtonTone; size?: ButtonSize } = {}) {
  return cn(
    'relative inline-flex select-none items-center justify-center rounded-md font-semibold',
    'transition-[transform,background-color,color,opacity] duration-150 ease-press active:scale-[0.97]',
    'disabled:pointer-events-none disabled:opacity-50',
    tones[tone],
    sizes[size],
  );
}
