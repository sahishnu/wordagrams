import { getSavedGameState, saveGameState } from "./storedGameState";
import { LocalStorage } from "./LocalStorage";

export const initGame = ({
  size,
  puzzle: puzzleObj,
  todaySlug
}) => {
  const game = {};

  if (!hasExistingGame(puzzleObj, todaySlug)) {
    console.info('No saved game state found, initializing fresh game!');
    LocalStorage.setItem('timeTaken', 0);
    game = initFreshGame(size, puzzleObj);
  } else{
    console.info('Saved game state found, loading it up!');
    game = initFromSavedState();
  }

  return game;
}

export const shuffleBoardPositions = (size, puzzle) => {
  console.info('Mixing up the board!');
  return initFreshGame(size, puzzle);
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

// we know game exists if
// LocalStorage has a saved game state dated from today
const hasExistingGame = (puzzle, todaySlug) => {

    const savedGameState = getSavedGameState();

    if (
      (savedGameState?.puzzle?.letters === puzzle?.letters) &&
      (savedGameState?.puzzle?.date === todaySlug)
    ) {
      return true;
    }
    return false;
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