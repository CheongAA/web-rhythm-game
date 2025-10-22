import type { Note } from '@/types/game.types';

interface BeatDetectionResult {
  beats: number[]; // Array of timestamps in milliseconds
  bpm: number;
}

/**
 * Detect beats from an audio file using Web Audio API
 * Uses a simple peak detection algorithm on the audio buffer
 */
export async function detectBeats(audioUrl: string): Promise<BeatDetectionResult> {
  const audioContext = new AudioContext();

  try {
    // Fetch and decode audio
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Get channel data (use first channel for mono, or mix to mono)
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;

    // Calculate energy in small windows
    const windowSize = 2048; // ~46ms at 44.1kHz - larger window for better beat detection
    const hopSize = windowSize / 2; // 50% overlap
    const energyThreshold = 1.3; // Higher threshold for better filtering
    const beats: number[] = [];

    // Calculate energy values with overlap
    const energies: number[] = [];
    for (let i = 0; i < channelData.length - windowSize; i += hopSize) {
      let sum = 0;
      for (let j = 0; j < windowSize; j++) {
        const sample = channelData[i + j] || 0;
        sum += sample * sample;
      }
      energies.push(sum / windowSize);
    }

    // Calculate average and threshold with adaptive method
    const avgEnergy = energies.reduce((a, b) => a + b, 0) / energies.length;
    const threshold = avgEnergy * energyThreshold;

    // Detect peaks (beats) with improved algorithm
    let lastBeatIndex = -10; // Prevent too close beats
    const minBeatGap = 5; // Minimum gap between beats (in windows)

    for (let i = 2; i < energies.length - 2; i++) {
      const current = energies[i];
      const prev1 = energies[i - 1];
      const prev2 = energies[i - 2];
      const next1 = energies[i + 1];
      const next2 = energies[i + 2];

      // Check if this is a local maximum with stronger requirements
      if (
        current !== undefined &&
        prev1 !== undefined &&
        prev2 !== undefined &&
        next1 !== undefined &&
        next2 !== undefined &&
        current > prev1 &&
        current > prev2 &&
        current > next1 &&
        current > next2 &&
        current > threshold &&
        i - lastBeatIndex > minBeatGap
      ) {
        const timeMs = (i * hopSize * 1000) / sampleRate;
        beats.push(timeMs);
        lastBeatIndex = i;
      }
    }

    // Calculate BPM from beat intervals
    const bpm = calculateBPM(beats);

    return { beats, bpm };
  } finally {
    await audioContext.close();
  }
}

/**
 * Calculate BPM from beat timestamps
 */
function calculateBPM(beats: number[]): number {
  if (beats.length < 2) return 120; // Default BPM

  // Calculate intervals between beats
  const intervals: number[] = [];
  for (let i = 1; i < beats.length; i++) {
    const curr = beats[i];
    const prev = beats[i - 1];
    if (curr !== undefined && prev !== undefined) {
      intervals.push(curr - prev);
    }
  }

  if (intervals.length === 0) return 120;

  // Get median interval (more robust than average)
  intervals.sort((a, b) => a - b);
  const medianInterval = intervals[Math.floor(intervals.length / 2)];

  if (medianInterval === undefined || medianInterval === 0) return 120;

  // Convert to BPM
  const bpm = Math.round(60000 / medianInterval);

  // Clamp to reasonable range
  return Math.max(60, Math.min(200, bpm));
}

/**
 * Generate notes from detected beats
 * Distributes beats across 4 lanes with some randomization
 */
export function generateNotesFromBeats(beats: number[], lanes: number = 4): Note[] {
  const notes: Note[] = [];

  beats.forEach((timing, index) => {
    // Use a pseudo-random but deterministic lane assignment
    // This ensures the same song generates the same pattern
    const lane = Math.floor((Math.sin(index * 2.5) + 1) * (lanes / 2)) % lanes;

    notes.push({
      id: `beat-${index}`,
      lane,
      timing,
      type: 'normal',
      hit: false,
    });
  });

  return notes;
}

/**
 * Enhanced note generation with difficulty levels
 */
export function generateNotesWithDifficulty(
  beats: number[],
  difficulty: 'easy' | 'normal' | 'hard',
  lanes: number = 4,
): Note[] {
  let selectedBeats: number[];

  switch (difficulty) {
    case 'easy':
      // Use every 2nd beat
      selectedBeats = beats.filter((_, i) => i % 2 === 0);
      break;
    case 'hard':
      // Use all beats + some subdivisions
      selectedBeats = [...beats];
      // Add notes between beats for extra difficulty
      for (let i = 0; i < beats.length - 1; i++) {
        const curr = beats[i];
        const next = beats[i + 1];
        if (curr !== undefined && next !== undefined) {
          const midpoint = (curr + next) / 2;
          if (next - curr > 500) {
            // Only add if gap is large enough
            selectedBeats.push(midpoint);
          }
        }
      }
      selectedBeats.sort((a, b) => a - b);
      break;
    case 'normal':
    default:
      selectedBeats = beats;
      break;
  }

  return generateNotesFromBeats(selectedBeats, lanes);
}
