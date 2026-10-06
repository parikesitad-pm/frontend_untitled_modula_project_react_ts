import type { ID, DistributiveOmit } from './common';
import type { Choice } from './choice';

export type BlockType =
  | 'header'
  | 'title_description'
  | 'section'
  | 'choice'
  | 'checkbox'
  | 'single_choice'
  | 'multiple_choice'
  | 'text'
  | 'scale'
  | 'timer'
  | 'image';

export type QuestionType =
  | 'choice'
  | 'checkbox'
  | 'single_choice'
  | 'multiple_choice'
  | 'text'
  | 'scale';

export interface BaseBlock {
  id: ID;
  title: string;
  description?: string;
  required?: boolean;
  order?: number;
  points?: number;
  timeLimitSeconds?: number; // legacy optional block-level tag
}

export interface SingleChoiceQuestion extends BaseBlock {
  type: 'choice' | 'single_choice';
  options?: Choice[];
  choices?: Choice[];
}

export interface MultipleChoiceQuestion extends BaseBlock {
  type: 'checkbox' | 'multiple_choice';
  options?: Choice[];
  choices?: Choice[];
}

export interface TextQuestion extends BaseBlock {
  type: 'text';
  placeholder?: string;
  options?: never;
}

export interface ScaleQuestion extends BaseBlock {
  type: 'scale';
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  options?: never;
}

export interface HeaderBlock extends BaseBlock {
  type: 'header';
  options?: never;
}

export interface SectionBlock extends BaseBlock {
  type: 'section' | 'title_description';
  sectionTitle?: string;
  helperText?: string;
  options?: never;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  mediaUrl?: string;
  mediaAlt?: string;
  options?: never;
}

export interface TimerBlock extends BaseBlock {
  type: 'timer';
  options?: never;
}

export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | TextQuestion
  | ScaleQuestion
  | HeaderBlock
  | SectionBlock
  | ImageBlock
  | TimerBlock;

// Aliases for builder components
export type BuilderBlock = Question;
export type QuestionDraft = DistributiveOmit<Question, 'id'>;
export type BuilderBlockDraft = QuestionDraft;

export const isInteractiveQuestion = (block: Question): boolean => {
  return ['choice', 'checkbox', 'single_choice', 'multiple_choice', 'text', 'scale'].includes(block.type);
};
