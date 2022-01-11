import React, { forwardRef, useContext, useEffect, useState } from 'react';

export const GameContext = React.createContext({
  currentBoardPositions: '................................................................',
  setCurrentBoardPositions: () => {},
  boardWidth: 560,
  screenSize: 560,
  handleChangePosition: () => {},
});

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({
  children
}) => {
  // position stored and displayed on board
  const [currentBoardPositions, setCurrentBoardPositions] = useState('.s.........a.........h...i..........s........h......n....u......');

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

  function handleChangePosition(sourceSq, targetSq, piece) {
    if (sourceSq === targetSq) {
      return;
    }

    const newBoardPositions = currentBoardPositions.split('');
    newBoardPositions[sourceSq] = '.';
    newBoardPositions[targetSq] = piece;

    setCurrentBoardPositions(newBoardPositions.join(''));
  }

  return (
    <GameContext.Provider
      value={{
        currentBoardPositions,
        setCurrentBoardPositions,
        screenSize,
        handleChangePosition
      }}
    >
      {children}
    </GameContext.Provider>
  );
};