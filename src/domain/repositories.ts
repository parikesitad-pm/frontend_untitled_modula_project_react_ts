import type { ID } from './common';
import type { Assessment } from './assessment';
import type { Attempt } from './attempt';
import type { LeaderboardEntry } from './leaderboard';
import type { LiveSession } from './live-session';
import { initialAssessments, mockSubmissions, mockLeaderboards, mockLiveSessions } from '@/data/mockAssessments';
import {
  safeParseStoredAssessments,
  safeParseStoredSubmissions,
  safeParseStoredLeaderboards,
  safeParseStoredLiveSessions,
} from './schemas';

export const STORAGE_KEYS = {
  ASSESSMENTS: 'untitled_modula_assessments_v1',
  SUBMISSIONS: 'untitled_modula_submissions_v1',
  LEADERBOARDS: 'untitled_modula_leaderboards_v1',
  LIVE_SESSIONS: 'untitled_modula_live_sessions_v1',
} as const;

/**
 * Lightweight mock repository layer isolating LocalStorage / memory access.
 * Future backend integration replaces this adapter with real HTTP/WebSocket clients.
 */
export class LocalAssessmentRepository {
  static loadAll(): Assessment[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      return safeParseStoredAssessments(raw, initialAssessments as unknown as Assessment[]);
    } catch {
      return initialAssessments as unknown as Assessment[];
    }
  }

  static persistAll(assessments: Assessment[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
    } catch (e) {
      console.warn('LocalAssessmentRepository: persist failed', e);
    }
  }
}

export class LocalAttemptRepository {
  static loadAll(): Record<string, Attempt[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return safeParseStoredSubmissions(raw, mockSubmissions as unknown as Record<string, Attempt[]>);
    } catch {
      return mockSubmissions as unknown as Record<string, Attempt[]>;
    }
  }

  static persistAll(submissions: Record<string, Attempt[]>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    } catch (e) {
      console.warn('LocalAttemptRepository: persist failed', e);
    }
  }
}

export class LocalLeaderboardRepository {
  static loadAll(): Record<string, LeaderboardEntry[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARDS);
      return safeParseStoredLeaderboards(raw, mockLeaderboards as unknown as Record<string, LeaderboardEntry[]>);
    } catch {
      return mockLeaderboards as unknown as Record<string, LeaderboardEntry[]>;
    }
  }

  static persistAll(boards: Record<string, LeaderboardEntry[]>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARDS, JSON.stringify(boards));
    } catch (e) {
      console.warn('LocalLeaderboardRepository: persist failed', e);
    }
  }
}

export class LocalLiveSessionRepository {
  static loadAll(): Record<string, LiveSession> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LIVE_SESSIONS);
      return safeParseStoredLiveSessions(raw, mockLiveSessions as unknown as Record<string, LiveSession>);
    } catch {
      return mockLiveSessions as unknown as Record<string, LiveSession>;
    }
  }

  static persistAll(sessions: Record<string, LiveSession>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LIVE_SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.warn('LocalLiveSessionRepository: persist failed', e);
    }
  }

  static createDefault(assessmentId: ID, participantUrl: string): LiveSession {
    return {
      id: `live-${Date.now().toString(36)}`,
      assessmentId,
      status: 'lobby',
      participantUrl,
      participants: [],
      createdAt: new Date().toISOString(),
      startedAt: null,
      endedAt: null,
    };
  }
}
