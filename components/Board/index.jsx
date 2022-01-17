import React from 'react'

import { shuffleBoard } from '../../utils';
import { BOARD_SIZE } from '../../constants';
import { Square } from '../Square'
import { Tile } from '../Tile'
import { useGameContext } from '../../context/game-context';
import { Button } from '../Button';
import { SolvedLabel } from '../SolvedLabel';
import styles from './styles.module.scss';

export function Board() {
  const {
    currentBoardPositions,
    checkBoardSolution,
    solvedPuzzle,
    puzzle
  } = useGameContext();

  return (
    <>
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
          {/* <Button label={<img src='/undo.svg' />} color='orange' onClick={checkBoardSolution} /> */}
          {/* <Button label={<img src='/shuffle.svg' />} color='orange' onClick={handleShuffle} /> */}
          <Button label="Submit" onClick={checkBoardSolution} />
        </div>
      )}
    </>
  )
}