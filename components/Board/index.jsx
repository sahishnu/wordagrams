import React from 'react'
import { Square } from '../Square'
import { Tile } from '../Tile'
import { useGameContext } from '../../context/game-context';
import { BOARD_SIZE } from '../../constants';
import styles from './styles.module.scss';

function renderSquare(i, contents) {
  const tile = contents === '' ? null : <Tile position={i} contents={contents} />

  return (
    <Square key={i} position={i}>{tile}</Square>
  );
  return (
    <div key={i} style={{ width: `${100/BOARD_SIZE}%`, height: `${100/BOARD_SIZE}%`}}>
      <Square position={i}>{tile}</Square>
    </div>
  );
}

export function Board() {
  const {
    currentBoardPositions,
  } = useGameContext();

  const squares = []
  for (let i = 0; i < (BOARD_SIZE * BOARD_SIZE); i++) {
    squares.push(renderSquare(i, currentBoardPositions[i].letter))
  }
  return (
    <div
      className={styles.board}
    >
      {squares}
    </div>
  )
}