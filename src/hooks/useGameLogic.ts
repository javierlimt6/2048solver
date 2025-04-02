"use client"

import { useState, useEffect } from "react"
import type { GameState } from "../types"
import { gameService } from "../services/gameService"

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [currentMove, setCurrentMove] = useState<string>("Initial state")
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [totalStates, setTotalStates] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [autoPlay, setAutoPlay] = useState<boolean>(false)

  useEffect(() => {
    let intervalId: number
    if (autoPlay && !loading && !gameOver) {
      intervalId = window.setInterval(() => {
        handleNextMove()
      }, 500) // Move every 500ms
    }
    return () => window.clearInterval(intervalId)
  }, [autoPlay, loading, gameOver])

  const initializeGame = async () => {
    setLoading(true)
    try {
      const response = await gameService.initialize()
      setGameState({
        matrix: response.matrix,
        score: response.score,
      })
      setCurrentMove("Initial state")
      setCurrentIndex(0)
      setTotalStates(1)
      setGameOver(false)
      setAutoPlay(false)
    } catch (error) {
      console.error("Error initializing game:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNextMove = async () => {
    if (loading || gameOver) return

    setLoading(true)
    try {
      const response = await gameService.nextMove()

      if (response.game_over) {
        setGameOver(true)
        return
      }

      setGameState({
        matrix: response.matrix,
        score: response.score,
      })
      setCurrentMove(response.move)
      setCurrentIndex(response.current_index)
      setTotalStates(response.states_count)
    } catch (error) {
      console.error("Error getting next move:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrevMove = async () => {
    if (loading || currentIndex <= 0) return

    setLoading(true)
    try {
      const response = await gameService.prevMove(currentIndex - 1)
      setGameState({
        matrix: response.matrix,
        score: response.score,
      })
      setCurrentMove(response.move)
      setCurrentIndex(response.current_index)
    } catch (error) {
      console.error("Error getting previous move:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay)
  }

  return {
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
  }
}

