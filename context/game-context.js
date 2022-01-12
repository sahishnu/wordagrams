import React, { forwardRef, useContext, useEffect, useState } from 'react';
import { BOARD_SIZE } from '../constants';
import { initBoard } from '../utils';

export const GameContext = React.createContext({
  currentBoardPositions: initBoard(BOARD_SIZE),
  setCurrentBoardPositions: () => {},
  boardWidth: 560,
  handleChangePosition: () => {},
});

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({
  children
}) => {
  // position stored and displayed on board
  const [currentBoardPositions, setCurrentBoardPositions] = useState(initBoard(BOARD_SIZE));
  // screen size
  const [screenSize, setScreenSize] = useState(undefined);

  // init screen size listener to update screen size on any window size changes
  useEffect(() => {
    function handleResize() {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};