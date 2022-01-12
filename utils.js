import { ALL_DICE } from "./constants";

export const initBoard = (size) => {
  const totalSquares = size * size;
  const middleRowBottomLimit = Math.floor(size / 2) * size;
  const middleRowTopLimit = middleRowBottomLimit + size - 1;

  const board = {};

  for (let i = 0; i < (totalSquares); i++) {
    board[i] = {
      id: i,
      letter: '',
    };

    if (i >= middleRowBottomLimit && i <= middleRowTopLimit) {
      const randomNumberLessThan6 = Math.floor(Math.random() * 6);
      board[i].letter = ALL_DICE[i % size][randomNumberLessThan6];
    }
  }

  return board;
}