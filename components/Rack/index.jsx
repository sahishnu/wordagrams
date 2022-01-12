import React from 'react'
import { Square } from '../Square'
import { Tile } from '../Tile'
import { useGameContext } from '../../context/game-context';

import styles from './styles.module.scss';

function renderSquare(i, contents) {
  const tile = contents === '' ? null : <Tile position={i} contents={contents} />

  return (
    <div key={i} style={{ width: '12.5%', height: '100%' }}>
      <Square position={i}>{tile}</Square>
    </div>
  );
}

export function Rack() {
  const {
    currentRackPositions,
    boardWidth
  } = useGameContext();

  const positions = [ ...currentRackPositions ];
  const squares = []
  for (let i = 0; i < 8; i++) {
    squares.push(renderSquare(i, positions[i]))
  }
  return (
    <div
      className={styles.rack}
    >
      {squares}
    </div>
  )
}