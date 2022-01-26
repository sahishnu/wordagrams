import React from 'react'

import { Square } from '../Square'
import { Tile } from '../Tile'
import { useGameContext } from '../../context/game-context';
import { SolvedLabel } from '../SolvedLabel';
import { TimeTaken } from '../TimeTaken';
import styles from './styles.module.scss';
import { GAME_STATES, MIN_TIME_FIRST_HINT } from '../../constants';
import { BoardButtons } from './BoardButtons';

export function Board() {
  const {
    checkBoardSolution,
    shuffleBoard,
    startGame,
    gameInitialized,
    showHint,
    userPreferences,
    disableButtons,
    gameState
  } = useGameContext();

  const {
    board,
    state,
    timeTaken
  } = gameState;

  const isSolved = state === GAME_STATES.SOLVED;

  return (
    <>
      {gameInitialized ? (
        <TimeTaken
          gameInitialized={gameInitialized}
          solved={isSolved}
          timeTaken={timeTaken}
        />
      ) : null}
      <div
        className={styles.board}
      >
        {Object.keys(board).map(key => {
          const sq = board[key];
          let tile = sq.letter === '' ? null : <Tile solved={isSolved} position={key} contents={sq.letter} />
          // dont display square if game has not started
          if (state === GAME_STATES.NOT_STARTED) {
            tile = null;
          }
          return <Square key={key} position={key}>{tile}</Square>;
        })}
      </div>
      {isSolved ? <SolvedLabel board={board} timeTaken={timeTaken} /> : (
        <BoardButtons
          shuffleBoard={shuffleBoard}
          state={state}
          disableButtons={disableButtons}
          startGame={startGame}
          checkBoardSolution={checkBoardSolution}
          timeTaken={timeTaken}
          showHint={showHint}
          userPreferences={userPreferences}
        />
      )}
    </>
  )
}