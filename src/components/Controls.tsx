"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, RefreshCw } from "lucide-react"

interface ControlsProps {
  loading: boolean
  gameOver: boolean
  autoPlay: boolean
  currentIndex: number
  totalStates: number
  onPrevMove: () => void
  onNextMove: () => void
  onNewGame: () => void
  onToggleAutoPlay: () => void
}

export function Controls({
  loading,
  gameOver,
  autoPlay,
  currentIndex,
  totalStates,
  onPrevMove,
  onNextMove,
  onNewGame,
  onToggleAutoPlay,
}: ControlsProps) {
  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="flex space-x-4 mb-4">
        <Button onClick={onNewGame} variant="outline" className="flex items-center gap-2" disabled={loading}>
          <RefreshCw className="h-4 w-4" />
          New Game
        </Button>
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={onPrevMove}
          variant="outline"
          disabled={loading || currentIndex <= 0}
          className="flex items-center gap-2"
        >
          <SkipBack className="h-4 w-4" />
          Previous Move
        </Button>

        <Button
          onClick={onToggleAutoPlay}
          variant={autoPlay ? "destructive" : "default"}
          disabled={loading || gameOver}
          className="flex items-center gap-2"
        >
          {autoPlay ? (
            <>
              <Pause className="h-4 w-4" />
              Stop Auto Play
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Start Auto Play
            </>
          )}
        </Button>

        <Button
          onClick={onNextMove}
          variant="outline"
          disabled={loading || gameOver}
          className="flex items-center gap-2"
        >
          <SkipForward className="h-4 w-4" />
          Next Move
        </Button>
      </div>
    </div>
  )
}

