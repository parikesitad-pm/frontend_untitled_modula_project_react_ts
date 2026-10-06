import { z } from 'zod';
import type { Assessment } from './assessment';
import type { Attempt } from './attempt';
import type { LiveSession } from './live-session';
import type { LeaderboardEntry } from './leaderboard';

// Common
export const IDSchema = z.string().min(1);
export const ISODateTimeSchema = z.string();

// Choice
export const ChoiceColorSchema = z.enum(['coral', 'sky', 'gold', 'mint']);

export const ChoiceSchema = z.object({
  id: IDSchema,
  label: z.string().default(''),
  value: z.string().default(''),
  text: z.string().optional(),
  isCorrect: z.boolean().optional(),
  color: ChoiceColorSchema.optional(),
}).passthrough().transform((c) => ({
  ...c,
  label: c.label || c.text || '',
  value: c.value || c.id,
  text: c.text || c.label || '',
}));

// Questions & Blocks
export const BaseBlockSchema = z.object({
  id: IDSchema,
  title: z.string().default(''),
  description: z.string().optional(),
  required: z.boolean().optional(),
  order: z.number().optional(),
  points: z.number().optional(),
  timeLimitSeconds: z.number().optional(),
});

export const SingleChoiceQuestionSchema = BaseBlockSchema.extend({
  type: z.enum(['choice', 'single_choice']),
  options: z.array(ChoiceSchema).optional(),
  choices: z.array(ChoiceSchema).optional(),
});

export const MultipleChoiceQuestionSchema = BaseBlockSchema.extend({
  type: z.enum(['checkbox', 'multiple_choice']),
  options: z.array(ChoiceSchema).optional(),
  choices: z.array(ChoiceSchema).optional(),
});

export const TextQuestionSchema = BaseBlockSchema.extend({
  type: z.literal('text'),
  placeholder: z.string().optional(),
});

export const ScaleQuestionSchema = BaseBlockSchema.extend({
  type: z.literal('scale'),
  scaleMin: z.number().optional(),
  scaleMax: z.number().optional(),
  scaleMinLabel: z.string().optional(),
  scaleMaxLabel: z.string().optional(),
});

export const HeaderBlockSchema = BaseBlockSchema.extend({
  type: z.literal('header'),
});

export const SectionBlockSchema = BaseBlockSchema.extend({
  type: z.enum(['section', 'title_description']),
  sectionTitle: z.string().optional(),
  helperText: z.string().optional(),
});

export const ImageBlockSchema = BaseBlockSchema.extend({
  type: z.literal('image'),
  mediaUrl: z.string().optional(),
  mediaAlt: z.string().optional(),
});

export const TimerBlockSchema = BaseBlockSchema.extend({
  type: z.literal('timer'),
});

export const QuestionSchema = z.union([
  SingleChoiceQuestionSchema,
  MultipleChoiceQuestionSchema,
  TextQuestionSchema,
  ScaleQuestionSchema,
  HeaderBlockSchema,
  SectionBlockSchema,
  ImageBlockSchema,
  TimerBlockSchema,
]);

// Assessment Settings
export const AssessmentSettingsSchema = z.object({
  showLeaderboard: z.boolean().default(true),
  showScore: z.boolean().default(true),
  showTimer: z.boolean().default(true),
  soundEnabled: z.boolean().default(false),
  shuffleQuestions: z.boolean().default(false),
  allowBackNavigation: z.boolean().default(true),
  requireAuth: z.boolean().default(false),
  passPercentage: z.number().min(0).max(100).default(70),
  timeLimitTotalMinutes: z.number().optional(),
  themeStyle: z.enum(['dark-formal', 'steel-minimal', 'crimson-game', 'deep-charcoal']).optional(),
}).passthrough();

// Assessment
export const AssessmentModeSchema = z.enum(['quiz', 'pretest', 'posttest', 'task', 'survey', 'form']);
export const PresentationModeSchema = z.enum(['formal', 'playful', 'custom']);
export const AssessmentStatusSchema = z.enum(['draft', 'active', 'archived']);

export const AssessmentSchema = z.object({
  id: IDSchema,
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().default(''),
  mode: AssessmentModeSchema.default('quiz'),
  presentationMode: PresentationModeSchema.default('formal'),
  status: AssessmentStatusSchema.default('draft'),
  timeLimitEnabled: z.boolean().default(false),
  activityTimeLimitSeconds: z.number().nullable().default(null),
  leaderboardEnabled: z.boolean().default(false),
  scoreVisible: z.boolean().optional(),
  rankVisible: z.boolean().optional(),
  blocks: z.array(QuestionSchema).default([]),
  questions: z.array(QuestionSchema).optional(),
  settings: AssessmentSettingsSchema.default({
    showLeaderboard: false,
    showScore: true,
    showTimer: true,
    soundEnabled: false,
    shuffleQuestions: false,
    allowBackNavigation: true,
    requireAuth: false,
    passPercentage: 70,
  }),
  coverImage: z.string().optional(),
  bannerUrl: z.string().nullable().optional(),
  ownerId: z.string().optional(),
  createdBy: z.string().optional(),
  createdAt: ISODateTimeSchema,
  updatedAt: ISODateTimeSchema,
  participantCount: z.number().default(0),
  averageScore: z.number().default(0),
  completionRate: z.number().default(0),
}).passthrough();

// Participant
export const ParticipantSchema = z.object({
  id: IDSchema,
  displayName: z.string().min(1),
  email: z.string().email().nullable().optional(),
  avatarSeed: z.string().optional(),
});

// Answer & Attempt
export const AnswerValueSchema = z.union([
  z.string(),
  z.array(z.string()),
  z.number(),
  z.null(),
]);

export const AnswerSchema = z.object({
  id: IDSchema,
  attemptId: IDSchema,
  questionId: IDSchema,
  value: AnswerValueSchema,
  scoreAwarded: z.number().default(0),
  answeredAt: ISODateTimeSchema,
  responseDurationMs: z.number().nullable().default(null),
  isCorrect: z.boolean().optional(),
  answer: AnswerValueSchema.optional(),
  pointsEarned: z.number().optional(),
  timeSpentSeconds: z.number().optional(),
}).passthrough().transform((a) => ({
  ...a,
  value: a.value !== undefined ? a.value : (a.answer !== undefined ? a.answer : null),
  answer: a.answer !== undefined ? a.answer : a.value,
  pointsEarned: a.pointsEarned !== undefined ? a.pointsEarned : a.scoreAwarded,
}));

export const AttemptStatusSchema = z.enum(['not_started', 'in_progress', 'completed', 'expired']);

export const AttemptSchema = z.object({
  id: IDSchema,
  assessmentId: IDSchema,
  participantId: IDSchema.default('anonymous'),
  participantName: z.string().default('Candidate'),
  email: z.string().nullable().optional(),
  avatarSeed: z.string().optional(),
  status: AttemptStatusSchema.default('completed'),
  answers: z.array(AnswerSchema).default([]),
  responses: z.array(AnswerSchema).optional(),
  score: z.number().default(0),
  maxScore: z.number().default(100),
  percentage: z.number().default(0),
  startedAt: ISODateTimeSchema,
  completedAt: ISODateTimeSchema.nullable().default(null),
  expiresAt: ISODateTimeSchema.nullable().default(null),
  totalDurationMs: z.number().nullable().default(null),
  totalTimeSeconds: z.number().default(0),
  pretestScore: z.number().optional(),
  posttestScore: z.number().optional(),
}).passthrough().transform((att) => ({
  ...att,
  answers: att.answers?.length ? att.answers : (att.responses || []),
  responses: att.responses?.length ? att.responses : (att.answers || []),
}));

// Live Session
export const LiveSessionStatusSchema = z.enum(['lobby', 'live', 'completed']);
export const LiveParticipantStatusSchema = z.enum(['joined', 'active', 'completed', 'disconnected']);

export const LiveParticipantSchema = z.object({
  id: IDSchema,
  participantId: IDSchema.optional(),
  displayName: z.string().min(1),
  status: LiveParticipantStatusSchema.optional().default('joined'),
  joinedAt: ISODateTimeSchema.default(() => new Date().toISOString()),
  attemptId: IDSchema.nullable().optional(),
  avatarSeed: z.string().optional(),
});

export const LiveSessionSchema = z.object({
  id: IDSchema,
  assessmentId: IDSchema,
  status: LiveSessionStatusSchema.default('lobby'),
  participantUrl: z.string().default(''),
  participants: z.array(LiveParticipantSchema).default([]),
  createdAt: ISODateTimeSchema.optional(),
  startedAt: ISODateTimeSchema.nullable().default(null),
  endedAt: ISODateTimeSchema.nullable().optional(),
});

// Leaderboard
export const LeaderboardEntrySchema = z.object({
  participantId: IDSchema,
  displayName: z.string().default('Anonymous'),
  rank: z.number().min(1),
  score: z.number(),
  totalDurationMs: z.number().nullable().default(null),
  participantName: z.string().optional(),
  timeSeconds: z.number().optional(),
  completedAt: ISODateTimeSchema.optional(),
  avatarSeed: z.string().optional(),
}).passthrough().transform((e) => ({
  ...e,
  displayName: e.displayName || e.participantName || 'Anonymous',
  participantName: e.participantName || e.displayName || 'Anonymous',
}));

// Safe storage boundary parsers with fallback recovery
export function safeParseStoredAssessments(raw: string | null, fallback: Assessment[]): Assessment[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    const result = z.array(AssessmentSchema).safeParse(parsed);
    if (result.success && result.data.length > 0) {
      return result.data as unknown as Assessment[];
    }
  } catch {
    // Fall back cleanly on corrupted JSON
  }
  return fallback;
}

export function safeParseStoredSubmissions(
  raw: string | null,
  fallback: Record<string, Attempt[]>
): Record<string, Attempt[]> {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const sanitized: Record<string, Attempt[]> = {};
      for (const [key, val] of Object.entries(parsed)) {
        const parsedList = z.array(AttemptSchema).safeParse(val);
        if (parsedList.success) {
          sanitized[key] = parsedList.data as unknown as Attempt[];
        } else if (Array.isArray(val)) {
          sanitized[key] = val as unknown as Attempt[];
        }
      }
      return Object.keys(sanitized).length > 0 ? sanitized : fallback;
    }
  } catch {
    // Fall back cleanly
  }
  return fallback;
}

export function safeParseStoredLeaderboards(
  raw: string | null,
  fallback: Record<string, LeaderboardEntry[]>
): Record<string, LeaderboardEntry[]> {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const sanitized: Record<string, LeaderboardEntry[]> = {};
      for (const [key, val] of Object.entries(parsed)) {
        const parsedList = z.array(LeaderboardEntrySchema).safeParse(val);
        if (parsedList.success) {
          sanitized[key] = parsedList.data as unknown as LeaderboardEntry[];
        }
      }
      return Object.keys(sanitized).length > 0 ? sanitized : fallback;
    }
  } catch {
    // Fall back cleanly
  }
  return fallback;
}

export function safeParseStoredLiveSessions(
  raw: string | null,
  fallback: Record<string, LiveSession>
): Record<string, LiveSession> {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const sanitized: Record<string, LiveSession> = {};
      for (const [key, val] of Object.entries(parsed)) {
        const parsedItem = LiveSessionSchema.safeParse(val);
        if (parsedItem.success) {
          sanitized[key] = parsedItem.data as unknown as LiveSession;
        }
      }
      return Object.keys(sanitized).length > 0 ? sanitized : fallback;
    }
  } catch {
    // Fall back cleanly
  }
  return fallback;
}

