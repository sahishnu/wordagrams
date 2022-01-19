import { useState, useEffect } from "react";
import classnames from "classnames";

import styles from "./styles.module.scss";

export const TimeTaken = ({ solved }) => {
  const [timeTaken, setTimeTaken] = useState(0);
  const [hide, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!solved) {
        localStorage.setItem('timeTaken', timeTaken + 1);
        setTimeTaken(timeTaken + 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    setTimeTaken(getStoredTime());
  }, [])

  return (<div
    onClick={() => setHidden(!hide)}
    className={
      classnames({
        [styles.timeContainer]: true,
        [styles.hidden]: hide
      })
    }
  >
    <div className={styles.timeTaken}>
      {getDisplay(timeTaken)}
    </div>
  </div>);
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

const getDisplay = (timeTaken) => {
  return timeTaken < 3600
    ? new Date(timeTaken * 1000).toISOString().substr(14, 5)
    : new Date(timeTaken * 1000).toISOString().substr(11, 8);
}

const PersonalBest = () => {
  if (typeof window !== "undefined") {
    const personalBest = localStorage.getItem('personalBest');

    if (!personalBest) {
      return null;
    } else {
      return (<div>{personalBest}</div>)
    }
  } else {
    return null;
  }
}