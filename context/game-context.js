import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/timezone'));
import { BOARD_SIZE, MIN_TIME_FIRST_HINT } from '../constants';
import { checkBoard } from '../utils/checkBoard';
import { initGame, shuffleBoardPositions } from '../utils/initGame';
import { getSavedUserPreferences, saveGameState, saveUserPreferencesToState } from '../utils/storedGameState';
import { LocalStorage } from '../utils/LocalStorage';
import { getTimeDisplay } from '../components/TimeTaken';

const todaySlug = dayjs().tz("America/New_York").format('YYYY-MM-DD');

export const GameContext = React.createContext({
  currentBoardPositions: {},
  setCurrentBoardPositions: () => {},
  handleChangePosition: () => {},
  checkBoardSolution: () => {},
  shuffleBoard: () => {},
  changeShowHintButtonPreference: () => {},
  changeShowTimerPreference: () => {},
  showHint: () => {},
  userPreferences: {
    showTimer: true,
    showHintButton: true
  },
  solvedPuzzle: false,
  solvedCount: 0,
  timeTaken: 0,
  past4MinMark: false,
  takenHint1: false,
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
  const [timeTaken, setTimeTaken] = useState(0);
  const [gameInitialized, setGameInitialized] = useState(false);
  const [fastestTime, setFastestTime] = useState(0);
  const [takenHint1, setTakenHint1] = useState(false);
  const [past4MinMark, setPast4MinMark] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    showTimer: true,
    showHintButton: true
  });

  useEffect(() => {
    // init board on mount
    initBoardOnMount();
    // init user preferences
    const savedUserPrefs = getSavedUserPreferences();
    if (savedUserPrefs) {
      const savedPrefTimer = savedUserPrefs.showTimer;
      const savedPrefHintButton = savedUserPrefs.showHintButton;
      setUserPreferences({
        showTimer: savedPrefTimer,
        showHintButton: savedPrefHintButton
      });
    }
    // on mount, read stored time from local storage and set timeTaken
    setTimeTaken(getStoredTime());
  }, []);

  // update time taken each second
  // IF game is NOT solved & game is initialized
  // this is written to local storage for persistence
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!solvedPuzzle && gameInitialized) {
        localStorage.setItem('timeTaken', timeTaken + 1);
        setTimeTaken(timeTaken + 1);

        if (timeTaken >= MIN_TIME_FIRST_HINT && !past4MinMark) {
          setPast4MinMark(true);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

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
    setTakenHint1(!!game.takenHint1);
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

  const showHint = () => {
    const timeTaken = parseInt(LocalStorage.getItem('timeTaken'));
    const timeLeftForHint = MIN_TIME_FIRST_HINT - timeTaken;

    if (timeLeftForHint > 0) {
      toast(`Hint available at 4 mins (in ${getTimeDisplay(timeLeftForHint)}) ⏲️`);
    } else {
      const hint = puzzle.words[0];
      toast(`Have you tried ${hint.toUpperCase()} 👀`);
      setTakenHint1(true);
      LocalStorage.setItem('takenHint1', true);
    }

  }

  useEffect(()=> {
    saveUserPreferencesToState(userPreferences);
  }, [userPreferences])

  const changeShowTimerPreference = (val) => {
    setUserPreferences({
      ...userPreferences,
      showTimer: val
    });
  }
  const changeShowHintButtonPreference = (val) => {
    setUserPreferences({
      ...userPreferences,
      showHintButton: val
    });
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
        showHint,
        solvedCount,
        fastestTime,
        timeTaken,
        past4MinMark,
        takenHint1,
        userPreferences,
        changeShowHintButtonPreference,
        changeShowTimerPreference
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// get time stored in local storage for this puzzle
// if no time stored, return 0
// if no game stored, return 0
//  else return time stored
const getStoredTime = () => {
  if (typeof window !== "undefined") {

    const savedGame = localStorage.getItem('board');
    const timeTaken = localStorage.getItem('timeTaken');

    if (!savedGame) {
      return 0;
    } else if (!timeTaken) {
      return 0;
    } else {
      return parseInt(timeTaken);
    }
  }

  return 0;
}