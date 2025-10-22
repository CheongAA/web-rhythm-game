'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';

export function useAudioPlayer(audioUrl?: string, offset: number = 0) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const offsetStartTimeRef = useRef<number>(0);
  const { setCurrentTime, setGameState } = useGameStore();

  useEffect(() => {
    if (audioUrl && typeof window !== 'undefined') {
      audioRef.current = new Audio(audioUrl);

      // Preload audio for better sync
      audioRef.current.preload = 'auto';
      audioRef.current.load();

      // Pre-warm the audio element by loading it completely
      const loadPromise = new Promise<void>((resolve) => {
        if (audioRef.current) {
          audioRef.current.addEventListener('canplaythrough', () => resolve(), { once: true });
          audioRef.current.addEventListener('error', () => resolve(), { once: true });
        } else {
          resolve();
        }
      });

      audioRef.current.addEventListener('ended', () => {
        setGameState('finished');
      });

      // Start loading immediately
      loadPromise.catch(() => {
        // Ignore errors, game will still work
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioUrl, setGameState]);

  const updateTime = useCallback(() => {
    const currentState = useGameStore.getState().gameState;

    // Stop updating if game is finished or paused
    if (currentState !== 'playing') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const elapsed = performance.now() - offsetStartTimeRef.current;

    // Start audio after offset delay
    if (elapsed >= offset && audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch((error) => {
        console.error('Audio play failed:', error);
      });
    }

    // Set current time (starts at negative offset, reaches 0 when audio starts)
    // This allows notes to appear from offscreen before the music starts
    const gameTime = elapsed - offset;
    setCurrentTime(gameTime);

    animationFrameRef.current = requestAnimationFrame(updateTime);
  }, [setCurrentTime, offset]);

  const play = useCallback(() => {
    // Start game timer immediately (audio will start after offset)
    offsetStartTimeRef.current = performance.now();
    setGameState('playing');
    animationFrameRef.current = requestAnimationFrame(updateTime);
  }, [setGameState, updateTime]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setGameState('paused');
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [setGameState]);

  const reset = useCallback(() => {
    // Stop animation first
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Reset audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Reset all time references
    startTimeRef.current = 0;
    offsetStartTimeRef.current = 0;

    // Reset game state
    setCurrentTime(0);
    setGameState('ready');
  }, [setCurrentTime, setGameState]);

  return {
    play,
    pause,
    reset,
    audio: audioRef.current,
  };
}
