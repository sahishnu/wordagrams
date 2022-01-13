import { ALL_DICE } from "./constants";
import PUZZLES from './puzzles.json';

export const initBoard = (size) => {
  const puzzle = getRandomPuzzleFromFile();
  const puzzleLetters = puzzle.letters;
  console.log(puzzle);

  const totalSquares = size * size;
  const lastRowStart = size * (size - 1);

  const board = {};

  for (let i = 0; i < (totalSquares); i++) {
    board[i] = {
      id: i,
      letter: '',
    };

    if (i >= lastRowStart && i < (lastRowStart + puzzleLetters.length)) {
      board[i] = {
        id: i,
        letter: puzzleLetters[i - lastRowStart],
      };
    }
  }

  return board;
}

const getRandomPuzzleFromFile = () => {
  const puzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
  return puzzle;
}