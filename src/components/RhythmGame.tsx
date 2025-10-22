'use client';

import { useEffect, useState } from 'react';
import { GameCanvas } from './GameCanvas';
import { ScoreBoard } from './ScoreBoard';
import { GameResult } from './GameResult';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import { useGameStore } from '@/store/useGameStore';
import type { BeatMap, GameConfig } from '@/types/game.types';

interface RhythmGameProps {
  beatMap: BeatMap;
  config: GameConfig;
}

export function RhythmGame({ beatMap, config }: RhythmGameProps) {
  const { gameState, setNotes, resetGame, notes, currentTime, setGameState, keyPressEffects } =
    useGameStore();
  const { play, pause, reset } = useAudioPlayer(beatMap.audioUrl, beatMap.offset || 0);
  const [canvasWidth, setCanvasWidth] = useState<number>(400);

  useKeyboardInput(config);

  // Check if a lane is currently being pressed
  const isLanePressed = (lane: number) => {
    return keyPressEffects.some(
      (effect) => effect.lane === lane && currentTime - effect.timestamp < 100,
    );
  };

  // Reset game on mount and when beatMap changes
  useEffect(() => {
    resetGame();
    setNotes(beatMap.notes);
  }, [beatMap, resetGame, setNotes]);

  // Check if game should finish (all notes processed)
  useEffect(() => {
    if (gameState === 'playing' && notes.length > 0) {
      const lastNote = notes[notes.length - 1];
      const allNotesProcessed = notes.every((note) => note.hit);
      const timePassedLastNote = currentTime > (lastNote?.timing || 0) + 2000;

      if (allNotesProcessed || timePassedLastNote) {
        setGameState('finished');
      }
    }
  }, [gameState, notes, currentTime, setGameState]);

  const handleStart = () => {
    if (gameState === 'ready' || gameState === 'finished') {
      resetGame();
      setNotes(beatMap.notes);
      play();
    } else if (gameState === 'paused') {
      play();
    }
  };

  const handlePause = () => {
    pause();
  };

  const handleReset = () => {
    // Reset and immediately restart the game
    resetGame(); // Reset game state first (sets gameState to 'ready', currentTime to 0)
    reset(); // Reset audio player
    setNotes(beatMap.notes); // Reload notes

    // Small delay to ensure state is updated before playing
    setTimeout(() => {
      play();
    }, 10);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full max-w-7xl mx-auto px-4 min-h-0">
        {/* Game Canvas Section */}
        <div className="flex flex-col flex-1 order-2 lg:order-1 items-center min-h-0">
          <GameCanvas config={config} onWidthChange={setCanvasWidth} />

          {/* Controls aligned with lanes */}
          <div
            className="flex flex-row gap-0 text-center mt-2"
            style={{ width: `${canvasWidth}px` }}
          >
            <Button
              variant="pixel-lane-1"
              className={`flex flex-1 text-xs sm:text-sm md:text-base transition-all ${
                isLanePressed(0) && gameState === 'playing' ? 'scale-95 brightness-150' : ''
              }`}
              disabled={gameState !== 'playing'}
            >
              D
            </Button>
            <Button
              variant="pixel-lane-2"
              className={`flex flex-1 text-xs sm:text-sm md:text-base transition-all ${
                isLanePressed(1) && gameState === 'playing' ? 'scale-95 brightness-150' : ''
              }`}
              disabled={gameState !== 'playing'}
            >
              F
            </Button>
            <Button
              variant="pixel-lane-3"
              className={`flex flex-1 text-xs sm:text-sm md:text-base transition-all ${
                isLanePressed(2) && gameState === 'playing' ? 'scale-95 brightness-150' : ''
              }`}
              disabled={gameState !== 'playing'}
            >
              J
            </Button>
            <Button
              variant="pixel-lane-4"
              className={`flex flex-1 text-xs sm:text-sm md:text-base transition-all ${
                isLanePressed(3) && gameState === 'playing' ? 'scale-95 brightness-150' : ''
              }`}
              disabled={gameState !== 'playing'}
            >
              K
            </Button>
          </div>
        </div>

        {/* Song Info & Controls */}
        <Card variant="pixel" className="p-3 sm:p-4 order-1 lg:order-2 lg:w-80 xl:w-96">
          <CardContent className="p-0 space-y-3 sm:space-y-4">
            <div>
              <h2 className="text-sm sm:text-base md:text-xl font-bold text-pixel-neon-magenta break-words">
                {beatMap.title}
              </h2>
              <p className="text-xs sm:text-sm text-pixel-neon-cyan">{beatMap.artist}</p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4">
              <p className="text-xs text-pixel-neon-yellow">BPM:{beatMap.bpm}</p>
              {gameState === 'playing' && (
                <>
                  <p className="text-xs text-pixel-neon-yellow">
                    T:{(currentTime / 1000).toFixed(1)}s
                  </p>
                  <p className="text-xs text-pixel-neon-yellow">
                    N:{notes.filter((n) => !n.hit).length}/{notes.length}
                  </p>
                </>
              )}
            </div>

            <ScoreBoard />

            {/* Game Controls */}
            <div className="space-y-2">
              {gameState === 'ready' ? (
                <Button
                  onClick={handleStart}
                  variant="pixel-success"
                  size="lg"
                  className="w-full text-xs sm:text-sm"
                >
                  ▶ START
                </Button>
              ) : gameState === 'playing' ? (
                <>
                  <Button
                    onClick={handlePause}
                    variant="pixel-warning"
                    className="w-full text-xs sm:text-sm"
                  >
                    ❚❚ PAUSE
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="pixel-danger"
                    className="w-full text-xs sm:text-sm"
                  >
                    ↻ RESTART
                  </Button>
                </>
              ) : gameState === 'paused' ? (
                <>
                  <Button
                    onClick={handleStart}
                    variant="pixel"
                    className="w-full text-xs sm:text-sm"
                  >
                    ▶ RESUME
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="pixel-danger"
                    className="w-full text-xs sm:text-sm"
                  >
                    ↻ RESTART
                  </Button>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Result Screen */}
      {gameState === 'finished' && <GameResult onRestart={handleStart} />}
    </>
  );
}
