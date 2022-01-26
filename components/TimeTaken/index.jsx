import classnames from "classnames";

import { useGameContext } from "../../context/game-context";
import styles from "./styles.module.scss";

export const TimeTaken = ({ solved, timeTaken }) => {
  const {
    userPreferences
  } = useGameContext();

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
      {userPreferences.showTimer ? (
        <div className={styles.timeTaken}>
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
