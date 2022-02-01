import React, { useState } from 'react'
import { useSession, signIn } from "next-auth/react";

import { Square } from '../Square'
import { Tile } from '../Tile'
import { useGameContext } from '../../context/game-context';
import { SolvedLabel } from '../SolvedLabel';
import { TimeTaken } from '../TimeTaken';
import styles from './styles.module.scss';
import { GAME_STATES } from '../../constants';
import { BoardButtons } from './BoardButtons'
import { PromptSignInModal } from '../PromptSignInModal';

export function Board() {
  const {
    checkBoardSolution,
    shuffleBoard,
    startGame,
    gameInitialized,
    showHint,
    userPreferences,
    disableButtons,
    gameState,
    highlightedPositions
  } = useGameContext();
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    board,
    state,
    timeTaken,
  } = gameState;

  const isSolved = state === GAME_STATES.SOLVED;

  const handleStartGame = () => {
    if (session) {
      startGame();
    } else {
      setIsModalOpen(true);
    }
  }

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

          return <Square key={key} highlighted={highlightedPositions[key]} position={key}>{tile}</Square>;
        })}
      </div>
      {isSolved ? <SolvedLabel board={board} timeTaken={timeTaken} /> : (
        <BoardButtons
          shuffleBoard={shuffleBoard}
          state={state}
          disableButtons={disableButtons}
          startGame={handleStartGame}
          checkBoardSolution={checkBoardSolution}
          timeTaken={timeTaken}
          showHint={showHint}
          userPreferences={userPreferences}
        />
      )}
      <PromptSignInModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        startGame={startGame}
        signIn={signIn}
      />
    </>
  )
}