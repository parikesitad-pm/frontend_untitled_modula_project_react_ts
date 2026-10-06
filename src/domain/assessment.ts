import type { ID, ISODateTime } from './common';
import type { Question } from './question';

export type AssessmentMode =
  | 'quiz'
  | 'pretest'
  | 'posttest'
  | 'task'
  | 'survey'
  | 'form';

export type PresentationMode =
  | 'formal'
  | 'playful'
  | 'custom';

export type AssessmentStatus =
  | 'draft'
  | 'active'
  | 'archived';

export interface AssessmentSettings {
  showLeaderboard: boolean;
  showScore: boolean;
  showTimer: boolean;
  soundEnabled: boolean;
  shuffleQuestions: boolean;
  allowBackNavigation: boolean;
  requireAuth: boolean;
  passPercentage: number;
  timeLimitTotalMinutes?: number;
  themeStyle?: 'dark-formal' | 'steel-minimal' | 'crimson-game' | 'deep-charcoal';
}

export interface Assessment {
  id: ID;
  slug: string;
  title: string;
  description: string;
  mode: AssessmentMode;
  presentationMode: PresentationMode;
  status: AssessmentStatus;

  // Constraint rules
  timeLimitEnabled: boolean;
  activityTimeLimitSeconds: number | null;
  leaderboardEnabled: boolean;
  scoreVisible?: boolean;
  rankVisible?: boolean;

  // Question stack
  blocks: Question[];
  questions?: Question[];

  // Settings & styling
  settings: AssessmentSettings;
  coverImage?: string;
  bannerUrl?: string | null;

  // Domain ownership preparation (Sprint 9.5 / S10 integration)
  ownerId?: string;
  createdBy?: string;

  // Timestamps
  createdAt: ISODateTime;
  updatedAt: ISODateTime;

  // Aggregated read-model counts
  participantCount: number;
  averageScore: number;
  completionRate: number;
}

