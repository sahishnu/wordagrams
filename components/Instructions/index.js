import styles from './styles.module.scss';

export function Instructions() {
  return (
    <div className={styles.instructions}>
      <ol>
        <li>Arrange your letters to form words on the board.</li>
        <li>Each word must be at least 3 letters.</li>
        <li>The words must connect.</li>
        <li>All letters must be used!</li>
      </ol>
    </div>
  )
}