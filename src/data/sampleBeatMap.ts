import type { BeatMap } from '@/types/game.types';

// Generate a simple beat map for demo purposes
function generateSampleNotes() {
  const notes = [];
  const bpm = 120;
  const beatDuration = (60 / bpm) * 1000; // milliseconds per beat (500ms)

  // Start notes after 3 seconds to give player time to prepare
  const startTime = 3000;

  // Generate a simple pattern - 64 beats total
  for (let i = 0; i < 64; i++) {
    const timing = startTime + i * beatDuration;

    // Simple 4-lane pattern - one note per beat cycling through lanes
    const lane = i % 4;
    notes.push({
      id: `note-${i}`,
      lane,
      timing,
      type: 'normal' as const,
    });

    // Add some double notes every 8 beats
    if (i % 8 === 0 && i > 0) {
      notes.push({
        id: `note-${i}-double`,
        lane: (lane + 2) % 4, // opposite lane
        timing,
        type: 'normal' as const,
      });
    }
  }

  return notes;
}

export const sampleBeatMap: BeatMap = {
  title: 'Sample Song',
  artist: 'Demo Artist',
  audioUrl: '', // You can add a URL to an audio file here
  bpm: 120,
  notes: generateSampleNotes(),
  offset: 2000, // 2 seconds lead time
};
