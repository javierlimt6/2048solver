import React, { useState, useEffect } from 'react';
import { Button, Flex, Grid, GridItem, Text, VStack, HStack, Heading, Container, useBreakpointValue, Center } from '@chakra-ui/react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

interface GameState {
  matrix: number[][];
  score: number;
}

interface TileColor {
  bg: string;
  color: string;
}

const tileColors: { [key: number]: TileColor } = {
  0: { bg: '#cdc1b4', color: '#cdc1b4' },
  2: { bg: '#eee4da', color: '#776e65' },
  4: { bg: '#ede0c8', color: '#776e65' },
  8: { bg: '#f2b179', color: '#f9f6f2' },
  16: { bg: '#f59563', color: '#f9f6f2' },
  32: { bg: '#f67c5f', color: '#f9f6f2' },
  64: { bg: '#f65e3b', color: '#f9f6f2' },
  128: { bg: '#edcf72', color: '#f9f6f2' },
  256: { bg: '#edcc61', color: '#f9f6f2' },
  512: { bg: '#edc850', color: '#f9f6f2' },
  1024: { bg: '#edc53f', color: '#f9f6f2' },
  2048: { bg: '#edc22e', color: '#f9f6f2' },
};

/**
 * A React component that provides a user interface for the 2048 AI Solver application.
 * 
 * This component manages the game state and interaction with the backend AI solver.
 * Features include:
 * - Displaying the current 2048 game board state
 * - Navigation controls to move forward and backward through AI-generated moves
 * - Auto-play functionality to automatically execute the AI's moves
 * - Game state initialization and reset
 * - Score tracking and move counting
 * - Responsive design that adapts to different screen sizes
 * 
 * The component communicates with a backend API to retrieve game states and AI move decisions,
 * updating the UI accordingly to show the progression of the AI solving the 2048 puzzle.
 * 
 * @returns {JSX.Element} A responsive UI for the 2048 AI Solver
 */
const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentMove, setCurrentMove] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalStates, setTotalStates] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Responsive settings based on screen size
  const gridSize = useBreakpointValue({ base: "90%", sm: "350px", md: "400px", lg: "450px" });
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const headingSize = useBreakpointValue({ base: "lg", md: "xl" });

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let intervalId: number;
    if (autoPlay && !loading && !gameOver) {
      intervalId = setInterval(() => {
        handleNextMove();
      }, 200);
    }
    return () => clearInterval(intervalId);
  }, [autoPlay, loading, gameOver]);

  const initializeGame = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/initialize`);
      setGameState({
        matrix: response.data.matrix,
        score: response.data.score
      });
      setCurrentMove("Initial state");
      setCurrentIndex(0);
      setTotalStates(1);
      setGameOver(false);
    } catch (error) {
      console.error('Error initializing game:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextMove = async () => {
    if (loading || gameOver) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/next_move`);
      
      if (response.data.game_over) {
        setGameOver(true);
        return;
      }
      
      setGameState({
        matrix: response.data.matrix,
        score: response.data.score
      });
      setCurrentMove(response.data.move);
      setCurrentIndex(response.data.current_index);
      setTotalStates(response.data.states_count);
    } catch (error) {
      console.error('Error getting next move:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMove = async () => {
    if (loading || currentIndex <= 0) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/prev_move`);
      setGameState({
        matrix: response.data.matrix,
        score: response.data.score
      });
      setCurrentMove(response.data.move);
      setCurrentIndex(response.data.current_index);
      setTotalStates(response.data.states_count);
    } catch (error) {
      console.error('Error getting previous move:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
  };

  const getFontSize = (value: number) => {
    if (value > 1000) return { base: "md", sm: "lg", md: "xl" };
    if (value > 100) return { base: "lg", sm: "xl", md: "2xl" };
    return { base: "xl", sm: "2xl", md: "3xl" };
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Center>
        <VStack w="100%" align="center">
          <Heading as="h1" color="yellow.500" textAlign="center">
            {loading ? "Loading.." : "2048 AI Solver"}
          </Heading>
          
          <Flex 
            direction={["column", "row"]} 
            justify="center"
            w="100%" 
            align="center"
            gap={4}
          >
            <VStack align="center">
              <Text fontSize={["md", "lg"]} fontWeight="bold" textAlign="center">
                Score: {gameState?.score || 0}
              </Text>
              <Text fontSize={["sm", "md"]} textAlign="center">
                Move: {currentIndex} out of {totalStates}
              </Text>
              <Text fontSize={["sm", "md"]} textAlign="center">
                Last Move: {currentMove}
              </Text>
            </VStack>
            
            <Button
              colorScheme="teal"
              onClick={initializeGame}
              loading={loading}
 
            >
              New Game
            </Button>
          </Flex>
          
          {gameState && (
            <Center w="100%">
              <Grid
                templateColumns="repeat(4, 1fr)"
                gap={[1, 2]}
                w={gridSize}
                aspectRatio="1"
                bg="#bbada0"
                p={[2, 3]}
                pb={[4, 4]}
                borderRadius="md"
                mx="auto"
              >
                {gameState.matrix.flat().map((value, index) => (
                  <GridItem
                    key={index}
                    w="100%"
                    aspectRatio="1/1"
                    bg={tileColors[value]?.bg || "#cdc1b4"}
                    color={tileColors[value]?.color || "#776e65"}
                    borderRadius="md"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    fontSize={getFontSize(value)}
                    fontWeight="bold"
                  >
                    {value !== 0 && value}
                  </GridItem>
                ))}
              </Grid>
            </Center>
          )}
          
          {gameOver && (
            <Text color="red.500" fontSize={["lg", "xl"]} fontWeight="bold" textAlign="center">
              Game Over! Final Score: {gameState?.score}
            </Text>
          )}
          
          <Center w="100%">
            <HStack justify="center" flexWrap={["wrap", "nowrap"]}>
              <Button
                colorScheme="blue"
                onClick={handlePrevMove}
                disabled={loading || currentIndex <= 0}
                
              >
                Previous Move
              </Button>
              
              <Button
                colorScheme="blue"
                onClick={handleNextMove}
                disabled={loading || gameOver}
                
              >
                Next Move
              </Button>
              
              <Button
                colorScheme={autoPlay ? "red" : "green"}
                onClick={toggleAutoPlay}
                disabled={gameOver}
              >
                {autoPlay ? "Stop Auto Play" : "Start Auto Play"}
              </Button>
            </HStack>
            
          </Center>
          <text>
              <Text 
                fontSize="md" 
                color="gray.500" 
                mt={4} 
                textAlign="center"
              >
                Created by Javier Lim Jun Yi
              </Text>
              <Text 
                fontSize="xs" 
                color="gray.700" 
                mt={4} 
                textAlign="left"
              >
                The 2048 AI solver is designed to play the game efficiently by combining game mechanics and advanced decision-making algorithms. The game logic handles the initialization of the grid, tile merging, score calculation, and state updates, while the AI solver uses alpha-beta pruning to evaluate possible moves and select the optimal one. The board is represented as a 4x4 matrix, and operations such as merging tiles (`mergeLeft`, `mergeRight`, `mergeUp`, `mergeDown`), transposing, reversing rows, and adding random tiles are implemented to simulate moves. The AI evaluates the board state using heuristics that prioritize weighted tile positions (favoring corners), penalize clustering of dissimilar adjacent tiles, reward monotonicity (smoothness of rows or columns), and encourage empty cell bonuses to maximize utility while minimizing penalties. The solver recursively simulates moves up to a depth of 8, balancing computational efficiency and accuracy. It uses helper functions like `transpose` and `reverse` for efficient matrix manipulation and merges tiles with O(n) complexity using a row-packing algorithm. The AI tracks move history and supports undo functionality for analysis or debugging. To determine the best move, the AI employs alpha-beta pruning with aggressive branch cutoff thresholds to reduce unnecessary computations. The evaluation function combines metrics such as weighted scoring, clustering penalties, monotonicity rewards, and empty cell bonuses to assess each possible move's utility. Despite its deterministic nature, the solver achieves high win rates by prioritizing strategic tile placement and smooth row/column configurations. While effective, limitations include fixed-depth search, deterministic tile placement (always '2's), and no adaptive difficulty scaling. Optimization opportunities include parallel move evaluation, pattern recognition for precomputed opening moves, genetic tuning of weight matrices, and caching repeated board states using transposition tables. This implementation demonstrates a sophisticated balance between heuristic-based evaluation, lookahead search optimization, computational efficiency, and accuracy in simulating game mechanics. It typically achieves high win rates with average scores exceeding 20,000 in testing scenarios.
              </Text>
                      </text>
        </VStack>

      </Center>
    </Container>
  );
};

export default App;
