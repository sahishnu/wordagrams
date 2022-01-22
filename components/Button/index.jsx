import classnames from 'classnames';
import styles from './styles.module.scss';

export function Button({ onClick, label, color = 'purple', disabled, narrow }) {

  return (
    <button onClick={onClick} className={classnames(
      styles.pushable,
      { [styles.disabled]: disabled },
    )}>
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
          [styles.narrow]: narrow,
        }
      )}>
        {label}
      </span>
    </button>
  )
}