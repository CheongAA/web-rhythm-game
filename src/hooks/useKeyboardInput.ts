'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import type { GameConfig, JudgmentType } from '@/types/game.types';

// Use KeyboardEvent.code instead of .key to support non-English keyboards
const KEY_LANES: Record<string, number> = {
  KeyD: 0,
  KeyF: 1,
  KeyJ: 2,
  KeyK: 3,
};

export function useKeyboardInput(config: GameConfig) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const lane = KEY_LANES[e.code];

      if (lane !== undefined) {
        e.preventDefault();

        const { notes, currentTime, gameState, addJudgment, addKeyPressEffect } =
          useGameStore.getState();

        if (gameState !== 'playing') {
          return;
        }

        // Add visual feedback for key press
        addKeyPressEffect(lane);

        // Find the closest unhit note in this lane
        const laneNotes = notes
          .filter((note) => note.lane === lane && !note.hit)
          .sort((a, b) => Math.abs(a.timing - currentTime) - Math.abs(b.timing - currentTime));

        const closestNote = laneNotes[0];

        if (!closestNote) {
          return;
        }

        const timeDiff = Math.abs(closestNote.timing - currentTime);

        let judgment: JudgmentType | null = null;

        if (timeDiff <= config.judgmentWindows.perfect) {
          judgment = 'perfect';
        } else if (timeDiff <= config.judgmentWindows.great) {
          judgment = 'great';
        } else if (timeDiff <= config.judgmentWindows.good) {
          judgment = 'good';
        }

        if (judgment) {
          addJudgment(judgment, closestNote.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config]);

  // Auto-miss notes that passed the hit window
  useEffect(() => {
    const interval = setInterval(() => {
      const { notes, currentTime, gameState, addJudgment } = useGameStore.getState();

      if (gameState !== 'playing') return;

      const missedNotes = notes.filter(
        (note) =>
          !note.hit &&
          currentTime > note.timing + config.judgmentWindows.good &&
          currentTime < note.timing + config.judgmentWindows.good + 100,
      );

      missedNotes.forEach((note) => {
        addJudgment('miss', note.id);
      });
    }, 16); // Check every frame (~60fps)

    return () => clearInterval(interval);
  }, [config.judgmentWindows.good]);
}
