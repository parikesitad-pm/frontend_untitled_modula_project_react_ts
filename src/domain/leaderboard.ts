import type { ID, ISODateTime } from './common';

export interface LeaderboardEntry {
  participantId: ID;
  displayName: string;
  rank: number;
  score: number;
  totalDurationMs: number | null;

  // Compatibility fields for existing UI components
  participantName?: string;
  timeSeconds?: number;
  completedAt?: ISODateTime;
  avatarSeed?: string;
}

export const sortLeaderboardEntries = (entries: LeaderboardEntry[]): LeaderboardEntry[] => {
  return [...entries]
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      const durA = a.totalDurationMs ?? (a.timeSeconds ? a.timeSeconds * 1000 : 0);
      const durB = b.totalDurationMs ?? (b.timeSeconds ? b.timeSeconds * 1000 : 0);
      return durA - durB;
    })
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
      displayName: entry.displayName || entry.participantName || 'Anonymous',
      participantName: entry.participantName || entry.displayName || 'Anonymous',
    }));
};

