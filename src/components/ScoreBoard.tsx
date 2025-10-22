'use client';

import { useGameStore } from '@/store/useGameStore';
import { Card, CardContent } from './ui/card';

export function ScoreBoard() {
  const { score } = useGameStore();

  return (
    <Card variant="pixel" className="p-3 sm:p-4">
      <CardContent className="p-0 space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center gap-2">
          <div>
            <p className="text-[10px] sm:text-xs text-pixel-neon-cyan">SCORE</p>
            <p className="text-base sm:text-xl md:text-2xl font-bold text-pixel-neon-yellow">
              {score.score.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] sm:text-xs text-pixel-neon-cyan">COMBO</p>
            <p className="text-base sm:text-xl md:text-2xl font-bold text-pixel-neon-magenta">
              {score.combo}x
            </p>
          </div>
        </div>

        <div className="border-t-2 border-black pt-2 sm:pt-3">
          <p className="text-[10px] sm:text-xs mb-2 text-pixel-neon-cyan">JUDGMENTS</p>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
            <div className="flex justify-between">
              <span className="text-pixel-judgment-perfect">PERF:</span>
              <span className="font-mono text-white">{score.judgments.perfect}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pixel-judgment-great">GREAT:</span>
              <span className="font-mono text-white">{score.judgments.great}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pixel-judgment-good">GOOD:</span>
              <span className="font-mono text-white">{score.judgments.good}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pixel-judgment-miss">MISS:</span>
              <span className="font-mono text-white">{score.judgments.miss}</span>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-black pt-2 sm:pt-3">
          <div className="flex justify-between text-[10px] sm:text-xs">
            <span className="text-pixel-neon-cyan">MAX COMBO:</span>
            <span className="font-mono font-bold text-pixel-neon-magenta">{score.maxCombo}x</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
