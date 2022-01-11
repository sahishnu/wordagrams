import React from 'react'
import { Square } from '../Square'
import { Tile } from '../Tile'
import { useGameContext } from '../../context/game-context';

import styles from './styles.module.scss';

function renderSquare(i, contents) {
  const tile = contents === '' ? null : <Tile position={i} contents={contents} />

  return (
    <div key={i} style={{ width: '12.5%', height: '12.5%' }}>
      <Square position={i}>{tile}</Square>
    </div>
  );
}

export function Board() {
  const {
    currentBoardPositions,
    boardWidth
  } = useGameContext();

  const positions = [ ...currentBoardPositions ];
  const squares = []
  for (let i = 0; i < 64; i++) {
    squares.push(renderSquare(i, positions[i]))
  }
  return (
    <div
      className={styles.board}
    >
      {squares}
    </div>
  )
}