// Shared by the 3D podium and its flat fallback so both show the same result.
export interface PodiumPlace {
  rank: 1 | 2 | 3;
  name: string;
  score: number;
  /** Block height in scene units; the flat fallback scales it to a percentage. */
  height: number;
  /** Scene x position: 2nd left, 1st centre, 3rd right. */
  x: number;
  color: string;
  /** Progress offset (0..1) before this block starts rising; the winner goes last. */
  delay: number;
}

export const podiumPlaces: PodiumPlace[] = [
  { rank: 3, name: 'Dewi', score: 2655, height: 1.1, x: 1.65, color: '#C98A55', delay: 0 },
  { rank: 2, name: 'Bagus', score: 2710, height: 1.5, x: -1.65, color: '#C3C9D2', delay: 0.15 },
  { rank: 1, name: 'Rina', score: 2840, height: 2.1, x: 0, color: '#FFB81C', delay: 0.32 },
];
