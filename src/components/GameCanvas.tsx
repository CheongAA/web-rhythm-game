'use client';

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import type { Note, GameConfig } from '@/types/game.types';

interface GameCanvasProps {
  config: GameConfig;
  onWidthChange?: (width: number) => void;
}

const BASE_CANVAS_HEIGHT = 600;
const BASE_LANE_WIDTH = 100;
const NOTE_HEIGHT = 20;

export function GameCanvas({ config, onWidthChange }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameIdRef = useRef<number>();
  const [dimensions, setDimensions] = useState({
    width: BASE_LANE_WIDTH * 4,
    height: BASE_CANVAS_HEIGHT,
  });

  // Handle responsive canvas sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const maxWidth = BASE_LANE_WIDTH * config.lanes;

      // Scale canvas to fit container while maintaining aspect ratio
      const scale = Math.min(1, containerWidth / maxWidth);
      const width = maxWidth * scale;
      const height = BASE_CANVAS_HEIGHT * scale;

      setDimensions({ width, height });

      // Notify parent of width change
      if (onWidthChange) {
        onWidthChange(width);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, [config.lanes, onWidthChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate scale factor for responsive drawing
    const scale = dimensions.width / (BASE_LANE_WIDTH * config.lanes);
    const LANE_WIDTH = BASE_LANE_WIDTH * scale;
    const CANVAS_HEIGHT = BASE_CANVAS_HEIGHT * scale;
    const HIT_LINE_Y = CANVAS_HEIGHT - 100 * scale;

    const render = () => {
      const { notes, currentTime, gameState, keyPressEffects, judgmentEffects } =
        useGameStore.getState();

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw lanes
      drawLanes(ctx, config.lanes, LANE_WIDTH, CANVAS_HEIGHT);

      // Draw hit line
      drawHitLine(ctx, config.lanes, LANE_WIDTH, HIT_LINE_Y);

      // Draw key press effects
      keyPressEffects.forEach((effect) => {
        drawKeyPressEffect(
          ctx,
          effect.lane,
          currentTime - effect.timestamp,
          LANE_WIDTH,
          HIT_LINE_Y,
          scale,
        );
      });

      // Draw notes only when playing
      if (gameState === 'playing') {
        notes.forEach((note) => {
          if (!note.hit) {
            drawNote(ctx, note, currentTime, config.noteSpeed, LANE_WIDTH, HIT_LINE_Y, scale);
          }
        });
      }

      // Draw judgment effects
      judgmentEffects.forEach((effect) => {
        drawJudgmentEffect(
          ctx,
          effect.judgment,
          effect.lane,
          currentTime - effect.timestamp,
          LANE_WIDTH,
          HIT_LINE_Y,
          scale,
        );
      });

      // Continue animation loop
      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    // Start rendering
    animationFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [config, dimensions]);

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="pixel-panel max-w-full"
        style={{ backgroundColor: '#000', imageRendering: 'pixelated' }}
      />
    </div>
  );
}

function drawLanes(
  ctx: CanvasRenderingContext2D,
  lanes: number,
  LANE_WIDTH: number,
  CANVAS_HEIGHT: number,
) {
  // Draw alternating lane backgrounds
  for (let i = 0; i < lanes; i++) {
    const x = i * LANE_WIDTH;
    ctx.fillStyle = i % 2 === 0 ? '#0a0a1a' : '#050510';
    ctx.fillRect(x, 0, LANE_WIDTH, CANVAS_HEIGHT);
  }

  // Draw lane borders
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 3;

  for (let i = 0; i <= lanes; i++) {
    const x = i * LANE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }
}

function drawHitLine(
  ctx: CanvasRenderingContext2D,
  lanes: number,
  LANE_WIDTH: number,
  HIT_LINE_Y: number,
) {
  // Draw glowing hit line
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, HIT_LINE_Y);
  ctx.lineTo(LANE_WIDTH * lanes, HIT_LINE_Y);
  ctx.stroke();

  // Add glow effect
  ctx.shadowColor = '#00ff00';
  ctx.shadowBlur = 10;
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, HIT_LINE_Y);
  ctx.lineTo(LANE_WIDTH * lanes, HIT_LINE_Y);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawNote(
  ctx: CanvasRenderingContext2D,
  note: Note,
  currentTime: number,
  noteSpeed: number,
  LANE_WIDTH: number,
  HIT_LINE_Y: number,
  scale: number,
) {
  const timeDiff = note.timing - currentTime;
  const y = HIT_LINE_Y - (timeDiff / 1000) * noteSpeed * scale;

  // Only draw if note is visible on screen (0 to HIT_LINE_Y + a bit below)
  // Don't draw notes that are still above the canvas
  if (y < 0 || y > HIT_LINE_Y + 100) return;

  const x = note.lane * LANE_WIDTH;
  const width = LANE_WIDTH - 10 * scale;

  // Lane colors
  const laneColors = ['#ff0080', '#00ff80', '#0080ff', '#ffff00'];
  const noteColor = laneColors[note.lane % laneColors.length] || '#ffffff';

  // Draw note based on type
  const scaledNoteHeight = NOTE_HEIGHT * scale;
  if (note.type === 'normal') {
    // Main note body
    ctx.fillStyle = noteColor;
    ctx.fillRect(x + 5 * scale, y, width, scaledNoteHeight);

    // Pixel-style border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3 * scale;
    ctx.strokeRect(x + 5 * scale, y, width, scaledNoteHeight);

    // Inner shadow
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(x + 7 * scale, y + 2 * scale, width - 4 * scale, scaledNoteHeight - 4 * scale);
  } else if (note.type === 'long' && note.endTiming) {
    const endTimeDiff = note.endTiming - currentTime;
    const endY = HIT_LINE_Y - (endTimeDiff / 1000) * noteSpeed * scale;
    const height = Math.max(y - endY, scaledNoteHeight);

    // Long note body
    ctx.fillStyle = noteColor;
    ctx.fillRect(x + 5 * scale, endY, width, height);

    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3 * scale;
    ctx.strokeRect(x + 5 * scale, endY, width, height);
  }
}

function drawKeyPressEffect(
  ctx: CanvasRenderingContext2D,
  lane: number,
  age: number,
  LANE_WIDTH: number,
  HIT_LINE_Y: number,
  scale: number,
) {
  // age is in milliseconds
  const maxAge = 200;
  if (age > maxAge) return;

  const progress = age / maxAge;
  const alpha = 1 - progress;

  const x = lane * LANE_WIDTH;
  const y = HIT_LINE_Y;

  // Draw expanding circle
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.arc(x + LANE_WIDTH / 2, y, (10 + progress * 30) * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Draw flash at hit line
  ctx.save();
  ctx.globalAlpha = alpha * 0.5;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 5 * scale, y - 5 * scale, LANE_WIDTH - 10 * scale, 10 * scale);
  ctx.restore();
}

function drawJudgmentEffect(
  ctx: CanvasRenderingContext2D,
  judgment: string,
  lane: number,
  age: number,
  LANE_WIDTH: number,
  HIT_LINE_Y: number,
  scale: number,
) {
  // age is in milliseconds
  const maxAge = 1000;
  if (age > maxAge) return;

  const progress = age / maxAge;
  const alpha = 1 - progress;

  const x = lane * LANE_WIDTH + LANE_WIDTH / 2;
  const y = HIT_LINE_Y - 50 * scale - progress * (30 * scale); // Float upward

  const colors = {
    perfect: '#00ffff',
    great: '#00ff00',
    good: '#ffff00',
    miss: '#ff0000',
  };

  const texts = {
    perfect: 'PERFECT',
    great: 'GREAT',
    good: 'GOOD',
    miss: 'MISS',
  };

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `bold ${16 * scale}px "Press Start 2P", monospace`;
  ctx.fillStyle = colors[judgment as keyof typeof colors] || '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Outline for pixel effect
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4 * scale;
  ctx.strokeText(texts[judgment as keyof typeof texts] || judgment.toUpperCase(), x, y);

  // Fill text
  ctx.fillText(texts[judgment as keyof typeof texts] || judgment.toUpperCase(), x, y);

  // Add glow for retro effect
  ctx.shadowColor = colors[judgment as keyof typeof colors] || '#ffffff';
  ctx.shadowBlur = 8 * scale;
  ctx.fillText(texts[judgment as keyof typeof texts] || judgment.toUpperCase(), x, y);

  ctx.restore();
}
