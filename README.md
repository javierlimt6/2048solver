# 2048 AI Solver

A visualization tool for an AI that solves the classic 2048 puzzle game. This project consists of a Python backend that runs the 2048 game logic and AI solver, and a React frontend that visualizes the game states and AI moves.

## Project Structure

```
├── backend/               # Python backend
│   ├── puzzle_AI.py       # Core game logic & AI evaluation
│   ├── contest10_2.py     # AI implementation 
│   ├── main.py            # FastAPI server with endpoints
│   └── requirements.txt   # Python dependencies
│
└── frontend/              # React frontend
    ├── src/               # Source code
    ├── public/            # Static assets
    ├── package.json       # Node.js dependencies
    └── ...
```

## Features

- Interactive 2048 game visualization
- AI solver that automatically plays through the game
- Step-by-step visualization of AI moves
- Move history navigation
- Score tracking
- Game state visualization

## AI Algorithm Explanation

The 2048 AI solver uses a minimax algorithm with alpha-beta pruning to determine the optimal moves. Here's how it works:

### Minimax with Alpha-Beta Pruning

The algorithm approaches the game as a two-player adversarial game where:
- The AI player tries to maximize the score (maximizing player)
- The computer's random tile placements are treated as the minimizing player

Alpha-beta pruning optimization reduces the search space by eliminating branches that won't affect the final decision.

### Key Heuristics

The evaluation function uses several heuristics to determine the best move:

1. **Weighted Tile Values**: 
   ```python
   weight_matrix = [
       [16, 15, 14, 13],
       [15, 14, 13, 12],
       [14, 13, 12, 11],
       [13, 12, 11, 10]
   ]
   ```
   Tiles are assigned weights based on their position, encouraging high-value tiles to be placed in corners.

2. **Clustering Penalty**:
   ```python
   cluster_penalty = [
       [1, 2, 3, 4],
       [2, 3, 4, 5],
       [3, 4, 5, 6],
       [4, 5, 6, 7]
   ]
   ```
   Penalizes arrangements where high-value tiles are scattered rather than adjacent to each other.

3. **Empty Cell Analysis**: Maintains flexibility by considering the number of empty cells.

4. **Monotonicity**: Although not heavily weighted in the current implementation, checks how well the tiles are ordered (increasing or decreasing) along rows and columns.

### Depth-Limited Search

The AI looks ahead a fixed number of moves (depth=8 in the current implementation) to evaluate potential game states, balancing between computational efficiency and strategic foresight.

### Move Selection

For each possible move (up, down, left, right), the algorithm:
1. Simulates the move on the current board state
2. If the move is valid, evaluates the resulting position using the minimax algorithm
3. Selects the move with the highest evaluation score

### Implementation Details

The algorithm includes several optimizations:
- Early termination of search when alpha-beta pruning conditions are met
- Prioritizing evaluation of valid moves only
- Efficient grid manipulation using transpose and reverse operations

This combination of techniques enables the AI to make intelligent decisions that often lead to high scores and reaching the 2048 tile.

## Getting Started

### Prerequisites

- Python 3.8+ 
- Node.js 16+ and npm

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install required Python packages:
   ```
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```
   python main.py
   ```
   
   The server will run at http://localhost:8000 by default.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   
   The frontend will be available at http://localhost:5173 by default.

## Using the Application

1. Launch both the backend and frontend servers as described above.
2. Open your browser and navigate to http://localhost:5173.
3. Click "New Game" to initialize a new game.
4. Use the navigation buttons:
   - "Previous Move" to go back to the previous state
   - "Next Move" to advance to the next AI move
   - "Start Auto Play" to watch the AI solve the puzzle automatically
   - "Stop Auto Play" to pause the automatic playback

## API Endpoints

The backend exposes three main endpoints:

- `POST /api/initialize`: Starts a new game and precomputes all AI moves
- `POST /api/next_move`: Gets the next move in the sequence
- `POST /api/prev_move`: Navigates to the previous move in history

## Tech Stack

- **Backend**: Python, FastAPI, AI algorithms
- **Frontend**: React, TypeScript, Chakra UI, Axios

## License

This project is available for educational purposes and personal use.

## Acknowledgements

- The 2048 game was originally created by [Gabriele Cirulli](https://github.com/gabrielecirulli/2048)
- This implementation includes a custom AI solver algorithm