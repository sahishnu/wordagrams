import classnames from 'classnames';
import styles from './style.module.scss';

export function Button({ onClick, label, color = 'purple' }) {

  return (
    <button onClick={onClick} className={styles.pushable}>
      <span className={styles.shadow}></span>
      <span className={classnames(
        styles.edge,
        {
          [styles.purpleEdge]: color === 'purple',
          [styles.orangeEdge]: color === 'orange',
          [styles.greenEdge]: color === 'green',
        }
      )}></span>
      <span className={classnames(
        styles.front,
        {
          [styles.purpleFront]: color === 'purple',
          [styles.orangeFront]: color === 'orange',
          [styles.greenFront]: color === 'green',
        }
      )}>
        {label}
      </span>

    </button>
  )
}