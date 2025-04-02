import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Grid, GridItem, Text, VStack, HStack, Heading } from '@chakra-ui/react';
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

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentMove, setCurrentMove] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalStates, setTotalStates] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

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

  return (
      <Box p={5} maxW="800px" mx="auto">
        <VStack>
          <Heading as="h1" size="xl" color="teal.500">2048 AI Solver</Heading>
          
          <Flex justify="space-between" w="100%" align="center">
            <VStack align="start">
              <Text fontSize="lg" fontWeight="bold">Score: {gameState?.score || 0}</Text>
              <Text>Move: {currentMove}</Text>
              <Text>State: {currentIndex + 1} / {totalStates}</Text>
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
            <Grid
              templateColumns="repeat(4, 1fr)"
              gap={2}
              w="350px"
              h="350px"
              bg="#bbada0"
              p={3}
              borderRadius="md"
            >
              {gameState.matrix.flat().map((value, index) => (
                <GridItem
                  key={index}
                  w="100%"
                  h="80px"
                  bg={tileColors[value]?.bg || "#cdc1b4"}
                  color={tileColors[value]?.color || "#776e65"}
                  borderRadius="md"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  fontSize={value > 100 ? (value > 1000 ? "xl" : "2xl") : "3xl"}
                  fontWeight="bold"
                >
                  {value !== 0 && value}
                </GridItem>
              ))}
            </Grid>
          )}
          
          {gameOver && (
            <Text color="red.500" fontSize="xl" fontWeight="bold">
              Game Over! Final Score: {gameState?.score}
            </Text>
          )}
          
          <HStack >
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
        </VStack>
      </Box>
  );
};

export default App;
