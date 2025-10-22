'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';

export function useAudioPlayer(audioUrl?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const { setCurrentTime, setGameState } = useGameStore();

  useEffect(() => {
    if (audioUrl && typeof window !== 'undefined') {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('ended', () => {
        setGameState('finished');
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

    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime * 1000);
    } else {
      // No audio - use performance.now() for timing
      setCurrentTime(performance.now() - startTimeRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(updateTime);
  }, [setCurrentTime]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
    } else {
      // Start timer for no-audio mode
      startTimeRef.current = performance.now();
    }
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
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    startTimeRef.current = 0;
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
