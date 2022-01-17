import dayjs from 'dayjs';

import { Button } from '../Button';
import styles from './styles.module.scss';

dayjs.extend(require('dayjs/plugin/relativeTime'));

export function SolvedLabel() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Word Puzzle Name Here',
        url: window.location.href,
        text: "I've just solved this puzzle! Can you do it?"
      })
    } else {

    }
  }
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
          <Button color='green' onClick={handleShare} label={<img src='/share.svg' />} />
        </div>
      </div>
    </div>
  )
};

const getTomorrow = () => {
  const today = dayjs();

  return today.add(1, 'day').format('YYYY-MM-DD');
}