import type { ID } from './common';

export interface Participant {
  id: ID;
  displayName: string;
  email?: string | null;
  avatarSeed?: string;
}

