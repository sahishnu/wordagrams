import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/timezone'));
import { BOARD_SIZE, MIN_TIME_FIRST_HINT, GAME_STATES, Good_Luck_Messages, HIGHLIGHTED_POSITIONS } from '../constants';
import { checkBoard, getSuccessMessage } from '../utils/checkBoard';
import { initGame, shuffleBoardPositions } from '../utils/initGame';
import { PersistentStorage } from '../utils/storedGameState';
import { getTimeDisplay } from '../components/TimeTaken';

const todaySlug = dayjs().tz("America/New_York").format('YYYY-MM-DD');

export const INIT_GAME_STATE = {
  board: {},
  state: GAME_STATES.NOT_STARTED,
  timeTaken: 0,
  wordsFound: []
}

export const GameContext = React.createContext({
  gameState: INIT_GAME_STATE,
  disableButtons: false,
  startGame: () => {},
  playAgain: () => {},
  handleChangePosition: () => {},
  checkBoardSolution: () => {},
  shuffleBoard: () => {},
  changeShowHintButtonPreference: () => {},
  changeShowTimerPreference: () => {},
  showHint: () => {},
  leaderBoard: [],
  userPreferences: {
    showTimer: true,
    showHintButton: true
  },
  solvedCount: 0,
  gameInitialized: false,
  highlightedPositions: {}
});

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({
  children,
  puzzle
}) => {
  const [gameState, setGameState] = useState({
    ...INIT_GAME_STATE,
    puzzle
  });
  const [disableButtons, setDisableButtons] = useState(false);
  // stores how many people have solved the puzzle
  const [solvedCount, setSolvedCount] = useState(0);
  const [gameInitialized, setGameInitialized] = useState(false);
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    showTimer: true,
    showHintButton: true
  });
  const [highlightedPositions, setHighlightedPositions] = useState({});

  useEffect(() => {
    // init board on mount
    initBoardOnMount();
    // init user preferences
    const savedUserPrefs = PersistentStorage.getSavedUserPreferences();
    if (savedUserPrefs) {
      const savedPrefTimer = savedUserPrefs.showTimer;
      const savedPrefHintButton = savedUserPrefs.showHintButton;
      setUserPreferences({
        showTimer: savedPrefTimer,
        showHintButton: savedPrefHintButton
      });
    }
  }, []);

  // update time taken each second
  // IF game is IN PROGRESS && initializes
  // this is written to local storage for persistence
  useEffect(() => {
    const timer = setTimeout(() => {
      if (gameState.state === GAME_STATES.IN_PROGRESS && gameInitialized) {
        const timeTaken = gameState.timeTaken;
        setGameState({
          ...gameState,
          timeTaken: timeTaken + 1
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    // updating local storage with new game state
    PersistentStorage.saveGameState(gameState);
  }, [gameState.timeTaken, gameState.state, gameState.board]);

  // initializes the game on mount
  // if there is a saved game state, use that, otherwise get fresh game
  // fetch the solved count to display
  const initBoardOnMount = () => {
    const game = initGame({
      size: BOARD_SIZE,
      puzzle,
      todaySlug
    });
    setGameState({
      ...gameState,
      ...game
    });
    // setSolvedPuzzle(game.solved);
    setGameInitialized(true);
    fetch(`api/solved-count?slug=${todaySlug}`)
    .then((res) => res.json())
    .then((data) => {
      if (data?.hits) {
        setSolvedCount(data.hits);
      }
      if (data?.solveTimes) {
        setLeaderBoard(data.solveTimes);
      }
    });
  };

  const startGame = () => {
    if (disableButtons) {
      return;
    }
    if (gameState.state === GAME_STATES.NOT_STARTED) {
      setDisableButtons(true);
      const countdown = 3;
      Array(countdown).fill(0).map((_, i) => {
        setTimeout(() => {
          setHighlightedPositions(HIGHLIGHTED_POSITIONS[countdown-i])
        }, 1000 * i);
      })
      setTimeout(() => {
        toast(Good_Luck_Messages[Math.floor(Math.random() * Good_Luck_Messages.length)]);
        setHighlightedPositions({});
        setGameState({
          ...gameState,
          state: GAME_STATES.IN_PROGRESS,
        });
        setDisableButtons(false);
      }, 1000 * countdown);
    } else {
      console.error('Game already started');
    }
  };

  const playAgain = () => {
    toast('Play again to find more words!');
    setGameState({
      ...gameState,
      state: GAME_STATES.PLAY_AGAIN
    })
  }

  // shuffles tiles on board
  const shuffleBoard = () => {
    const game = shuffleBoardPositions(BOARD_SIZE, puzzle);
    setGameState({
      ...gameState,
      board: game.board,
    });
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
    if (disableButtons) {
      return;
    }
    setDisableButtons(true);
    setTimeout(() => setDisableButtons(false), 2000);
    const check = await checkBoard(gameState.board, gameState.wordsFound)

    if (check.pass) {
      handleValidSolution(check.newWords);
    } else {
      // display toasters with approprate error messages
      check.errors.forEach(error => toast.error(error));
    }

    return check.pass;
  };

  const handleValidSolution = async (words) => {
    const { timeTaken } = gameState;

    toast.success(getSuccessMessage(timeTaken));

    if (process.env.NODE_ENV === 'production' && gameState.state === GAME_STATES.IN_PROGRESS) {
      // update solved count
      const isTimeTakenValid = !isNaN(timeTaken) && timeTaken > 0 && timeTaken < 60*60*24;

      fetch(`api/solved-count?slug=${todaySlug}`, {
        method: 'POST',
        // include timetaken if it's valid
        ...(isTimeTakenValid ? {
          body: JSON.stringify({timeTaken})
        } : {}),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.hits) {
            setSolvedCount(data.hits);
          }
          if (data?.solveTimes) {
            setLeaderBoard(data.solveTimes);
          }
        })
    }
    setGameState({
      ...gameState,
      wordsFound: [...gameState.wordsFound, ...words],
      state: GAME_STATES.SOLVED,
    });
  }

  // handles dropping a piece in a new spot
  // has to be different than the old spot
  const handleChangePosition = (sourceSq, targetSq, piece) => {
    if (sourceSq === targetSq) {
      return;
    }

    const newBoard = swapBoardPieces(gameState.board, sourceSq, targetSq);

    setGameState({
      ...gameState,
      board: newBoard,
    });
  }

  const showHint = () => {
    const timeTaken = gameState.timeTaken;
    const timeLeftForHint = MIN_TIME_FIRST_HINT - timeTaken;

    if (timeLeftForHint > 0) {
      toast(`Hint available at 4 mins (in ${getTimeDisplay(timeLeftForHint)}) ⏲️`);
    } else {
      const hint = puzzle.words[0];
      toast(`Have you tried ${hint.toUpperCase()} 👀`);
    }

  }

  useEffect(()=> {
    PersistentStorage.saveUserPreferencesToState(userPreferences);
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
        gameState,
        startGame,
        playAgain,
        handleChangePosition,
        checkBoardSolution,
        disableButtons,
        puzzle,
        leaderBoard,
        gameInitialized,
        shuffleBoard,
        showHint,
        solvedCount,
        userPreferences,
        changeShowHintButtonPreference,
        changeShowTimerPreference,
        highlightedPositions
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

const swapBoardPieces = (board, i, j) => {
  const newBoard = Object.assign({}, board);
  const temp = newBoard[i].letter;
  newBoard[i].letter = newBoard[j].letter;
  newBoard[j].letter = temp;

  return newBoard;
}