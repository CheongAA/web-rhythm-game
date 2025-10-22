'use client';

import { useState } from 'react';
import { RhythmGame } from '@/components/RhythmGame';
import { MusicSelector } from '@/components/MusicSelector';
import { musicLibrary } from '@/data/musicLibrary';
import type { GameConfig, BeatMap } from '@/types/game.types';
import { Button } from '@/components/ui/button';

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
  const [selectedBeatMap, setSelectedBeatMap] = useState<BeatMap | null>(null);
  const [showSelector, setShowSelector] = useState(true);
  const [gameKey, setGameKey] = useState(0); // Force remount when changing music

  const handleSelectMusic = (beatMap: BeatMap) => {
    setSelectedBeatMap(beatMap);
    setShowSelector(false);
    setGameKey((prev) => prev + 1); // Force remount to reset game state
  };

  const handleBackToSelector = () => {
    setShowSelector(true);
    setSelectedBeatMap(null);
  };

  return (
    <main className="h-screen bg-black overflow-auto flex items-center justify-center py-4 sm:py-8">
      <div className="w-full relative z-10">
        {showSelector ? (
          <MusicSelector tracks={musicLibrary} onSelectTrack={handleSelectMusic} />
        ) : selectedBeatMap ? (
          <div className="space-y-4">
            <div className="flex justify-center px-4">
              <Button variant="pixel" onClick={handleBackToSelector} className="text-xs sm:text-sm">
                ← BACK TO MUSIC SELECT
              </Button>
            </div>
            <RhythmGame key={gameKey} beatMap={selectedBeatMap} config={gameConfig} />
          </div>
        ) : (
          <MusicSelector tracks={musicLibrary} onSelectTrack={handleSelectMusic} />
        )}
      </div>
    </main>
  );
}
