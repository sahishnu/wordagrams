import classnames from "classnames";

import { useGameContext } from "../../context/game-context";
import styles from "./styles.module.scss";

export const TimeTaken = () => {
  const {
    solvedPuzzle,
    timeTaken
  } = useGameContext();

  if (solvedPuzzle && timeTaken === 0) {
    return null;
  }

  return (
    <div
      className={
        classnames({
          [styles.solved]: solvedPuzzle,
          [styles.timeContainer]: true,
        })
      }
    >
      <div className={styles.timeTaken}>
        {solvedPuzzle ? 'Solved in ' : ''}
        {getTimeDisplay(timeTaken)}
      </div>
    </div>
  );
}


// get time stored in local storage for this puzzle
// if no time stored, return 0
// if no game stored, return 0
//  else return time stored
const getStoredTime = () => {
  if (typeof window !== "undefined") {

    const savedGame = localStorage.getItem('board');
    const timeTaken = localStorage.getItem('timeTaken');

    if (!savedGame) {
      return 0;
    } else if (!timeTaken) {
      return 0;
    } else {
      return parseInt(timeTaken);
    }
  }

  return 0;
}

// if less than an hour, return minutes:seconds
// else return hours:minutes:seconds
export const getTimeDisplay = (timeTaken) => {
  return timeTaken < 3600
    ? new Date(timeTaken * 1000).toISOString().substr(14, 5)
    : new Date(timeTaken * 1000).toISOString().substr(11, 8);
}
