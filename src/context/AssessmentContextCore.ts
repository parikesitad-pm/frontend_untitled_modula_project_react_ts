import { createContext } from 'react';
import type {
  Assessment,
  Question,
  QuestionDraft,
  Attempt,
  LeaderboardEntry,
  LiveSession,
  LiveParticipant,
} from '@/domain';

export interface AssessmentContextType {
  assessments: Assessment[];
  submissions: Record<string, Attempt[]>;
  leaderboards: Record<string, LeaderboardEntry[]>;
  liveSessions: Record<string, LiveSession>;
  getAssessmentById: (id: string) => Assessment | undefined;
  getAssessmentBySlug: (slug: string) => Assessment | undefined;
  createAssessment: (assessment: Partial<Assessment>) => Assessment;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;
  deleteAssessment: (id: string) => void;
  duplicateAssessment: (id: string) => Assessment;
  addBlock: (assessmentId: string, block: QuestionDraft) => void;
  updateBlock: (assessmentId: string, blockId: string, updates: Partial<Question>) => void;
  deleteBlock: (assessmentId: string, blockId: string) => void;
  duplicateBlock: (assessmentId: string, blockId: string) => void;
  reorderBlocks: (assessmentId: string, startIndex: number, endIndex: number) => void;
  submitAssessment: (assessmentId: string, submission: Omit<Attempt, 'id'>) => Attempt;
  getLiveSession: (assessmentId: string) => LiveSession;
  startLiveSession: (assessmentId: string) => void;
  addLiveParticipant: (assessmentId: string, participant: Omit<LiveParticipant, 'id' | 'joinedAt'>) => void;
  resetLiveSession: (assessmentId: string) => void;
}

export const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);
