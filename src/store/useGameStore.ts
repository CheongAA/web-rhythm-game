import { create } from 'zustand';
import type { GameState, GameScore, Note, JudgmentType } from '@/types/game.types';

interface JudgmentEffect {
  id: string;
  judgment: JudgmentType;
  lane: number;
  timestamp: number;
}

interface KeyPressEffect {
  lane: number;
  timestamp: number;
}

interface GameStore {
  gameState: GameState;
  score: GameScore;
  currentTime: number;
  notes: Note[];
  judgmentEffects: JudgmentEffect[];
  keyPressEffects: KeyPressEffect[];
  setGameState: (state: GameState) => void;
  setCurrentTime: (time: number) => void;
  setNotes: (notes: Note[]) => void;
  addJudgment: (judgment: JudgmentType, noteId: string) => void;
  addKeyPressEffect: (lane: number) => void;
  resetGame: () => void;
}

const initialScore: GameScore = {
  score: 0,
  combo: 0,
  maxCombo: 0,
  judgments: {
    perfect: 0,
    great: 0,
    good: 0,
    miss: 0,
  },
};

const SCORE_VALUES = {
  perfect: 300,
  great: 200,
  good: 100,
  miss: 0,
};

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'ready',
  score: initialScore,
  currentTime: 0,
  notes: [],
  judgmentEffects: [],
  keyPressEffects: [],

  setGameState: (state) =>
    set({
      gameState: state,
      // Clear effects when game finishes
      ...(state === 'finished' && { judgmentEffects: [], keyPressEffects: [] }),
    }),

  setCurrentTime: (time) =>
    set((state) => ({
      currentTime: time,
      // Clean up old effects (older than 1 second)
      judgmentEffects: state.judgmentEffects.filter((e) => time - e.timestamp < 1000),
      keyPressEffects: state.keyPressEffects.filter((e) => time - e.timestamp < 200),
    })),

  setNotes: (notes) => set({ notes }),

  addJudgment: (judgment, noteId) =>
    set((state) => {
      const newCombo = judgment === 'miss' ? 0 : state.score.combo + 1;
      const scoreIncrease = SCORE_VALUES[judgment] * (newCombo > 0 ? 1 + newCombo * 0.01 : 1);

      const note = state.notes.find((n) => n.id === noteId);

      return {
        score: {
          score: state.score.score + Math.floor(scoreIncrease),
          combo: newCombo,
          maxCombo: Math.max(state.score.maxCombo, newCombo),
          judgments: {
            ...state.score.judgments,
            [judgment]: state.score.judgments[judgment] + 1,
          },
        },
        notes: state.notes.map((n) => (n.id === noteId ? { ...n, hit: true, judgment } : n)),
        judgmentEffects: note
          ? [
              ...state.judgmentEffects,
              {
                id: noteId,
                judgment,
                lane: note.lane,
                timestamp: state.currentTime,
              },
            ]
          : state.judgmentEffects,
      };
    }),

  addKeyPressEffect: (lane) =>
    set((state) => ({
      keyPressEffects: [
        ...state.keyPressEffects,
        {
          lane,
          timestamp: state.currentTime,
        },
      ],
    })),

  resetGame: () =>
    set({
      gameState: 'ready',
      score: initialScore,
      currentTime: 0,
      notes: [],
      judgmentEffects: [],
      keyPressEffects: [],
    }),
}));
