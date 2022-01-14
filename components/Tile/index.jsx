import React from 'react'
import { useDrag } from 'react-dnd';
import classnames from 'classnames';

import { ItemTypes } from '../../constants';
import styles from './styles.module.scss';

export function Tile({ contents, position, solved }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.TILE,
      item: { contents, position },
      canDrag: !solved,
      collect: monitor => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [contents, position]
  );

  return (
    <div
      ref={drag}
      data-letter={contents}
      className={
        classnames({
          [styles.tile]: true,
          [styles.solved]: solved,
          [styles.tileDragging]: isDragging,
        })
      }
    >
      {contents}
    </div>
  );
}