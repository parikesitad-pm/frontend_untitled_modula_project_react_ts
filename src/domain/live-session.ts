import type { ID, ISODateTime } from './common';

export type LiveSessionStatus =
  | 'lobby'
  | 'live'
  | 'completed';

export type LiveParticipantStatus =
  | 'joined'
  | 'active'
  | 'completed'
  | 'disconnected';

export interface LiveParticipant {
  id: ID;
  participantId?: ID;
  displayName: string;
  status?: LiveParticipantStatus;
  joinedAt: ISODateTime;
  attemptId?: ID | null;
  avatarSeed?: string;
}

export interface LiveSession {
  id: ID;
  assessmentId: ID;
  status: LiveSessionStatus;
  participantUrl: string;
  participants: LiveParticipant[];
  createdAt?: ISODateTime;
  startedAt: ISODateTime | null;
  endedAt?: ISODateTime | null;
}

