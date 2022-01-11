import React from 'react'
import { useDrag } from 'react-dnd';

import { ItemTypes } from '../../constants';
import styles from './styles.module.scss';

export function Tile({ contents, position }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.TILE,
      item: { contents, position },
      collect: monitor => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [contents, position]
  );

  return (
    <div
      ref={drag}
      className={
        isDragging ? styles.tileDragging : styles.tile
      }
    >
      {contents}
    </div>
  );
}