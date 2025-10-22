'use client';

import { useGameStore } from '@/store/useGameStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';

interface GameResultProps {
  onRestart: () => void;
  onClose?: () => void;
}

export function GameResult({ onRestart, onClose }: GameResultProps) {
  const { score, setGameState } = useGameStore();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setGameState('ready');
    }
  };

  const totalNotes =
    score.judgments.perfect + score.judgments.great + score.judgments.good + score.judgments.miss;

  const accuracy =
    totalNotes > 0
      ? ((score.judgments.perfect * 100 + score.judgments.great * 70 + score.judgments.good * 40) /
          totalNotes) *
        100
      : 0;

  const getRank = (acc: number) => {
    if (acc >= 95) return { rank: 'SS', color: 'text-yellow-300' };
    if (acc >= 90) return { rank: 'S', color: 'text-yellow-400' };
    if (acc >= 80) return { rank: 'A', color: 'text-green-400' };
    if (acc >= 70) return { rank: 'B', color: 'text-blue-400' };
    if (acc >= 60) return { rank: 'C', color: 'text-purple-400' };
    return { rank: 'D', color: 'text-gray-400' };
  };

  const { rank, color } = getRank(accuracy);

  return (
    <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        variant="pixel"
        className="max-w-[95vw] sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6"
      >
        <DialogHeader>
          <div className="text-center space-y-2 sm:space-y-4">
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-pixel-neon-green">
              GAME CLEAR!
            </DialogTitle>
            <div className={`text-5xl sm:text-6xl md:text-8xl font-bold ${color}`}>{rank}</div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-pixel-neon-yellow">
                {score.score.toLocaleString()}
              </div>
              <div className="text-[10px] sm:text-xs text-pixel-neon-cyan">SCORE</div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card variant="pixel" className="p-2 sm:p-3 text-center bg-pixel-neon-green">
            <CardContent className="p-0">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
                {accuracy.toFixed(0)}%
              </div>
              <div className="text-[10px] sm:text-xs text-black">ACCURACY</div>
            </CardContent>
          </Card>

          <Card variant="pixel" className="p-2 sm:p-3 text-center bg-pixel-neon-magenta">
            <CardContent className="p-0">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                {score.maxCombo}x
              </div>
              <div className="text-[10px] sm:text-xs text-white">MAX COMBO</div>
            </CardContent>
          </Card>
        </div>

        <Card variant="pixel" className="p-3 sm:p-4 mb-4 sm:mb-6 bg-pixel-bg-tertiary">
          <CardContent className="p-0">
            <h3 className="font-bold mb-2 sm:mb-3 text-center text-[10px] sm:text-xs text-pixel-neon-cyan">
              JUDGMENTS
            </h3>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-center text-[10px] sm:text-xs gap-2">
                <span className="font-bold text-pixel-judgment-perfect whitespace-nowrap">
                  PERFECT
                </span>
                <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
                  <Progress
                    value={(score.judgments.perfect / totalNotes) * 100}
                    className="w-20 sm:w-32 md:w-48 h-1.5 sm:h-2"
                  />
                  <span className="font-mono w-6 sm:w-8 text-right text-white">
                    {score.judgments.perfect}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] sm:text-xs gap-2">
                <span className="font-bold text-pixel-judgment-great whitespace-nowrap">GREAT</span>
                <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
                  <Progress
                    value={(score.judgments.great / totalNotes) * 100}
                    className="w-20 sm:w-32 md:w-48 h-1.5 sm:h-2"
                  />
                  <span className="font-mono w-6 sm:w-8 text-right text-white">
                    {score.judgments.great}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] sm:text-xs gap-2">
                <span className="font-bold text-pixel-judgment-good whitespace-nowrap">GOOD</span>
                <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
                  <Progress
                    value={(score.judgments.good / totalNotes) * 100}
                    className="w-20 sm:w-32 md:w-48 h-1.5 sm:h-2"
                  />
                  <span className="font-mono w-6 sm:w-8 text-right text-white">
                    {score.judgments.good}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] sm:text-xs gap-2">
                <span className="font-bold text-pixel-judgment-miss whitespace-nowrap">MISS</span>
                <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
                  <Progress
                    value={(score.judgments.miss / totalNotes) * 100}
                    className="w-20 sm:w-32 md:w-48 h-1.5 sm:h-2"
                  />
                  <span className="font-mono w-6 sm:w-8 text-right text-white">
                    {score.judgments.miss}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={onRestart}
          variant="pixel-success"
          size="lg"
          className="w-full text-xs sm:text-sm md:text-base"
        >
          ▶ PLAY AGAIN
        </Button>
      </DialogContent>
    </Dialog>
  );
}
