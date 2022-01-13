import { ALL_DICE } from "./constants";
import PUZZLES from './puzzles.json';

export const initBoard = (size) => {
  const puzzle = getRandomPuzzleFromFile();
  const puzzleLetters = puzzle.letters;
  console.log(puzzle);

  const totalSquares = size * size;
  const puzzleTileStarts = totalSquares - puzzleLetters.length;

  const board = {};

  for (let i = 0; i < (totalSquares); i++) {
    board[i] = {
      id: i,
      letter: '',
    };

    if (i >= puzzleTileStarts) {
      board[i] = {
        id: i,
        letter: puzzleLetters[i - puzzleTileStarts],
      };
    }
  }

  return board;
}

const getRandomPuzzleFromFile = () => {
  const puzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
  return puzzle;
}