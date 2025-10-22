export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  bpm?: number;
  duration?: number;
  coverUrl?: string;
}

// 무료 음악 예시 (실제로는 API나 사용자 업로드로 대체)
export const musicLibrary: MusicTrack[] = [
  {
    id: '1',
    title: 'Cascade Breathe (Future Garage)',
    artist: 'NverAvetyanMusic',
    audioUrl: '/music/nverAvetyanMusic/cascadeBreathFutureGarage/audio.mp3',
    coverUrl: '/music/nverAvetyanMusic/cascadeBreathFutureGarage/cover.webp',
  },
  {
    id: '2',
    title: 'Running Night',
    artist: 'Alex_makeMusic',
    audioUrl: '/music/alexMakeMusic/runningNight/audio.mp3',
    coverUrl: '/music/alexMakeMusic/runningNight/cover.webp',
  },
  // 사용자가 직접 음악 파일을 업로드할 수 있도록 확장 가능
];
