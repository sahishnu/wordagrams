export const saveGameState = (board, puzzle, solved) => {
  localStorage.removeItem('board');
  const saveGameState = {
    board,
    puzzle,
    solved
  }

  localStorage.setItem('board', JSON.stringify(saveGameState));
}

export const getSavedGameState = () => {
  const savedGameState = localStorage.getItem('board');

  return JSON.parse(savedGameState);
}

export const saveBoardPositionsToState = (boardPositions) => {
  const savedGameState = localStorage.getItem('board');

  const currentState = JSON.parse(savedGameState);
  const newState = {
    ...currentState,
    board: boardPositions
  }

  localStorage.setItem('board', JSON.stringify(newState));
}