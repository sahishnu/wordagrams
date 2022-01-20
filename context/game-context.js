import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/timezone'));
import { BOARD_SIZE } from '../constants';
import { checkBoard } from '../utils/checkBoard';
import { initGame, shuffleBoardPositions } from '../utils/initGame';
import { saveGameState } from '../utils/storedGameState';
import { LocalStorage } from '../utils/LocalStorage';

const todaySlug = dayjs().tz("America/New_York").format('YYYY-MM-DD');

export const GameContext = React.createContext({
  currentBoardPositions: {},
  setCurrentBoardPositions: () => {},
  handleChangePosition: () => {},
  checkBoardSolution: () => {},
  shuffleBoard: () => {},
  solvedPuzzle: false,
  solvedCount: 0,
  gameInitialized: false,
  fastestTime: 0
});

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({
  children,
  puzzle
}) => {
  // position stored and displayed on board
  const [currentBoardPositions, setCurrentBoardPositions] = useState({});
  // stores whether puzzle is solved or not
  const [solvedPuzzle, setSolvedPuzzle] = useState(false);
  // stores how many people have solved the puzzle
  const [solvedCount, setSolvedCount] = useState(0);
  const [gameInitialized, setGameInitialized] = useState(false);
  const [fastestTime, setFastestTime] = useState(0);

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
    if (game.newGame) {
      LocalStorage.setItem('timeTaken', 0);
    }
    setGameInitialized(true);
    fetch(`api/solved-count?slug=${todaySlug}`)
    .then((res) => res.json())
    .then((data) => {
      if (data?.hits) {
        setSolvedCount(data.hits);
      }
      if (data?.fastestTime) {
        setFastestTime(data.fastestTime);
      }
    });
  }

  // shuffles tiles on board
  const shuffleBoard = () => {
    const game = shuffleBoardPositions(BOARD_SIZE, puzzle);
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

      if (process.env.NODE_ENV === 'production') {
        // update solved count
        const timeTaken = parseInt(LocalStorage.getItem('timeTaken'));
        const isTimeTakenValid = !isNaN(timeTaken) && timeTaken > 0 && timeTaken < 60*60*24;

        fetch(`api/solved-count?slug=${todaySlug}`, {
          method: 'POST',
          // include timetaken if it's valid
          ...(isTimeTakenValid ? {
            body: JSON.stringify({ timeTaken})
          } : {}),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.hits) {
              setSolvedCount(data.hits);
            }
            if (data?.fastestTime) {
              setFastestTime(data.fastestTime);
            }
          })
      }
      console.log(process.env.NODE_ENV);
    } else {
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
        gameInitialized,
        shuffleBoard,
        solvedCount,
        fastestTime
      }}
    >
      {children}
    </GameContext.Provider>
  );
};