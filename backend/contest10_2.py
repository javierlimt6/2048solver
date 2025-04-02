#
# CS1010X --- Programming Methodology
#
# Contest 10.2 Template
#
# Note that written answers are commented out to allow us to run your
# code easily while grading your problem set.

from random import *
from puzzle_AI import *

def AI(mat):
    def transpose(mat):
        return list(map(list,zip(*mat)))

    def reverse(mat):
        return list(map(lambda row: list(reversed(row)),mat))

    def merge_left(mat):
    #i never use map pls dont kill me :(
        pre = mat
        post = []
        score = 0
        for row in pre:
            res = []
            #-1 represents that the pointer is empty
            cur = -1
            next = -1
            i = 0
            while i != len(row):
                if row[i] != 0:
                    if cur == -1:
                        cur = row[i] #point to current if not yet
                    elif next == -1:
                        next = row[i] #point to next if not yet
                        if cur == next: #merge current and next if same
                            res.append(cur + next)
                            score += cur + next
                            cur = -1
                        else: #add cur to left most
                            res.append(cur)
                            cur = next
                        next = -1 #no need for next, set back to none, cur to next
                i += 1

            if cur != -1:
                res.append(cur)
            res += [0] * (len(row) - len(res))
            post.append(res)

        return (post, pre != post, score)
    def merge_right(mat):
    #merging right is the reverse of merging left
        mat = reverse(mat)
        new, is_valid, score = merge_left(mat)
        return (reverse(new), is_valid, score)

    def merge_down(mat):
        #merging down is the transpose of merging right
        mat = transpose(mat)
        new, is_valid,score = merge_right(mat)
        return (transpose(new), is_valid, score)
    def merge_up(mat):
        #merging up is the transpose of merging left
        mat = transpose(mat)
        new, is_valid, score = merge_left(mat)
        return (transpose(new), is_valid, score)
    

    # Weight matrix for tiles
    weight_matrix = [[16, 15, 14, 13],
                    [15, 14, 13, 12],
                    [14, 13, 12, 11],
                    [13, 12, 11, 10]]

    # Clustering penalty weights
    cluster_penalty = [[1, 2, 3, 4],
                    [2, 3, 4, 5],
                    [3, 4, 5, 6],
                    [4, 5, 6, 7]]

    def getMove(grid, depth):
        possible_moves = ['w', 'a', 's', 'd']
        valid_moves = [move for move in possible_moves if getNewGrid(grid, move)[1]]
        if not valid_moves:
            return None
        
        if len(valid_moves) == 1:
            return valid_moves[0]

        best_move = None
        alpha = float('-inf')
        beta = float('inf')
        max_utility = float('-inf')

        for move in valid_moves:
            new_grid, _ = getNewGrid(grid, move)
            utility = alphaBeta(new_grid, depth-1, alpha, beta, False)
            if utility > max_utility:
                max_utility = utility
                best_move = move

        return best_move


    def alphaBeta(grid, depth, alpha, beta, maximizingPlayer):
        if depth == 0 or is_lose(grid):
            return evaluate(grid)

        if maximizingPlayer:
            for move in ['w', 'a', 's', 'd']:
                new_grid, valid_move = getNewGrid(grid, move)
                if not valid_move:
                    continue
                alpha = max(alpha, alphaBeta(new_grid, depth-1, alpha, beta, False))
                if beta <= alpha:
                    break
            return alpha
        else:
            empty_cells = [(i, j) for i in range(4) for j in range(4) if grid[i][j] == 0]
            for cell in empty_cells:
                new_grid_2 = placeTile(grid, cell, 2)
                beta = min(beta, alphaBeta(new_grid_2, depth-1, alpha, beta, True))
                if beta <= alpha:
                    break
            return beta

    def evaluate(grid):
        score_weight = 1.0
        clustering_penalty_weight = 0.35
        monotonicity_score_weight = 0.0
        empty_cells_penalty_weight = 0

        # Calculate the score based on the tile values
        score = sum(sum(grid[i][j] * weight_matrix[i][j] for j in range(4)) for i in range(4))

        # Calculate the clustering penalty using cluster_penalty
        clustering_penalty = sum(sum(cluster_penalty[i][j] * grid[i][j] for j in range(4)) for i in range(4))

        # Calculate the monotonicity of rows and columns
        monotonicity_score = 0
        for i in range(4):
            row = [grid[i][j] for j in range(4)]
            col = [grid[j][i] for j in range(4)]
            monotonicity_score += abs(sum((row[j] - row[j+1]) for j in range(3))) + abs(sum((col[j] - col[j+1]) for j in range(3)))

        # Calculate the number of empty cells
        empty_cells = sum(1 for i in range(4) for j in range(4) if grid[i][j] == 0)

        # Weight the factors and return the evaluation
        return score_weight * score - clustering_penalty_weight * clustering_penalty - \
            monotonicity_score_weight * monotonicity_score - empty_cells_penalty_weight * empty_cells

    # Utility functions for game logic
    def getNewGrid(grid, move):
        new_grid = grid.copy()
        if move == 'w':
            new_grid, is_valid, _ = merge_up(new_grid)
            return new_grid, is_valid
        elif move == 'a':
            new_grid, is_valid, _ = merge_left(new_grid)
            return new_grid, is_valid
        elif move == 's':
            new_grid, is_valid, _ = merge_down(new_grid)
            return new_grid, is_valid
        elif move == 'd':
            new_grid, is_valid, _ = merge_right(new_grid)
            return new_grid, is_valid
        else:
            return grid, False
    def is_lose(mat):
        if has_zero(mat):
            return False
        
        for i in range(len(mat)):
            for j in range(len(mat) - 1):
                if mat[i][j] == mat[i][j+1] or mat[j][i] == mat[j+1][i]:
                    return False
        return True

    def placeTile(grid, cell, value):
        new_grid = grid.copy()
        new_grid[cell[0]][cell[1]] = value
        return new_grid


    return getMove(mat, 7)


# UNCOMMENT THE FOLLOWING LINES AND RUN TO WATCH YOUR SOLVER AT WORK
game_logic['AI'] = AI
gamegrid = GameGrid(game_logic)

# UNCOMMENT THE FOLLOWING LINE AND RUN TO GRADE YOUR SOLVER
# Note: Your solver is expected to produce only valid moves.
percent = 0
res_score = 0
# for i in range(10):
#     res = get_average_AI_score(AI, False)
#     percent += res[1]
#     res_score += res[0]

