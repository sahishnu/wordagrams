
import { getSavedGameState, saveGameState } from "./storedGameState";

export const initGame = (size, puzzleObj, forceReset) => {
  const game = {};

  if (forceReset || !hasExistingGame(puzzleObj)) {
    game = initFreshGame(size, puzzleObj);
  } else{
    game = initFromSavedState();
  }

  return game;
}

const initFromSavedState = () => {
  const savedGameState = getSavedGameState();

  return savedGameState;
}

const initFreshGame = (size, puzzleObj) => {
  const board = {};
  const totalSquares = size * size;

  for (let i = 0; i < (totalSquares); i++) {
    board[i] = {
      id: i,
      letter: '',
    };
  }

  if (puzzleObj?.letters) {
    const puzzleLetters = shuffleString(puzzleObj.letters);
    const puzzleTileStarts = totalSquares - puzzleLetters.length;

    for (let i = puzzleTileStarts; i < totalSquares; i++) {
      board[i] = {
        id: i,
        letter: puzzleLetters[i - puzzleTileStarts],
      };
    }
  }
  saveGameState(board, puzzleObj, false);
  return {
    board,
    puzzle: puzzleObj,
    solved: false,
  };
}

const hasExistingGame = (puzzle) => {
  if (typeof window !== "undefined") {
    const savedGameState = getSavedGameState();

    if (savedGameState?.puzzle?.letters === puzzle?.letters) {
      return true;
    }
  } else {
    return false;
  }
}

const shuffleString = (value) => {
  const letters = value.split('');
  const len = letters.length;

  for (let i = len - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = letters[i];
    letters[i] = letters[j];
    letters[j] = temp;
  }

  return letters.join('');
}