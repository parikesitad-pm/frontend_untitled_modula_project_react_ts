import React, { useState, useEffect } from 'react';
import type {
  Assessment,
  Question,
  QuestionDraft,
  Attempt,
  LeaderboardEntry,
  LiveSession,
  LiveParticipant,
} from '@/domain';
import {
  LocalAssessmentRepository,
  LocalAttemptRepository,
  LocalLeaderboardRepository,
  LocalLiveSessionRepository,
  sortLeaderboardEntries,
} from '@/domain';
import { AssessmentContext } from '@/context/AssessmentContextCore';

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    return LocalAssessmentRepository.loadAll();
  });

  const [submissions, setSubmissions] = useState<Record<string, Attempt[]>>(() => {
    return LocalAttemptRepository.loadAll();
  });

  const [leaderboards, setLeaderboards] = useState<Record<string, LeaderboardEntry[]>>(() => {
    return LocalLeaderboardRepository.loadAll();
  });

  const [liveSessions, setLiveSessions] = useState<Record<string, LiveSession>>(() => {
    return LocalLiveSessionRepository.loadAll();
  });

  useEffect(() => {
    LocalAssessmentRepository.persistAll(assessments);
  }, [assessments]);

  useEffect(() => {
    LocalAttemptRepository.persistAll(submissions);
  }, [submissions]);

  useEffect(() => {
    LocalLeaderboardRepository.persistAll(leaderboards);
  }, [leaderboards]);

  useEffect(() => {
    LocalLiveSessionRepository.persistAll(liveSessions);
  }, [liveSessions]);

  const getAssessmentById = (id: string) => {
    return assessments.find((a) => a.id === id);
  };

  const getAssessmentBySlug = (slug: string) => {
    return assessments.find((a) => a.slug === slug || a.id === slug);
  };

  const createAssessment = (partial: Partial<Assessment>): Assessment => {
    const title = partial.title || 'Untitled Assessment';
    const slug = partial.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `asm-${Date.now().toString(36)}`;

    const newAssessment: Assessment = {
      id: `asm-${Date.now().toString(36)}`,
      title,
      description: partial.description || 'Description of your assessment...',
      slug,
      mode: partial.mode || 'quiz',
      presentationMode: partial.presentationMode || 'formal',
      status: 'draft',
      participantCount: 0,
      averageScore: 0,
      completionRate: 0,
      timeLimitEnabled: partial.timeLimitEnabled ?? true,
      activityTimeLimitSeconds: partial.activityTimeLimitSeconds ?? 300,
      leaderboardEnabled: partial.leaderboardEnabled ?? true,
      scoreVisible: partial.scoreVisible ?? true,
      rankVisible: partial.rankVisible ?? true,
      bannerUrl: partial.bannerUrl ?? null,
      ownerId: partial.ownerId,
      createdBy: partial.createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        showLeaderboard: partial.settings?.showLeaderboard ?? true,
        showScore: partial.settings?.showScore ?? true,
        showTimer: partial.settings?.showTimer ?? true,
        soundEnabled: partial.settings?.soundEnabled ?? false,
        shuffleQuestions: partial.settings?.shuffleQuestions ?? false,
        allowBackNavigation: partial.settings?.allowBackNavigation ?? true,
        requireAuth: partial.settings?.requireAuth ?? false,
        passPercentage: partial.settings?.passPercentage ?? 70,
        themeStyle: partial.settings?.themeStyle ?? 'dark-formal',
        timeLimitTotalMinutes: partial.settings?.timeLimitTotalMinutes,
      },
      blocks: partial.blocks || [
        {
          id: `blk-${Date.now().toString(36)}`,
          type: 'choice',
          title: 'What is your primary design priority?',
          points: 20,
          required: true,
          options: [
            { id: 'opt-1', label: 'Option A: Robustness & strict correctness', value: 'opt-1', text: 'Option A: Robustness & strict correctness', isCorrect: true, color: 'coral' },
            { id: 'opt-2', label: 'Option B: Velocity & playful engagement', value: 'opt-2', text: 'Option B: Velocity & playful engagement', isCorrect: false, color: 'sky' },
            { id: 'opt-3', label: 'Option C: Modular extensibility', value: 'opt-3', text: 'Option C: Modular extensibility', isCorrect: false, color: 'gold' },
            { id: 'opt-4', label: 'Option D: Minimal maintenance overhead', value: 'opt-4', text: 'Option D: Minimal maintenance overhead', isCorrect: false, color: 'mint' },
          ],
        }
      ],
    };

    setAssessments((prev) => [newAssessment, ...prev]);
    return newAssessment;
  };

  const updateAssessment = (id: string, updates: Partial<Assessment>) => {
    setAssessments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a))
    );
  };

  const deleteAssessment = (id: string) => {
    setAssessments((prev) => prev.filter((a) => a.id !== id));
  };

  const duplicateAssessment = (id: string): Assessment => {
    const source = assessments.find((a) => a.id === id);
    if (!source) throw new Error('Assessment not found');

    const cloned: Assessment = {
      ...source,
      id: `asm-${Date.now().toString(36)}`,
      title: `${source.title} (Copy)`,
      slug: `${source.slug}-copy-${Date.now().toString(36).slice(-4)}`,
      status: 'draft',
      participantCount: 0,
      averageScore: 0,
      completionRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blocks: source.blocks.map((b) => ({
        ...b,
        id: `blk-${Math.random().toString(36).substring(2, 9)}`,
        options: 'options' in b && b.options
          ? b.options.map((o) => ({ ...o, id: `opt-${Math.random().toString(36).substring(2, 9)}` }))
          : undefined,
      })) as Question[],
    };

    setAssessments((prev) => [cloned, ...prev]);
    return cloned;
  };

  const addBlock = (assessmentId: string, blockData: QuestionDraft) => {
    const newBlock: Question = {
      ...blockData,
      id: `blk-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    } as Question;

    setAssessments((prev) =>
      prev.map((a) => (a.id === assessmentId ? { ...a, blocks: [...a.blocks, newBlock], updatedAt: new Date().toISOString() } : a))
    );
  };

  const updateBlock = (assessmentId: string, blockId: string, updates: Partial<Question>) => {
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === assessmentId
          ? {
              ...a,
              updatedAt: new Date().toISOString(),
              blocks: a.blocks.map((b) => (b.id === blockId ? ({ ...b, ...updates } as Question) : b)),
            }
          : a
      )
    );
  };

  const deleteBlock = (assessmentId: string, blockId: string) => {
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === assessmentId
          ? {
              ...a,
              updatedAt: new Date().toISOString(),
              blocks: a.blocks.filter((b) => b.id !== blockId),
            }
          : a
      )
    );
  };

  const duplicateBlock = (assessmentId: string, blockId: string) => {
    setAssessments((prev) =>
      prev.map((a) => {
        if (a.id !== assessmentId) return a;
        const blockIndex = a.blocks.findIndex((b) => b.id === blockId);
        if (blockIndex === -1) return a;
        const sourceBlock = a.blocks[blockIndex];
        const newBlock: Question = {
          ...sourceBlock,
          id: `blk-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          title: `${sourceBlock.title} (Copy)`,
          options: 'options' in sourceBlock && sourceBlock.options
            ? sourceBlock.options.map((o) => ({
                ...o,
                id: `opt-${Math.random().toString(36).substring(2, 9)}`,
              }))
            : undefined,
        } as Question;
        const newBlocks = [...a.blocks];
        newBlocks.splice(blockIndex + 1, 0, newBlock);
        return { ...a, blocks: newBlocks, updatedAt: new Date().toISOString() };
      })
    );
  };

  const reorderBlocks = (assessmentId: string, startIndex: number, endIndex: number) => {
    setAssessments((prev) =>
      prev.map((a) => {
        if (a.id !== assessmentId) return a;
        const newBlocks = [...a.blocks];
        const [moved] = newBlocks.splice(startIndex, 1);
        newBlocks.splice(endIndex, 0, moved);
        return { ...a, blocks: newBlocks, updatedAt: new Date().toISOString() };
      })
    );
  };

  const submitAssessment = (
    assessmentId: string,
    submissionData: Omit<Attempt, 'id'>
  ): Attempt => {
    const newSubmission: Attempt = {
      ...submissionData,
      id: `sub-${Date.now().toString(36)}`,
      totalDurationMs: submissionData.totalDurationMs ?? (submissionData.totalTimeSeconds ? submissionData.totalTimeSeconds * 1000 : null),
    };

    setSubmissions((prev) => ({
      ...prev,
      [assessmentId]: [newSubmission, ...(prev[assessmentId] || [])],
    }));

    const assessment = assessments.find((a) => a.id === assessmentId);
    if (assessment) {
      const currentSubs = submissions[assessmentId] || [];
      const allSubs = [newSubmission, ...currentSubs];
      const completedSubs = allSubs.filter((s) => s.status === 'completed');
      const count = allSubs.length;
      const totalScore = completedSubs.reduce((acc, s) => acc + s.percentage, 0);
      const avg = completedSubs.length ? Math.round(totalScore / completedSubs.length) : newSubmission.percentage;
      const completionRate = Math.round((completedSubs.length / count) * 100);

      updateAssessment(assessmentId, {
        participantCount: count,
        averageScore: avg,
        completionRate,
      });

      if (assessment.leaderboardEnabled) {
        const slug = assessment.slug;
        const newLeaderboardEntry: LeaderboardEntry = {
          rank: 1,
          participantId: newSubmission.participantId || newSubmission.id,
          displayName: newSubmission.participantName || 'Candidate',
          participantName: newSubmission.participantName || 'Candidate',
          score: newSubmission.score,
          totalDurationMs: newSubmission.totalDurationMs,
          timeSeconds: newSubmission.totalTimeSeconds,
          completedAt: 'Just now',
        };

        const existingBoard = leaderboards[slug] || [];
        const combined = sortLeaderboardEntries([...existingBoard, newLeaderboardEntry]);

        setLeaderboards((prev) => ({
          ...prev,
          [slug]: combined,
        }));
      }
    }

    return newSubmission;
  };

  const getLiveSession = (assessmentId: string): LiveSession => {
    const assessment = assessments.find((a) => a.id === assessmentId);
    const existing = liveSessions[assessmentId];
    if (existing) return existing;

    const fallbackUrl = assessment ? `${window.location.origin}/${assessment.slug}/start` : '';
    return LocalLiveSessionRepository.createDefault(assessmentId, fallbackUrl);
  };

  const startLiveSession = (assessmentId: string) => {
    setLiveSessions((prev) => {
      const current = prev[assessmentId] || getLiveSession(assessmentId);
      return {
        ...prev,
        [assessmentId]: {
          ...current,
          status: 'live',
          startedAt: new Date().toISOString(),
        },
      };
    });
  };

  const addLiveParticipant = (assessmentId: string, participant: Omit<LiveParticipant, 'id' | 'joinedAt'>) => {
    setLiveSessions((prev) => {
      const current = prev[assessmentId] || getLiveSession(assessmentId);
      const newParticipant: LiveParticipant = {
        ...participant,
        id: `lp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
        status: participant.status || 'joined',
        joinedAt: 'Just now',
      };
      return {
        ...prev,
        [assessmentId]: {
          ...current,
          participants: [newParticipant, ...current.participants],
        },
      };
    });
  };

  const resetLiveSession = (assessmentId: string) => {
    const assessment = assessments.find((a) => a.id === assessmentId);
    const url = assessment ? `${window.location.origin}/${assessment.slug}/start` : '';
    setLiveSessions((prev) => ({
      ...prev,
      [assessmentId]: LocalLiveSessionRepository.createDefault(assessmentId, url),
    }));
  };

  return (
    <AssessmentContext.Provider
      value={{
        assessments,
        submissions,
        leaderboards,
        liveSessions,
        getAssessmentById,
        getAssessmentBySlug,
        createAssessment,
        updateAssessment,
        deleteAssessment,
        duplicateAssessment,
        addBlock,
        updateBlock,
        deleteBlock,
        duplicateBlock,
        reorderBlocks,
        submitAssessment,
        getLiveSession,
        startLiveSession,
        addLiveParticipant,
        resetLiveSession,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
