import React from 'react'

import { Square } from '../Square'
import { Tile } from '../Tile'
import { useGameContext } from '../../context/game-context';
import { Button } from '../Button';
import { SolvedLabel } from '../SolvedLabel';
import { getTimeDisplay, TimeTaken } from '../TimeTaken';
import styles from './styles.module.scss';

export function Board() {
  const {
    currentBoardPositions,
    checkBoardSolution,
    solvedPuzzle,
    shuffleBoard,
    gameInitialized,
    fastestTime,
    showHint,
    past4MinMark,
    userPreferences
  } = useGameContext();

  return (
    <>
      {gameInitialized ? (
        <TimeTaken
          gameInitialized={gameInitialized}
          solved={solvedPuzzle}
          fastestTime={fastestTime}
        />
      ) : null}
      <div
        className={styles.board}
      >
        {Object.keys(currentBoardPositions).map(key => {
          const sq = currentBoardPositions[key];
          const tile = sq.letter === '' ? null : <Tile solved={solvedPuzzle} position={key} contents={sq.letter} />

          return <Square key={key} position={key}>{tile}</Square>;
        })}
      </div>
      {solvedPuzzle ? <SolvedLabel board={currentBoardPositions} /> : (
        <div className={styles.buttonRow}>
          <Button label={<img src='/shuffle.svg' />} color='orange' onClick={shuffleBoard} />
          <Button label="Submit" onClick={checkBoardSolution} />
          {
            userPreferences.showHintButton ? (
              <Button
                disabled={!past4MinMark}
                narrow
                label={<img src='/hint.svg' />}
                color='green'
                onClick={showHint}
              />
            ) : null}
        </div>
      )}
    </>
  )
}