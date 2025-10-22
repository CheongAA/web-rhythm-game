'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import type { MusicTrack } from '@/data/musicLibrary';
import type { BeatMap } from '@/types/game.types';
import { detectBeats, generateNotesWithDifficulty } from '@/utils/beatDetection';

interface MusicSelectorProps {
  tracks: MusicTrack[];
  onSelectTrack: (beatMap: BeatMap) => void;
}

type Difficulty = 'easy' | 'normal' | 'hard';

export function MusicSelector({ tracks, onSelectTrack }: MusicSelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingTrackId, setAnalyzingTrackId] = useState<string | null>(null);

  const handleSelectTrack = async (track: MusicTrack) => {
    setIsAnalyzing(true);
    setAnalyzingTrackId(track.id);

    try {
      // Detect beats from audio
      const { beats, bpm } = await detectBeats(track.audioUrl);

      // Generate notes based on difficulty
      const notes = generateNotesWithDifficulty(beats, selectedDifficulty);

      // Calculate offset: time for note to travel from top to hit line
      // At 300 px/s and ~500px distance = ~1667ms
      const offset = 2000; // 2 seconds lead time

      // Create beatmap
      const beatMap: BeatMap = {
        title: track.title,
        artist: track.artist,
        bpm,
        audioUrl: track.audioUrl,
        notes,
        offset,
      };

      onSelectTrack(beatMap);
    } catch (error) {
      console.error('Failed to analyze track:', error);
      alert('음악 분석에 실패했습니다. 다른 곡을 선택해주세요.');
    } finally {
      setIsAnalyzing(false);
      setAnalyzingTrackId(null);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is audio
    if (!file.type.startsWith('audio/')) {
      alert('오디오 파일만 업로드 가능합니다.');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Create object URL for uploaded file
      const audioUrl = URL.createObjectURL(file);

      // Detect beats
      const { beats, bpm } = await detectBeats(audioUrl);

      // Generate notes
      const notes = generateNotesWithDifficulty(beats, selectedDifficulty);

      // Calculate offset
      const offset = 2000; // 2 seconds lead time

      // Create beatmap with file name
      const beatMap: BeatMap = {
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        artist: 'Custom Track',
        bpm,
        audioUrl,
        notes,
        offset,
      };

      onSelectTrack(beatMap);
    } catch (error) {
      console.error('Failed to analyze uploaded file:', error);
      alert('음악 분석에 실패했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pixel-neon-magenta">
          SELECT MUSIC
        </h1>
        <p className="text-sm sm:text-base text-pixel-neon-cyan">
          Choose a track or upload your own!
        </p>
      </div>

      {/* Difficulty Selection */}
      <Card variant="pixel" className="p-4">
        <CardContent className="p-0">
          <h3 className="text-sm sm:text-base font-bold mb-3 text-pixel-neon-cyan">DIFFICULTY</h3>
          <div className="flex gap-2">
            <Button
              variant={selectedDifficulty === 'easy' ? 'pixel-success' : 'pixel'}
              onClick={() => setSelectedDifficulty('easy')}
              className="flex-1 text-xs sm:text-sm"
            >
              EASY
            </Button>
            <Button
              variant={selectedDifficulty === 'normal' ? 'pixel-success' : 'pixel'}
              onClick={() => setSelectedDifficulty('normal')}
              className="flex-1 text-xs sm:text-sm"
            >
              NORMAL
            </Button>
            <Button
              variant={selectedDifficulty === 'hard' ? 'pixel-success' : 'pixel'}
              onClick={() => setSelectedDifficulty('hard')}
              className="flex-1 text-xs sm:text-sm"
            >
              HARD
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Custom Music */}
      <Card variant="pixel" className="p-4">
        <CardContent className="p-0">
          <h3 className="text-sm sm:text-base font-bold mb-3 text-pixel-neon-cyan">
            UPLOAD YOUR MUSIC
          </h3>
          <label className="block">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              disabled={isAnalyzing}
              className="hidden"
              id="music-upload-input"
            />
            <Button
              variant="pixel-warning"
              className="w-full text-xs sm:text-sm"
              disabled={isAnalyzing}
              onClick={() => {
                const input = document.getElementById('music-upload-input') as HTMLInputElement;
                input?.click();
              }}
            >
              {isAnalyzing ? '⏳ ANALYZING...' : '📁 UPLOAD MUSIC FILE'}
            </Button>
          </label>
          <p className="text-[10px] sm:text-xs text-pixel-neon-yellow mt-2 text-center">
            Supports MP3, WAV, OGG, etc.
          </p>
        </CardContent>
      </Card>

      {/* Track List */}
      {tracks.length > 0 && (
        <Card variant="pixel" className="p-4">
          <CardContent className="p-0">
            <h3 className="text-sm sm:text-base font-bold mb-3 text-pixel-neon-cyan">
              AVAILABLE TRACKS
            </h3>
            <div className="space-y-2">
              {tracks.map((track) => (
                <Card
                  key={track.id}
                  variant="pixel"
                  className="p-3 bg-pixel-bg-tertiary hover:bg-pixel-bg-quaternary transition-colors cursor-pointer"
                  onClick={() => !isAnalyzing && handleSelectTrack(track)}
                >
                  <CardContent className="p-0 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-pixel-neon-yellow truncate">
                        {track.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-pixel-neon-cyan truncate">
                        {track.artist}
                        {track.bpm && ` • ${track.bpm} BPM`}
                      </p>
                    </div>
                    {analyzingTrackId === track.id ? (
                      <span className="text-xs text-pixel-neon-magenta">⏳</span>
                    ) : (
                      <span className="text-xs text-pixel-neon-green">▶</span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm">
          <Card variant="pixel" className="p-6 max-w-sm mx-4 animate-pulse">
            <CardContent className="p-0 text-center space-y-4">
              <div className="text-5xl animate-bounce">🎵</div>
              <h3 className="text-lg sm:text-xl font-bold text-pixel-neon-cyan">
                ANALYZING MUSIC...
              </h3>
              <p className="text-xs sm:text-sm text-pixel-neon-yellow">
                Detecting beats and generating notes
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <div
                  className="w-2 h-2 bg-pixel-neon-magenta rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-2 h-2 bg-pixel-neon-cyan rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-2 h-2 bg-pixel-neon-green rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
