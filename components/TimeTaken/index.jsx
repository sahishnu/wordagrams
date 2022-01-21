import { useState, useEffect } from "react";
import classnames from "classnames";

import styles from "./styles.module.scss";

export const TimeTaken = ({ solved, gameInitialized }) => {
  const [timeTaken, setTimeTaken] = useState(0);

  // update time taken each second
  // IF game is NOT solved & game is initialized
  // this is written to local storage for persistence
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!solved && gameInitialized) {
        localStorage.setItem('timeTaken', timeTaken + 1);
        setTimeTaken(timeTaken + 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  // on mount, read stored time from local storage  and set timeTaken
  useEffect(() => {
    setTimeTaken(getStoredTime());
  }, [])

  if (solved && timeTaken === 0) {
    return null;
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
      <div className={styles.timeTaken}>
        {solved ? 'Solved in ' : ''}
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
