import React, { forwardRef, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

import { BOARD_SIZE } from '../constants';
import { checkBoard } from '../utils/checkBoard';
import { initGame } from '../utils/initGame';
import { saveGameState } from '../storedGameState';

const fetcher = (...args) => fetch(...args).then(res => res.json())
const todaySlug = dayjs().format('YYYY-MM-DD');

export const GameContext = React.createContext({
  currentBoardPositions: {},
  setCurrentBoardPositions: () => {},
  handleChangePosition: () => {},
  checkBoardSolution: () => {},
  resetGame: () => {},
  solvedPuzzle: false,
  solvedCount: 0,
});

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({
  children,
  puzzle
}) => {
  // position stored and displayed on board
  const [currentBoardPositions, setCurrentBoardPositions] = useState({});
  const [solvedPuzzle, setSolvedPuzzle] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    const game = initGame(BOARD_SIZE, puzzle);
    setCurrentBoardPositions(game.board);
    setSolvedPuzzle(game.solved);
    fetch(`api/solved-count?slug=${todaySlug}`)
    .then((res) => res.json())
    .then((data) => {
      if (data?.hits) {
        setSolvedCount(data.hits);
      }
    })
  }, []);

  const resetGame = () => {
    const game = initGame(BOARD_SIZE, puzzle, true);
    setCurrentBoardPositions(game.board);
  };

  /**
   * Go through all tiles and check if words are valid
   */
  const checkBoardSolution = async () => {
    const check = await checkBoard(currentBoardPositions)

    if (check.pass) {
      toast.success("Congratulations! You solved the puzzle!");
      saveGameState(currentBoardPositions, puzzle, check.pass);
      setSolvedPuzzle(true);
      // update solved count
      fetch(`api/solved-count?slug=${todaySlug}`, { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          if (data?.hits) {
            setSolvedCount(data.hits);
          }
        })
    } else {
      console.log(check.errors);
      check.errors.forEach(error => toast.error(error));
    }

    return check.pass;
  };

  // handles dropping a piece in a new spot
  // has to be an empty spot, different than the old spot
  const handleChangePosition = (sourceSq, targetSq, piece) => {
    if (sourceSq === targetSq) {
      return;
    }

    const newBoardPositions = Object.assign({}, currentBoardPositions);

    const temp = newBoardPositions[sourceSq].letter;
    newBoardPositions[sourceSq].letter = newBoardPositions[targetSq].letter;
    newBoardPositions[targetSq].letter = temp;

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
        puzzle,
        resetGame,
        solvedCount
      }}
    >
      {children}
    </GameContext.Provider>
  );
};