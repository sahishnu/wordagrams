import { LocalStorage } from "./LocalStorage";

export const saveGameState = (board, puzzle, solved) => {
  LocalStorage.removeItem('board');
  const saveGameState = {
    board,
    puzzle,
    solved
  }

  LocalStorage.setItem('board', JSON.stringify(saveGameState));
}

export const getSavedGameState = () => {
  const savedGameState = LocalStorage.getItem('board');

  return JSON.parse(savedGameState);
}

export const saveBoardPositionsToState = (boardPositions) => {
  const savedGameState = LocalStorage.getItem('board');

  const currentState = JSON.parse(savedGameState);
  const newState = {
    ...currentState,
    board: boardPositions
  }

  LocalStorage.setItem('board', JSON.stringify(newState));
}

export const getSavedUserPreferences = () => {
  const savedUserPreferences = LocalStorage.getItem('userPreferences');

  return JSON.parse(savedUserPreferences);
}

export const saveUserPreferencesToState = (userPreferences) => {
  const userPref = JSON.stringify(userPreferences);

  LocalStorage.setItem('userPreferences', userPref);
}