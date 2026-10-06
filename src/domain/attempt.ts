import type { ID, ISODateTime } from './common';
import type { Question } from './question';

export type AttemptStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'expired';

export type AnswerValue =
  | string
  | string[]
  | number
  | null;

export interface Answer {
  id: ID;
  attemptId: ID;
  questionId: ID;
  value: AnswerValue;
  scoreAwarded: number;
  answeredAt: ISODateTime;
  responseDurationMs: number | null;
  isCorrect?: boolean;
  // Compatibility fields for existing UI components
  answer?: AnswerValue;
  pointsEarned?: number;
  timeSpentSeconds?: number;
}

export type ParticipantResponse = Answer;

export interface Attempt {
  id: ID;
  assessmentId: ID;
  participantId: ID;
  participantName: string;
  email?: string | null;
  avatarSeed?: string;
  status: AttemptStatus;
  answers: Answer[];
  responses?: Answer[]; // compatibility alias
  score: number;
  maxScore: number;
  percentage: number;
  startedAt: ISODateTime;
  completedAt: ISODateTime | null;
  expiresAt: ISODateTime | null;
  totalDurationMs: number | null;
  totalTimeSeconds: number; // Duration in seconds
  pretestScore?: number;
  posttestScore?: number;
}

export type ParticipantSubmission = Attempt;

/**
 * Pure deterministic scoring evaluator.
 * Rule: back/forward navigation replaces score, never duplicates.
 */
export const scoreQuestionAnswer = (
  block: Question,
  value: AnswerValue
): { scoreAwarded: number; isCorrect: boolean } => {
  const defaultPoints = block.points ?? 20;

  if (block.type === 'choice' || block.type === 'single_choice') {
    const options = block.options || block.choices || [];
    const correctOption = options.find((o) => o.isCorrect);
    if (correctOption && value === correctOption.id) {
      return { scoreAwarded: defaultPoints, isCorrect: true };
    }
    return { scoreAwarded: 0, isCorrect: false };
  }

  if (block.type === 'checkbox' || block.type === 'multiple_choice') {
    const options = block.options || block.choices || [];
    const correctOptionIds = options.filter((o) => o.isCorrect).map((o) => o.id);
    const userSelected = Array.isArray(value) ? value : [];
    const allMatches =
      correctOptionIds.length === userSelected.length &&
      correctOptionIds.every((id) => userSelected.includes(id));
    if (allMatches) {
      return { scoreAwarded: defaultPoints, isCorrect: true };
    }
    return { scoreAwarded: 0, isCorrect: false };
  }

  if (block.type === 'scale' || block.type === 'text') {
    const isProvided = value !== null && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
    return { scoreAwarded: isProvided ? defaultPoints : 0, isCorrect: isProvided };
  }

  return { scoreAwarded: 0, isCorrect: true };
};

/**
 * Derive total score deterministically from per-question scores.
 */
export const deriveTotalScore = (scores: Record<string, number>): number => {
  return Object.values(scores).reduce((acc, score) => acc + (Number.isFinite(score) ? score : 0), 0);
};

