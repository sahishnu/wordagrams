import styles from './styles.module.scss';

export function Instructions() {
  return (
    <div className={styles.instructions}>
      <ol>
        <li>Use up all your letters to form words on the board.</li>
        <li>Each word must be at least 3 letters.</li>
        <li>All letters must be used!</li>
      </ol>
    </div>
  )
}