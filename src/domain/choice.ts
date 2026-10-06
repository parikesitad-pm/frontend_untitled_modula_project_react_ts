import type { ID } from './common';

export type ChoiceColor = 'coral' | 'sky' | 'gold' | 'mint';

export interface Choice {
  id: ID;
  label: string;
  value: string;
  text?: string; // UI compatibility (maps to label)
  isCorrect?: boolean;
  color?: ChoiceColor;
}

// Backwards-compatibility alias
export type ChoiceOption = Choice;

