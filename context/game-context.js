import React, { forwardRef, useContext, useEffect, useState } from 'react';
import { BOARD_SIZE } from '../constants';
import { initBoard, isLetterAbove, isLetterLeft, validateBoard, checkBoard } from '../utils';

export const GameContext = React.createContext({
  currentBoardPositions: initBoard(BOARD_SIZE),
  setCurrentBoardPositions: () => {},
  boardWidth: 560,
  handleChangePosition: () => {},
  checkBoardSolution: () => {},
  solvedPuzzle: false
});

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({
  children
}) => {
  // position stored and displayed on board
  const [currentBoardPositions, setCurrentBoardPositions] = useState(initBoard(BOARD_SIZE));
  const [solvedPuzzle, setSolvedPuzzle] = useState(false);

  /**
   * Go through all tiles and check if words are valid
   */
  const checkBoardSolution = () => {
    const solved = checkBoard(currentBoardPositions)
    setSolvedPuzzle(solved);
  };

  // handles dropping a piece in a new spot
  // has to be an empty spot, different than the old spot
  const handleChangePosition = (sourceSq, targetSq, piece) => {
    if (sourceSq === targetSq) {
      return;
    }
    if (currentBoardPositions[targetSq].letter !== '') {
      return;
    }

    const newBoardPositions = Object.assign({}, currentBoardPositions);
    newBoardPositions[sourceSq].letter = '';
    newBoardPositions[targetSq].letter = piece;

    setCurrentBoardPositions(newBoardPositions);
  }

  return (
    <GameContext.Provider
      value={{
        currentBoardPositions,
        setCurrentBoardPositions,
        handleChangePosition,
        checkBoardSolution,
        solvedPuzzle
      }}
    >
      {children}
    </GameContext.Provider>
  );
};