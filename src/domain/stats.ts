import type { ID } from './common';
import type { Attempt } from './attempt';

export interface AssessmentStats {
  assessmentId: ID;
  participantCount: number;
  completedCount: number;
  averageScore: number | null;
  passingRate: number | null;
  attempts: Attempt[];
}

export const deriveAssessmentStats = (
  assessmentId: ID,
  attempts: Attempt[],
  passingThreshold: number = 70
): AssessmentStats => {
  const count = attempts.length;
  const completed = attempts.filter((a) => a.status === 'completed');
  const completedCount = completed.length;

  if (completedCount === 0) {
    return {
      assessmentId,
      participantCount: count,
      completedCount: 0,
      averageScore: null,
      passingRate: null,
      attempts,
    };
  }

  const totalScore = completed.reduce((acc, a) => acc + (a.percentage || 0), 0);
  const averageScore = Math.round(totalScore / completedCount);
  const passedCount = completed.filter((a) => a.percentage >= passingThreshold).length;
  const passingRate = Math.round((passedCount / completedCount) * 100);

  return {
    assessmentId,
    participantCount: count,
    completedCount,
    averageScore,
    passingRate,
    attempts,
  };
};

