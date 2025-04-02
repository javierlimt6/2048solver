import type { GameState } from "../types"

interface HeaderProps {
  gameState: GameState | null
  currentMove: string
  currentIndex: number
  totalStates: number
}

export function Header({ gameState, currentMove, currentIndex, totalStates }: HeaderProps) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">2048 AI Solver Visualization</h1>

      <div className="bg-white p-4 rounded-lg shadow-md inline-block">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Score</p>
            <p className="font-bold text-xl">{gameState?.score || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Move</p>
            <p className="font-bold">{currentMove}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">State</p>
            <p className="font-bold">
              {currentIndex + 1} / {totalStates}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

