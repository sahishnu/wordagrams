import { useRouter } from 'next/router'
import classnames from "classnames";

import { useGameContext } from "../../context/game-context";
import styles from "./styles.module.scss";
import { LocalStorage } from '../../utils/LocalStorage';

export const TimeTaken = ({ solved, timeTaken, wordsFound }) => {
  const {
    userPreferences
  } = useGameContext();
  const router = useRouter();
  const { query } = router;

  if (solved && timeTaken === 0) {
    return null;
  };

  const handleClickTimer = () => {
    if (query.dev === 'true') {
      LocalStorage.clear();
      router.reload()
    }
  }

  return (
    <div
      className={
        classnames({
          [styles.solved]: solved,
          [styles.timeContainer]: true,
        })
      }
    >
      {solved ? (<div className={styles.wordsFoundCount}>
      <div className={styles.star}>🌟</div> {wordsFound.length}
      </div>) : <div></div>}
      {userPreferences.showTimer ? (
        <div onClick={handleClickTimer} className={styles.timeTaken}>
          {solved ? 'Solved in ' : ''}
          {getTimeDisplay(timeTaken)}
        </div>
      ) : null}
    </div>
  );
}

// if less than an hour, return minutes:seconds
// else return hours:minutes:seconds
export const getTimeDisplay = (timeTaken) => {
  return timeTaken < 3600
    ? new Date(timeTaken * 1000).toISOString().substr(14, 5)
    : new Date(timeTaken * 1000).toISOString().substr(11, 8);
}
