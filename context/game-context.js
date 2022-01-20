import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/timezone'));
import { BOARD_SIZE } from '../constants';
import { checkBoard } from '../utils/checkBoard';
import { initGame, shuffleBoard } from '../utils/initGame';
import { saveGameState } from '../utils/storedGameState';

const todaySlug = dayjs().tz("America/New_York").format('YYYY-MM-DD');

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
    initBoardOnMount();
  }, []);

  // initializes the game on mount
  // if there is a saved game state, use that, otherwise get fresh game
  // fetch the solved count to display
  const initBoardOnMount = () => {
    const game = initGame({
      size: BOARD_SIZE,
      puzzle,
      todaySlug
    });
    setCurrentBoardPositions(game.board);
    setSolvedPuzzle(game.solved);
    fetch(`api/solved-count?slug=${todaySlug}`)
    .then((res) => res.json())
    .then((data) => {
      if (data?.hits) {
        setSolvedCount(data.hits);
      }
    });
  }

  // shuffles tiles on board
  const resetGame = () => {
    const game = shuffleBoard(BOARD_SIZE, puzzle);
    setCurrentBoardPositions(game.board);
  };

  /**
   * Go through all tiles and check if words are valid
   *
   * if valid, update solved state in localStorage and useState
   * hit api to increment solved count
   *
   * if invalid, display toasters with approprate message
   */
  const checkBoardSolution = async () => {
    const check = await checkBoard(currentBoardPositions)

    if (check.pass) {
      toast.success("Congratulations! You solved the puzzle!");
      saveGameState(currentBoardPositions, puzzle, check.pass);
      setSolvedPuzzle(true);
      updatePersonalBest();
      // update solved count
      fetch(`api/solved-count?slug=${todaySlug}`, { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          if (data?.hits) {
            setSolvedCount(data.hits);
          }
        })
    } else {
      check.errors.forEach(error => toast.error(error));
    }

    return check.pass;
  };

  const updatePersonalBest = () => {
    const timeTaken = localStorage.getItem('timeTaken');
    const personalBest = localStorage.getItem('personalBest');

    if (!timeTaken) {
      return;
    }

    if (!personalBest) {
      localStorage.setItem('personalBest', timeTaken);
    } else if (timeTaken < personalBest) {
      localStorage.setItem('personalBest', timeTaken);
    };
  }

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