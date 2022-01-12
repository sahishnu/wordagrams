import React from 'react'
import { useDrop } from 'react-dnd';
import classnames from 'classnames';

import { useGameContext } from '../../context/game-context';
import { ItemTypes } from '../../constants';
import styles from './styles.module.scss';

export function Square({ position, children }) {
  const {
    handleChangePosition,
    currentPositions,
    setCurrentPositions
  } = useGameContext();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.TILE,
      drop: (tile) => {
        handleChangePosition(tile.position, position, tile.contents)
      },
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
    >
      {children}
      {/* <div className={styles.positionOverlay}>{position}</div> */}
      {isOver && (<div className={styles.isOver} />)}
    </div>
  )
}