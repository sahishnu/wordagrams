import dayjs from 'dayjs';

import { Button } from '../Button';
import styles from './styles.module.scss';

dayjs.extend(require('dayjs/plugin/relativeTime'));

export function SolvedLabel() {
  return (
    <div className={styles.solvedContainer}>
      <h2 className={styles.solvedMessage}>
        You got it, good job! 🎉
      </h2>
      <div className={styles.bottomRow}>
        <div className={styles.nextPuzzleSection}>
          Next puzzle
          <div className={styles.countdown}>{dayjs().to(getTomorrow())}</div>
        </div>
        <div>
          <Button color='green' label={<img src='/share.svg' />} />
        </div>
      </div>
    </div>
  )
};

const getTomorrow = () => {
  const today = dayjs();

  return today.add(1, 'day').format('YYYY-MM-DD');
}