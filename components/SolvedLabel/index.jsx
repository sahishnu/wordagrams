import dayjs from 'dayjs';
import CountDown from 'react-countdown';
import toast from 'react-hot-toast';

import { Button } from '../Button';
import styles from './styles.module.scss';
import { getShareString } from '../../utils/share';

export function SolvedLabel({ board }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        text: getShareString(board)
      })
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(getShareString(board))
        .then(() => {
          toast.success('Copied to clipboard');
        });
      }
    }
  }
  // gets time till midnight
  const today = dayjs();
  const midnight = today.add(1, 'day').startOf('day');
  return (
    <div className={styles.solvedContainer}>
      <h2 className={styles.solvedMessage}>
        You got it, good job! 🎉
      </h2>
      <div className={styles.bottomRow}>
        <div className={styles.nextPuzzleSection}>
          Next puzzle
          <CountDown
            date={midnight}
            zeroPadTime={2}
            renderer={props => (<div
              className={styles.countdown}>
              {props.hours}h {props.minutes}m {props.seconds}s
            </div>)}
          />
        </div>
        <div>
          <Button color='green' onClick={handleShare} label={<img src='/share.svg' />} />
        </div>
      </div>
    </div>
  )
};
