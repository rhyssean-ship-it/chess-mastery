import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { localDateKey } from '../utils/dateKey';

const DEFAULT_STATE = {
  easeFactor: 2.5,
  interval: 1,
  repetitions: 0,
  lastSeen: null,
  nextReview: null,
};

export function useSpacedRepetition() {
  const [srData, setSrData] = useLocalStorage('spaced-repetition', {});

  const getPuzzleState = useCallback((puzzleId) => {
    return srData[puzzleId] || { ...DEFAULT_STATE };
  }, [srData]);

  const isDue = useCallback((puzzleId) => {
    const state = srData[puzzleId];
    if (!state || !state.nextReview) return true;
    return localDateKey() >= state.nextReview;
  }, [srData]);

  const getDueCount = useCallback((puzzleIds) => {
    return puzzleIds.filter(id => isDue(id)).length;
  }, [isDue]);

  const getUnseenCount = useCallback((puzzleIds) => {
    return puzzleIds.filter(id => !srData[id]).length;
  }, [srData]);

  const updateAfterReview = useCallback((puzzleId, quality) => {
    // quality: 'easy' | 'medium' | 'hard'
    setSrData(prev => {
      const state = prev[puzzleId] || { ...DEFAULT_STATE };
      const today = localDateKey();
      let { easeFactor, interval, repetitions } = state;

      if (quality === 'hard') {
        interval = 1;
        easeFactor = Math.max(1.3, easeFactor - 0.2);
        repetitions = 0;
      } else if (quality === 'medium') {
        if (repetitions === 0) interval = 1;
        else if (repetitions === 1) interval = 3;
        else interval = Math.round(interval * easeFactor);
        repetitions += 1;
      } else {
        // easy
        if (repetitions === 0) interval = 2;
        else if (repetitions === 1) interval = 4;
        else interval = Math.round(interval * easeFactor);
        easeFactor = Math.min(3.0, easeFactor + 0.15);
        repetitions += 1;
      }

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + interval);

      return {
        ...prev,
        [puzzleId]: {
          easeFactor,
          interval,
          repetitions,
          lastSeen: today,
          nextReview: localDateKey(nextDate),
        },
      };
    });
  }, [setSrData]);

  return { getPuzzleState, isDue, getDueCount, getUnseenCount, updateAfterReview, srData };
}
