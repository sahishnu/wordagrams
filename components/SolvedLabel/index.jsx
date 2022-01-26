import dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/timezone'));
import CountDown from 'react-countdown';
import toast from 'react-hot-toast';

import { Button } from '../Button';
import styles from './styles.module.scss';
import { getShareString } from '../../utils/share';

export function SolvedLabel({ board, timeTaken }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        text: getShareString(board, timeTaken)
      })
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(getShareString(board, timeTaken))
        .then(() => {
          toast.success('Copied to clipboard');
        });
      }
    }
  }
  // gets time till midnight
  const today = dayjs().tz("America/New_York");
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
            date={midnight.valueOf()}
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
