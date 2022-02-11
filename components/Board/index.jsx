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
    playAgain,
    gameState,
    highlightedPositions
  } = useGameContext();
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    board,
    state,
    timeTaken,
    puzzle,
    wordsFound
  } = gameState;

  const isSolved = state === GAME_STATES.SOLVED;
  const isPlayAgain = state === GAME_STATES.PLAY_AGAIN;

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
          solved={isSolved || isPlayAgain}
          wordsFound={wordsFound}
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
      <BoardButtons
          shuffleBoard={shuffleBoard}
          state={state}
          disableButtons={disableButtons}
          startGame={handleStartGame}
          checkBoardSolution={checkBoardSolution}
          timeTaken={timeTaken}
          showHint={showHint}
          puzzle={puzzle}
          userPreferences={userPreferences}
      />
      {(isSolved || isPlayAgain) ? (<SolvedLabel
        playAgain={playAgain}
        wordsFound={wordsFound}
        board={board}
        timeTaken={timeTaken}
        isSolved={isSolved}
        isPlayAgain={isPlayAgain}
      />) : null}
      <PromptSignInModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        startGame={startGame}
        signIn={signIn}
      />
    </>
  )
}