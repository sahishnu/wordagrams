import { LocalStorage } from "./LocalStorage";
import { getSavedGameState, saveGameState } from "./storedGameState";

export const initGame = ({
  size,
  puzzle: puzzleObj,
  todaySlug
}) => {
  const game = {};

  if (!hasExistingGame(puzzleObj, todaySlug)) {
    console.info('No saved game state found, initializing fresh game!');
    game = initFreshGame(size, puzzleObj);
    game.newGame = true;
    game.takenHint1 = false;
    game.takenHint2 = false;
    LocalStorage.setItem('timeTaken', 0);
    LocalStorage.setItem('takenHint1', false);
    LocalStorage.setItem('takenHint2', false);
  } else{
    console.info('Saved game state found, loading it up!');
    game = initFromSavedState();
    game.newGame = false;
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
    const initPositions = getTileInitPositions(size, puzzleLetters);

    initPositions.forEach((pos, ind) => {
      board[pos] = {
        id: pos,
        letter: puzzleLetters[ind],
      };
    })
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

const getTileInitPositions = (BOARD_SIZE, puzzle) => {

  if (BOARD_SIZE === 9 && puzzle.length === 12) {
    return [65, 66, 67, 68, 69, 73, 74, 75, 76, 77, 78, 79];
  } else {
    const totalSquares = BOARD_SIZE * BOARD_SIZE;
    const puzzleTileStarts = totalSquares - puzzle.length;
    const positions = Array(puzzle.length).fill(0).map((_, ind) => {
      console.log(puzzleTileStarts+ind);
      return puzzleTileStarts + ind;
    });
    return positions;
  }
}