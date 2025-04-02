from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from puzzle_AI import game_logic, get_AI_score
from contest10_2 import AI

app = FastAPI()

# Add CORS middleware to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to maintain game state
game_moves = []
current_index = 0
current_game_over = False

# Add AI function to game logic
game_logic['AI'] = AI

@app.post("/api/initialize")
async def initialize_game():
    """
    Initialize a new game of 2048 and precompute all AI moves
    Returns the initial game state matrix and score
    """
    global game_moves, current_index, current_game_over
    
    # Get the entire game history using get_AI_score
    move_history, is_win = get_AI_score(AI)
    
    # Store the moves
    game_moves = move_history
    current_index = 0
    current_game_over = len(move_history) > 1 and (is_win or not any(0 in row for row in move_history[-1]["mat"]))
    
    # Return initial state
    return {
        "matrix": game_moves[current_index]["mat"],
        "score": game_moves[current_index]["score"],
        "current_index": current_index,
        "states_count": len(game_moves),
        "game_over": current_game_over and current_index == len(game_moves) - 1
    }

@app.post("/api/next_move")
async def next_move():
    """
    Get the next move from the precomputed move history
    Returns the updated game state matrix and score
    """
    global current_index
    
    if current_index < len(game_moves) - 1:
        # Move forward in the game history
        current_index += 1
    
    # Get move direction - check if the key exists in the dictionary
    move_dir = game_moves[current_index].get("move", "Unknown")
    
    return {
        "matrix": game_moves[current_index]["mat"],
        "score": game_moves[current_index]["score"],
        "move": move_dir,  # Fixed: use the move from the current state
        "current_index": current_index,
        "states_count": len(game_moves),
        "game_over": current_game_over and current_index == len(game_moves) - 1
    }

@app.post("/api/prev_move")
async def prev_move():
    """
    Get the previous move from the precomputed move history
    Returns the updated game state matrix and score
    """
    global current_index
    
    if current_index > 0:
        # Move backward in the game history
        current_index -= 1
    
    # Get move direction
    move_dir = "Initial state" if current_index == 0 else game_moves[current_index].get('move', 'Unknown')

    
    return {
        "matrix": game_moves[current_index]["mat"],
        "score": game_moves[current_index]["score"],
        "move": move_dir,
        "current_index": current_index,
        "states_count": len(game_moves),
        "game_over": False  # It's never game over if we're looking at history
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)