import React, { forwardRef, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BOARD_SIZE } from '../constants';
import { initGame, checkBoard } from '../utils';
import { saveGameState } from '../storedGameState';

export const GameContext = React.createContext({
  currentBoardPositions: {},
  setCurrentBoardPositions: () => {},
  boardWidth: 560,
  handleChangePosition: () => {},
  checkBoardSolution: () => {},
  solvedPuzzle: false
});

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({
  children,
  puzzle
}) => {
  // position stored and displayed on board
  const [currentBoardPositions, setCurrentBoardPositions] = useState({});
  const [solvedPuzzle, setSolvedPuzzle] = useState(false);

  useEffect(() => {
    const game = initGame(BOARD_SIZE, puzzle);
    setCurrentBoardPositions(game.board);
    setSolvedPuzzle(game.solved);
  }, [])

  /**
   * Go through all tiles and check if words are valid
   */
  const checkBoardSolution = () => {
    const check = checkBoard(currentBoardPositions)

    if (check.pass) {
      toast.success("Congratulations! You solved the puzzle!");
      saveGameState(currentBoardPositions, puzzle, check.pass);
      setSolvedPuzzle(true);
    } else {
      toast.error(
        check.errors
      )
    }
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

    saveGameState(newBoardPositions, puzzle, solvedPuzzle);
    setCurrentBoardPositions(newBoardPositions);
  }

  return (
    <GameContext.Provider
      value={{
        currentBoardPositions,
        setCurrentBoardPositions,
        handleChangePosition,
        checkBoardSolution,
        solvedPuzzle,
        puzzle
      }}
    >
      {children}
    </GameContext.Provider>
  );
};