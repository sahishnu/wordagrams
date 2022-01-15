import styles from './styles.module.scss';

export function Instructions() {
  return (
    <div className={styles.instructions}>
      <ol>
        <li>Arrange the letters on the board to form words.</li>
        <li>Each word must be at least 3 letters.</li>
        <li>The words must connect.</li>
        <li>All the letters must be used!</li>
      </ol>
    </div>
  )
}