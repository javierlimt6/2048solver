import axios from "axios"
import type { InitResponse, MoveResponse } from "../types"

// Use environment variable or default to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

export const gameService = {
  async initialize(): Promise<InitResponse> {
    const response = await axios.post(`${API_URL}/initialize`)
    return response.data
  },

  async nextMove(): Promise<MoveResponse> {
    const response = await axios.post(`${API_URL}/next_move`)
    return response.data
  },

  async prevMove(index: number): Promise<MoveResponse> {
    const response = await axios.post(`${API_URL}/prev_move`, { index })
    return response.data
  },
}

