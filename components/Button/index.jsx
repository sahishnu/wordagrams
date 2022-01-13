import styles from './style.module.scss';

export function Button({ onClick }) {
  return (
    <button onClick={onClick} className={styles.pushable}>
      <span className={styles.shadow}></span>
      <span className={styles.edge}></span>
      <span className={styles.front}>
        Submit
      </span>

    </button>
  )
}