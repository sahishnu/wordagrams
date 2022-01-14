import React from 'react'
import { useDrop } from 'react-dnd';

import { useGameContext } from '../../context/game-context';
import { ItemTypes, BOARD_SIZE } from '../../constants';
import styles from './styles.module.scss';

export function Square({ position, children }) {
  const {
    handleChangePosition,
  } = useGameContext();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.TILE,
      drop: (tile) => handleChangePosition(tile.position, position, tile.contents),
      collect: (monitor) => ({
        isOver: !!monitor.isOver()
      })
    }),
    // [square, currentPosition, onPieceDrop, waitingForAnimation, lastPieceColour]
  );
  return (
    <div
      ref={drop}
      className={styles.square}
      data-col={position % BOARD_SIZE}
      data-row={Math.floor(position / BOARD_SIZE)}
    >
      {children}
      {/* <div className={styles.positionOverlay}>{position}</div> */}
      {isOver && (<div className={styles.isOver} />)}
    </div>
  )
}