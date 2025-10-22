# Audio Files

음악 파일을 이 폴더에 넣어주세요.

## 파일 구조:

```
public/
  audio/
    sample1.mp3
    sample2.mp3
    your-music.mp3
  images/
    cover1.jpg
    cover2.jpg
```

## 지원하는 파일 형식:

- MP3
- WAV
- OGG
- M4A
- FLAC

## 사용 방법:

1. 음악 파일을 이 폴더에 복사
2. `src/data/musicLibrary.ts`에서 파일 경로 추가
   ```typescript
   {
     id: '1',
     title: '노래 제목',
     artist: '아티스트',
     audioUrl: '/audio/your-music.mp3',
   }
   ```

## 무료 음악 다운로드:

- Pixabay Music: https://pixabay.com/music/
- Free Music Archive: https://freemusicarchive.org/
- Incompetech: https://incompetech.com/music/
- Bensound: https://www.bensound.com/
