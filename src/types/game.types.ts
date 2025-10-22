export type NoteType = 'normal' | 'long';
export type JudgmentType = 'perfect' | 'great' | 'good' | 'miss';
export type GameState = 'ready' | 'playing' | 'paused' | 'finished';

export interface Note {
  id: string;
  lane: number;
  timing: number; // milliseconds
  type: NoteType;
  endTiming?: number; // for long notes
  hit?: boolean;
  judgment?: JudgmentType;
}

export interface GameConfig {
  lanes: number;
  noteSpeed: number; // pixels per second
  judgmentWindows: {
    perfect: number;
    great: number;
    good: number;
  };
}

export interface GameScore {
  score: number;
  combo: number;
  maxCombo: number;
  judgments: {
    perfect: number;
    great: number;
    good: number;
    miss: number;
  };
}

export interface BeatMap {
  title: string;
  artist: string;
  audioUrl: string;
  bpm: number;
  notes: Note[];
  offset?: number; // milliseconds - delay before music starts
}
