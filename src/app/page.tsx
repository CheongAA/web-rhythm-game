'use client';

import { RhythmGame } from '@/components/RhythmGame';
import { sampleBeatMap } from '@/data/sampleBeatMap';
import type { GameConfig } from '@/types/game.types';

const gameConfig: GameConfig = {
  lanes: 4,
  noteSpeed: 300, // pixels per second
  judgmentWindows: {
    perfect: 100, // ms
    great: 200,
    good: 300,
  },
};

export default function Page() {
  return (
    <main className="h-screen bg-black overflow-auto flex items-center justify-center py-4 sm:py-8">
      <div className="w-full relative z-10">
        <RhythmGame beatMap={sampleBeatMap} config={gameConfig} />
      </div>
    </main>
  );
}
