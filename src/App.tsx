"use client"

import { useEffect } from "react"
import { Grid } from "./components/Grid"
import { Controls } from "./components/Controls"
import { Header } from "./components/Header"
import { useGameLogic } from "./hooks/useGameLogic"
import "./App.css"

function App() {
  const {
    gameState,
    currentMove,
    currentIndex,
    totalStates,
    loading,
    gameOver,
    autoPlay,
    initializeGame,
    handleNextMove,
    handlePrevMove,
    toggleAutoPlay,
  } = useGameLogic()

  useEffect(() => {
    initializeGame()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Header gameState={gameState} currentMove={currentMove} currentIndex={currentIndex} totalStates={totalStates} />

        <div className="mt-8">
          <Grid matrix={gameState?.matrix || []} />
        </div>

        {gameOver && (
          <div className="mt-6 text-center bg-yellow-100 p-4 rounded-lg">
            <p className="text-xl font-bold">Game Over! Final Score: {gameState?.score}</p>
          </div>
        )}

        <Controls
          loading={loading}
          gameOver={gameOver}
          autoPlay={autoPlay}
          currentIndex={currentIndex}
          totalStates={totalStates}
          onPrevMove={handlePrevMove}
          onNextMove={handleNextMove}
          onNewGame={initializeGame}
          onToggleAutoPlay={toggleAutoPlay}
        />
      </div>
    </div>
  )
}

export default App

