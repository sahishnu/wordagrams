import React from 'react'
import { useDrop } from 'react-dnd';
import classnames from 'classnames';

import { useGameContext } from '../../context/game-context';
import { ItemTypes, BOARD_SIZE, GAME_STATES } from '../../constants';
import styles from './styles.module.scss';

export function Square({ position, highlighted, children }) {
  const {
    handleChangePosition,
    gameState
  } = useGameContext();

  const {
    state
  } = gameState;

  const isSolved = state === GAME_STATES.SOLVED;

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.TILE,
      drop: (tile) => handleChangePosition(tile.position, position, tile.contents),
      collect: (monitor) => ({
        isOver: !!monitor.isOver()
      }),
      canDrop: monitor => !isSolved,
    }),
    [position, children, handleChangePosition, isSolved]
  );

  return (
    <div
      ref={drop}
      className={classnames(styles.square, { [styles.highlighted]: highlighted })}
      data-col={position % BOARD_SIZE}
      data-row={Math.floor(position / BOARD_SIZE)}
    >
      {children}
      {/* <div className={styles.positionOverlay}>{position}</div> */}
      {isOver && (<div className={styles.isOver} />)}
    </div>
  )
}