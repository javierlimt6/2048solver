export interface GameState {
  matrix: number[][]
  score: number
}

export interface MoveResponse {
  matrix: number[][]
  score: number
  move: string
  current_index: number
  states_count: number
  game_over: boolean
}

export interface InitResponse {
  matrix: number[][]
  score: number
  states_count: number
}

