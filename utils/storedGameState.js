import { LocalStorage } from "./LocalStorage";

export const PersistentStorage = {
  saveGameState: (gameState) => saveGameState(gameState),
  getSavedGameState: () => getSavedGameState(),
  getSavedUserPreferences: () => getSavedUserPreferences(),
  saveUserPreferencesToState: (userPreferences) => saveUserPreferencesToState(userPreferences)
};

const saveGameState = (gameState) => {
  LocalStorage.setItem('gameState', JSON.stringify(gameState));
}

const getSavedGameState = () => {
  const savedGameState = LocalStorage.getItem('gameState');

  return JSON.parse(savedGameState);
}

const getSavedUserPreferences = () => {
  const savedUserPreferences = LocalStorage.getItem('userPreferences');

  return JSON.parse(savedUserPreferences);
}

const saveUserPreferencesToState = (userPreferences) => {
  const userPref = JSON.stringify(userPreferences);

  LocalStorage.setItem('userPreferences', userPref);
}